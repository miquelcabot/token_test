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
  })

  it('set the total supply upon deployment', async () => {
    let tokenInstance = await TestToken.deployed();
    let totalSupply = await tokenInstance.totalSupply();
    let adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
    assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
  })

})