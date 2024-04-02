// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleStorage {

    uint256 private storedData;
    event dataChanged(uint256 oldValue, uint256 newValue, uint256 when, address who);

    function set(uint256 value) public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("New value is %o and block timestamp is %o", value, block.timestamp);
        emit dataChanged(storedData, value, block.timestamp, msg.sender);
        storedData = value;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}