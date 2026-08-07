// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILLMPrecompile {
    struct StorageRef {
        string platform;
        string path;
        string keyRef;
    }

    struct LLMRequest {
        address executor;
        bytes[] encryptedSecrets;
        uint256 ttl;
        bytes[] secretSignatures;
        bytes userPublicKey;
        string messagesJson;
        string model;
        int256 frequencyPenalty;
        string logitBiasJson;
        bool logprobs;
        int256 maxCompletionTokens;
        string metadataJson;
        string modalitiesJson;
        uint256 n;
        bool parallelToolCalls;
        int256 presencePenalty;
        string reasoningEffort;
        bytes responseFormatData;
        int256 seed;
        string serviceTier;
        string stopJson;
        bool stream;
        int256 temperature;
        bytes toolChoiceData;
        bytes toolsData;
        int256 topLogprobs;
        int256 topP;
        string user;
        bool piiEnabled;
        StorageRef convoHistory;
    }

    struct LLMResponse {
        bool hasError;
        bytes completionData;
        bytes modelMetadata;
        string errorMessage;
        StorageRef updatedConvoHistory;
    }
}
