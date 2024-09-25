// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Example {
    using TransientStorage for TransientStorageProxy;

    TransientStorageProxy public immutable transientStorage;

    constructor() {
        transientStorage = TransientStorage.init();
    }

    uint256 public constant LOCKED_BY_SLOT = uint256(keccak256('lockedBy'));

    function lockedBy() public returns (address) {
        return address(uint160(transientStorage.load(LOCKED_BY_SLOT)));
    }

    function setLockedBy(address addr) internal {
        transientStorage.store(LOCKED_BY_SLOT, uint256(uint160(addr)));
    }
}



