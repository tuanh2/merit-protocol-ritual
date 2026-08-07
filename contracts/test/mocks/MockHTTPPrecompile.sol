// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockHTTPPrecompile {
    fallback(bytes calldata) external returns (bytes memory) {
        bytes memory innerOut = abi.encode(
            uint16(200),
            new string[](0),
            new string[](0),
            bytes('{"status":"ok","content":"Verified Ritual Testnet Content"}'),
            ""
        );
        return abi.encode(bytes(""), innerOut);
    }
}
