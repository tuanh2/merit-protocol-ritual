# Merit Protocol

> Projects define rules. Creators submit. AI evaluates. Contracts reward

Autonomous AI-Powered Web3 Reputation and Creator Contest Infrastructure on Ritual Testnet (Chain ID 1979)

---

## Live Links and Contract Deployment

- Live Web Application: [https://merit-protocol-ritual.vercel.app/app](https://merit-protocol-ritual.vercel.app/app)
- Live Landing Page: [https://merit-protocol-ritual.vercel.app](https://merit-protocol-ritual.vercel.app)
- MeritProtocol Contract: `0x8B376915e28562eed544e3e3B74a3D063A401662`
- Ritual Explorer: [https://explorer.ritualfoundation.org/address/0x8B376915e28562eed544e3e3B74a3D063A401662](https://explorer.ritualfoundation.org/address/0x8B376915e28562eed544e3e3B74a3D063A401662)

---

## Product System Architecture

Merit Protocol provides zero admin bias reputation scoring and contest prize escrow settlement for Web3 communities

### 1 One-Off Contests
Projects lock prize escrow on chain before participant entry while Ritual TEE AI evaluates entries against immutable rubrics to distribute prize funds automatically

### 2 Continuous Project Campaigns
Continuous project spaces tracking all creator contributions over weekly or monthly cycles automatically awarding top rankers OG role credentials and badges

---

## Technical Infrastructure Overview

| Component | Details | Function |
| --- | --- | --- |
| **Chain ID** | 1979 | Ritual Testnet |
| **RPC URL** | `https://rpc.ritualfoundation.org` | Public JSON RPC Endpoint |
| **MeritProtocol** | `0x8B376915e28562eed544e3e3B74a3D063A401662` | Smart Contract Escrow |
| **HTTP Precompile** | `0x0000000000000000000000000000000000000801` | Content Fetching Engine |
| **LLM Precompile** | `0x0000000000000000000000000000000000000802` | GLM 4.7 FP8 TEE Inference |
| **Scheduler** | `0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B` | Multi Block Callbacks |

---

## Quickstart Development

### Smart Contracts (Hardhat & Foundry)
```bash
cd contracts
npm install
npx hardhat test
```

### Web3 Frontend (React + Viem + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## Protocol Security Standards

1. Immutable contest parameters once submissions begin
2. Deterministic ranking tie breaker by final score objective score and block number
3. Non transferable soulbound ERC 721 MeritBadge credentials
