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
    assert.equal(balance1.toNumber(), 250000, 'adds the amount to the receiving account');
    assert.equal(balance0.toNumber(), 750000, 'deducts the amount from the sending account');

  });
})