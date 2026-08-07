// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MeritTypes.sol";

library RequirementValidator {
    function validateContent(
        string memory content,
        string memory contentUrl,
        MeritTypes.HardRequirements memory reqs
    ) internal pure returns (bool passed, uint256 objectiveScore, string memory failureReason) {
        bytes memory contentBytes = bytes(content);

        // 1. Min words check
        if (reqs.minWords > 0) {
            uint256 wordCount = countWords(contentBytes);
            if (wordCount < reqs.minWords) {
                return (false, 0, "FAILED_MIN_WORDS");
            }
        }

        // 2. Required mentions check
        for (uint256 i = 0; i < reqs.requiredMentions.length; i++) {
            if (bytes(reqs.requiredMentions[i]).length > 0) {
                if (!containsSubstring(contentBytes, bytes(reqs.requiredMentions[i]))) {
                    return (false, 0, string(abi.encodePacked("MISSING_MENTION: ", reqs.requiredMentions[i])));
                }
            }
        }

        // 3. Required hashtags check
        for (uint256 i = 0; i < reqs.requiredHashtags.length; i++) {
            if (bytes(reqs.requiredHashtags[i]).length > 0) {
                if (!containsSubstring(contentBytes, bytes(reqs.requiredHashtags[i]))) {
                    return (false, 0, string(abi.encodePacked("MISSING_HASHTAG: ", reqs.requiredHashtags[i])));
                }
            }
        }

        // 4. Required keywords check
        for (uint256 i = 0; i < reqs.requiredKeywords.length; i++) {
            if (bytes(reqs.requiredKeywords[i]).length > 0) {
                if (!containsSubstring(contentBytes, bytes(reqs.requiredKeywords[i]))) {
                    return (false, 0, string(abi.encodePacked("MISSING_KEYWORD: ", reqs.requiredKeywords[i])));
                }
            }
        }

        // 5. Requires media check
        if (reqs.requiresMedia) {
            bytes memory urlBytes = bytes(contentUrl);
            bool hasMedia = containsSubstring(contentBytes, "media") ||
                            containsSubstring(contentBytes, "image") ||
                            containsSubstring(contentBytes, "video") ||
                            containsSubstring(contentBytes, "pic.twitter.com") ||
                            containsSubstring(urlBytes, ".png") ||
                            containsSubstring(urlBytes, ".jpg") ||
                            containsSubstring(urlBytes, ".jpeg") ||
                            containsSubstring(urlBytes, ".mp4") ||
                            containsSubstring(urlBytes, "media");
            if (!hasMedia) {
                return (false, 0, "MISSING_MEDIA_ATTACHMENT");
            }
        }

        return (true, 100, "");
    }

    function countWords(bytes memory str) internal pure returns (uint256 count) {
        bool inWord = false;
        for (uint256 i = 0; i < str.length; i++) {
            bytes1 c = str[i];
            if (c != 0x20 && c != 0x09 && c != 0x0A && c != 0x0D) {
                if (!inWord) {
                    inWord = true;
                    count++;
                }
            } else {
                inWord = false;
            }
        }
    }

    function containsSubstring(bytes memory haystack, bytes memory needle) internal pure returns (bool) {
        if (needle.length == 0) return true;
        if (haystack.length < needle.length) return false;

        for (uint256 i = 0; i <= haystack.length - needle.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < needle.length; j++) {
                bytes1 h = haystack[i + j];
                bytes1 n = needle[j];
                // Case-insensitive comparison for ASCII letters
                if (h >= 0x41 && h <= 0x5A) h = bytes1(uint8(h) + 32);
                if (n >= 0x41 && n <= 0x5A) n = bytes1(uint8(n) + 32);
                if (h != n) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }
}
