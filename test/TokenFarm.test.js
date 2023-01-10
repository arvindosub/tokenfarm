const { assert } = require("chai");

const LPToken = artifacts.require("LPToken");
const CropToken = artifacts.require("CropToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
    .use(require("chai-as-promised"))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract("TokenFarm", ([owner, stakeholder]) => {
    let lpToken, cropToken, tokenFarm
    before(async () => {
        lpToken = await LPToken.new()
        cropToken = await CropToken.new()
        tokenFarm = await TokenFarm.new(lpToken.address, cropToken.address)

        await cropToken.transfer(tokenFarm.address, tokens('1000000'))
        await lpToken.transfer(stakeholder, tokens('100'), { from: owner })
    })

    describe('LP Token Deployment', async () => {
        it('has a name', async () => {
            const name = await lpToken.name()
            assert.equal(name, 'LP Token')
        })
    })

    describe('Crop Token Deployment', async () => {
        it('has a name', async () => {
            const name = await cropToken.name()
            assert.equal(name, 'Crop Token')
        })
    })

    describe('Token Farm Deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Token Farm')
        })

        it('contract has tokens', async () => {
            let balance = await cropToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Staking Tokens', async () => {
        it('stakes tokens', async () => {
            let result

            result = await lpToken.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder has the right lp token balance')

            await lpToken.approve(tokenFarm.address, tokens('100'), { from: stakeholder })
            await tokenFarm.stakeLP(tokens('100'), { from: stakeholder })

            result = await lpToken.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('0'), 'stakeholder has staked all their lp')

            result = await lpToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'contract has received staked lp')

            result = await tokenFarm.stakeBalance(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder balance updated correctly')

            result = await tokenFarm.isStaking(stakeholder)
            assert.equal(result.toString(), 'true', 'stakeholder staking status updated correctly')
        })
    })

    describe('Reward Interest', async () => {
        it('rewards stakeholders', async () => {
            let result

            await tokenFarm.issueCROP({ from: owner })

            result = await cropToken.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder received the right reward')

            await tokenFarm.issueCROP({ from: stakeholder }).should.be.rejected
        })
    })

    describe('Withdraw Tokens', async () => {
        it('withdraws stake', async () => {
            let result

            await tokenFarm.withdrawLP({ from: stakeholder })

            result = await lpToken.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder got back principal')

            result = await lpToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'contract lp balance correct')

            result = await tokenFarm.isStaking(stakeholder)
            assert.equal(result.toString(), 'false', 'stakeholder is no longer staking')
        })
    })

})