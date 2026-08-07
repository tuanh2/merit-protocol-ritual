// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRitualScheduler {
    enum CallState {
        SCHEDULED,
        EXECUTING,
        COMPLETED,
        CANCELLED,
        EXPIRED
    }

    struct Call {
        address to;
        address caller;
        uint32 startBlock;
        uint32 numCalls;
        uint32 frequency;
        uint32 gas;
        uint32 ttl;
        uint8 state;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
        uint256 value;
        bytes data;
    }

    function schedule(
        bytes calldata data,
        uint32 gasLimit,
        uint32 startBlock,
        uint32 numCalls,
        uint32 frequency,
        uint32 ttl,
        uint256 maxFeePerGas,
        uint256 maxPriorityFeePerGas,
        uint256 value,
        address payer
    ) external returns (uint256 callId);

    function schedule(
        bytes calldata data,
        uint32 gasLimit,
        uint32 numCalls,
        uint32 frequency
    ) external returns (uint256 callId);

    function cancel(uint256 callId) external;

    function approveScheduler(address schedulerContract) external;

    function calls(uint256 callId) external view returns (
        address to,
        address caller,
        uint32 startBlock,
        uint32 numCalls,
        uint32 frequency,
        uint32 gas,
        uint32 ttl,
        uint8 state,
        uint256 maxFeePerGas,
        uint256 maxPriorityFeePerGas,
        uint256 value,
        bytes memory data
    );

    function getCallState(uint256 callId) external view returns (uint8 state);
}
