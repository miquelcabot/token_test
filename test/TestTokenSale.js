let TestTokenSale = artifacts.require("TestTokenSale");

contract('TestTokenSale', (accounts) => {
  let tokenSaleInstance;
  let tokenPrice = 1000000000000000; // in wei (0.001 ETH)

  it ('initialitzes the contract with the correct values', async () => {
    tokenSaleInstance = await TestTokenSale.deployed();
    assert.notEqual(tokenSaleInstance.address, 0x0, 'has contract address');

    assert.notEqual(await tokenSaleInstance.tokenContract(), 0x0, 'has token contract address');

    assert.equal(await tokenSaleInstance.tokenPrice(), tokenPrice, 'token price is correct');
  });
});