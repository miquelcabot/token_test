// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

contract TestToken {
  string public name = "Test Token";
  string public symbol = "TEST";
  string public standard = "Test Token v1.0";
  // Total number of tokens
  uint public totalSupply;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint _value
  );

  mapping(address => uint256) public balanceOf;

  // Constructor
  constructor(uint _totalSupply) public {
    totalSupply = _totalSupply;
    balanceOf[msg.sender] = _totalSupply;
  }

  // Transfer
  function transfer(address _to, uint256 _value) public returns (bool success) {
    // Excepction if account doesn't have enough balance
    require(balanceOf[msg.sender] >= _value);
    // Transfer the balance
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    // Transfer Event
    emit Transfer(msg.sender, _to, _value);
    // Return a boolean
    return true;
  }
}