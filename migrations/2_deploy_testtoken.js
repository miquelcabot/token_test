const TestToken = artifacts.require("TestToken");
const TestTokenSale = artifacts.require("TestTokenSale");

module.exports = function (deployer) {
  deployer.deploy(TestToken, 1000000).then( () => {
    let tokenPrice = 1000000000000000; // in wei (0.001 ETH)
    return deployer.deploy(TestTokenSale, TestToken.address, tokenPrice);
  });
};
