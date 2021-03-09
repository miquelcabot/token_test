// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

import "./TestToken.sol";

contract TestTokenSale {
  address admin;
  TestToken public tokenContract;
  uint256 public tokenPrice;

  // Constructor
  constructor(TestToken _tokenContract, uint256 _tokenPrice) {
    // Assign an admin
    admin = msg.sender;
    // Token Contract
    tokenContract = _tokenContract;
    // Token price
    tokenPrice = _tokenPrice;
  }
}