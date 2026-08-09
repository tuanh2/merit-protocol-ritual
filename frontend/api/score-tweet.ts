// Vercel Edge Function: Score tweet content using OpenRouter AI
// Uses user's OpenRouter API key stored in OPENROUTER_API_KEY env variable

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let body: { tweetText: string; baremCriteria: string[]; requirements: { minWords: number; requiredMentions: string[]; requiredHashtags: string[]; requiredKeywords: string[] } };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { tweetText, baremCriteria, requirements } = body;

  if (!tweetText || tweetText.trim().split(/\s+/).length < 5) {
    return new Response(JSON.stringify({
      finalScore: 15,
      objectiveScore: 0,
      aiScore: 15,
      passed: false,
      reason: 'PENALIZED (SCORE: 15/100): Post content too short or empty.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Build the barem criteria list for the AI prompt
  const baremList = baremCriteria && baremCriteria.length > 0
    ? baremCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')
    : `1. Contains mandatory mention(s): ${requirements.requiredMentions.join(', ')}
2. Contains mandatory hashtag(s): ${requirements.requiredHashtags.join(', ')}
3. Word count >= ${requirements.minWords} words
4. Technical relevance to Ritual AI ecosystem
5. No spam or misleading claims`;

  const prompt = `You are the autonomous AI scoring engine for Merit Protocol on Ritual Testnet. 
Your job is to evaluate the following social media post against a confidential 20-point Barem rubric.

POST CONTENT:
"""
${tweetText}
"""

BAREM EVALUATION CRITERIA:
${baremList}

HARD REQUIREMENTS:
- Mandatory mentions: ${requirements.requiredMentions.join(', ')}
- Mandatory hashtags: ${requirements.requiredHashtags.join(', ')}
- Minimum word count: ${requirements.minWords} words
- Actual word count: ${tweetText.trim().split(/\s+/).filter(Boolean).length} words

INSTRUCTIONS:
Evaluate the post strictly against the Barem criteria. Be fair and objective.
Return a JSON response with these exact fields:
{
  "finalScore": <integer 0-100>,
  "objectiveScore": <integer 0-100, based on hard requirements only>,
  "aiScore": <integer 0-100, based on quality & Barem criteria>,
  "passed": <true if finalScore >= 60, false otherwise>,
  "reason": <2-4 sentence explanation of the score with bullet points for what passed/failed>
}

Only return valid JSON, no other text.`;

  try {
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://merit-protocol-ritual.vercel.app',
        'X-Title': 'Merit Protocol Ritual',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`OpenRouter error ${aiRes.status}: ${errText}`);
    }

    const aiData = await aiRes.json() as { choices?: { message?: { content?: string } }[] };
    const rawContent = aiData.choices?.[0]?.message?.content || '';

    // Parse JSON from AI response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI did not return valid JSON');

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({
      finalScore: Math.max(0, Math.min(100, Number(result.finalScore) || 50)),
      objectiveScore: Math.max(0, Math.min(100, Number(result.objectiveScore) || 50)),
      aiScore: Math.max(0, Math.min(100, Number(result.aiScore) || 50)),
      passed: Boolean(result.passed),
      reason: String(result.reason || 'AI evaluation completed.'),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'AI scoring failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
