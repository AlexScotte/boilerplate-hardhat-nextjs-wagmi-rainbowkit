// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleStorage is Ownable {

    uint256 private storedData;
    event valueChanged(uint256 oldValue, uint256 newValue, address who);

    /**
     * @notice Constructor to set the initial owner of the contract
     * @param _initialOwner The address of the initial owner
     */
    constructor(address _initialOwner) Ownable(_initialOwner) {}

    /**
     * @notice Get the value of the storedData
     * @return The value of the storedData
     */
    function get() public view returns (uint256) {
        return storedData;
    }

    /**
     * @notice Set the value of the storedData
     * @param value The new value to be stored
     */
    function set(uint256 value) public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("New value is %o and block timestamp is %o", value, block.timestamp);
        emit valueChanged(storedData, value, msg.sender);
        storedData = value;
    }
}