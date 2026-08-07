// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockLLMPrecompile {
    fallback(bytes calldata) external returns (bytes memory) {
        bytes memory completionData = bytes(
            '{"valid":true,"relevance":91,"accuracy":88,"originality":82,"clarity":94,"usefulness":87,"creativity":79,"overallScore":87,"reason":"The submission explains the required concept accurately and clearly."}'
        );
        (string memory p, string memory pa, string memory k) = ("", "", "");
        bytes memory innerOut = abi.encode(
            false, // hasError
            completionData,
            bytes(""),
            "",
            p, pa, k
        );
        return abi.encode(bytes(""), innerOut);
    }
}
