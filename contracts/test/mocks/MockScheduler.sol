// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockScheduler {
    uint256 private _callIdCounter = 1;

    function schedule(
        bytes calldata,
        uint32,
        uint32,
        uint32,
        uint32,
        uint32,
        uint256,
        uint256,
        uint256,
        address
    ) external returns (uint256) {
        return _callIdCounter++;
    }

    function schedule(
        bytes calldata,
        uint32,
        uint32,
        uint32
    ) external returns (uint256) {
        return _callIdCounter++;
    }
}
