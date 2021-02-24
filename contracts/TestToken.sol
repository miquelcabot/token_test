// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

contract TestToken {
  // Total number of tokens
  uint public totalSupply;

  // Constructor
  constructor() public {
    totalSupply = 10000000;
  }
}