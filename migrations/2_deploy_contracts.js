const LP0Token = artifacts.require("LP0Token");
const LP1Token = artifacts.require("LP1Token");
const LP2Token = artifacts.require("LP2Token");
const CropToken = artifacts.require("CropToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(LP0Token)
  const lp0Token = await LP0Token.deployed()

  await deployer.deploy(LP1Token)
  const lp1Token = await LP1Token.deployed()

  await deployer.deploy(LP2Token)
  const lp2Token = await LP2Token.deployed()

  await deployer.deploy(CropToken)
  const cropToken = await CropToken.deployed()

  await deployer.deploy(TokenFarm, lp0Token.address, lp1Token.address, lp2Token.address, cropToken.address)
  const tokenFarm = await TokenFarm.deployed()

  await cropToken.transfer(tokenFarm.address, '1000000000000000000000000')
  await lp0Token.transfer(accounts[1], '100000000000000000000')
  await lp1Token.transfer(accounts[1], '100000000000000000000')
  await lp2Token.transfer(accounts[1], '100000000000000000000')
};
