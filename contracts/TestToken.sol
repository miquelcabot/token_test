// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

contract TestToken {
  string public name = "Test Token";
  string public symbol = "TEST";
  string public standard = "Test Token v1.0";
  // Total number of tokens
  uint public totalSupply;

  mapping(address => uint256) public balanceOf;

  // Constructor
  constructor(uint _totalSupply) public {
    totalSupply = _totalSupply;
    balanceOf[msg.sender] = _totalSupply;
  }
}