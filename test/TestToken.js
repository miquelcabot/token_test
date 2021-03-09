let TestToken = artifacts.require("TestToken");

contract('TestToken', (accounts) => {
  it ('initializes the contract with the correct values', async () => {
    let tokenInstance = await TestToken.deployed();
    let name = await tokenInstance.name();
    let symbol = await tokenInstance.symbol();
    let standard = await tokenInstance.standard();
    assert.equal(name, 'Test Token', 'has the correct name');
    assert.equal(symbol, 'TEST', 'has the correct symbol');
    assert.equal(standard, 'Test Token v1.0', 'has the correct standard');
  });

  it('set the total supply upon deployment', async () => {
    let tokenInstance = await TestToken.deployed();
    let totalSupply = await tokenInstance.totalSupply();
    let adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
    assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
  });

  it('transfers token ownership', async () => {
    let tokenInstance = await TestToken.deployed();
    try {
      await tokenInstance.transfer.call(accounts[1], 999999999999);
      assert(false, 'you can\'t transfer more supply than you have');
    } catch(err) {
      assert(err.message.indexOf('revert') >= 0, 'error message must contain revert');
    }
    let success = await tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
    assert.equal(success, true, 'it returns true');

    let receipt = await tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
    assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');

    let balance0 = await tokenInstance.balanceOf(accounts[0]);
    let balance1 = await tokenInstance.balanceOf(accounts[1]);
    assert.equal(balance0.toNumber(), 750000, 'deducts the amount from the sending account');
    assert.equal(balance1.toNumber(), 250000, 'adds the amount to the receiving account');

  });

  it('approves tokens for delegated transfer', async () => {
    let tokenInstance = await TestToken.deployed();
    let success = await tokenInstance.approve.call(accounts[1], 100);
    assert.equal(success, true, 'it returns true');

    let receipt = await tokenInstance.approve(accounts[1], 100);
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
    assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');

    let allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
    assert.equal(allowance, 100, 'stores the allowance for delegated transfer');
  });

  it('handles delegated token transfers', async () => {
    let tokenInstance = await TestToken.deployed();
    let fromAccount = accounts[2];
    let toAccount = accounts[3];
    let spendingAccount = accounts[4];

    // Transfer some tokens to fromAccount
    await tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
    // Approve spendingAccount to spend 10 tokens from fromAccount
    await tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
    // Try transferring something than the sender's balance
    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
      assert(false, 'cannot transfer value larger than balance');
    } catch(err) {
      assert(err.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
    }
    // Try transferring something larger than the aproved amount
    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
      assert(false, 'cannot transfer value larger than approved amount');
    } catch(err) {
      assert(err.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
    }
    let success = await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
    assert.equal(success, true, 'it returns true');

    let receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
    assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
    assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
    assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');

    let balance0 = await tokenInstance.balanceOf(fromAccount);
    let balance1 = await tokenInstance.balanceOf(toAccount);
    assert.equal(balance0.toNumber(), 90, 'deducts the amount from the sending account');
    assert.equal(balance1.toNumber(), 10, 'adds the amount to the receiving account');

    let allowance = await tokenInstance.allowance(fromAccount, spendingAccount);
    assert.equal(allowance, 0, 'deducts the amount from the allowance');
  });
})