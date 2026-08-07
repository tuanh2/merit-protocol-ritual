// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHTTPPrecompile {
    struct HTTPRequest {
        address executor;
        bytes[] encryptedSecrets;
        uint256 ttl;
        bytes[] secretSignatures;
        bytes userPublicKey;
        string url;
        uint8 method;
        string[] headersKeys;
        string[] headersValues;
        bytes body;
        uint256 dkmsKeyIndex;
        uint8 dkmsKeyFormat;
        bool piiEnabled;
    }

    struct HTTPResponse {
        uint16 statusCode;
        string[] headerKeys;
        string[] headerValues;
        bytes body;
        string errorMessage;
    }
}
