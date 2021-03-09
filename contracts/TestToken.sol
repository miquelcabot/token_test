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

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

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

  // Approve
  function approve(address _spender, uint256 _value) public returns (bool success) {
    allowance[msg.sender][_spender] = _value;
    // Approve Event
    emit Approval(msg.sender, _spender, _value);
    // Return a boolean
    return true;
  }

  // Transfer From
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    // Excepction if account doesn't have enough balance
    require(_value <= balanceOf[_from]);
    require(_value <= allowance[_from][msg.sender]);
    // Transfer the balance
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    allowance[_from][msg.sender] -= _value;
    // Transfer Event
    emit Transfer(_from, _to, _value);
    // Return a boolean
    return true;
  }
}