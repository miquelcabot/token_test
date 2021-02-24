let TestToken = artifacts.require("TestToken");

contract('TestToken', function(accounts) {
  it('set the total supply upon deployment', async () => {
    let tokenInstance = await TestToken.deployed()
    let totalSupply = await tokenInstance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
  })

})