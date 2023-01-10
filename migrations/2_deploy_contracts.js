const LPToken = artifacts.require("LPToken");
const CropToken = artifacts.require("CropToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(LPToken)
  const lpToken = await LPToken.deployed()

  await deployer.deploy(CropToken)
  const cropToken = await CropToken.deployed()

  await deployer.deploy(TokenFarm, lpToken.address, cropToken.address)
  const tokenFarm = await TokenFarm.deployed()

  await cropToken.transfer(tokenFarm.address, '1000000000000000000000000')
  await lpToken.transfer(accounts[1], '100000000000000000000')
};
