const { assert } = require("chai");

const LP0Token = artifacts.require("LP0Token");
const LP1Token = artifacts.require("LP1Token");
const LP2Token = artifacts.require("LP2Token");
const CropToken = artifacts.require("CropToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
    .use(require("chai-as-promised"))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract("TokenFarm", ([owner, stakeholder]) => {
    let lp0Token, lp1Token, lp2Token, cropToken, tokenFarm
    before(async () => {
        lp0Token = await LP0Token.new()
        lp1Token = await LP1Token.new()
        lp2Token = await LP2Token.new()
        cropToken = await CropToken.new()
        tokenFarm = await TokenFarm.new(lp0Token.address, lp1Token.address, lp2Token.address, cropToken.address)

        await cropToken.transfer(tokenFarm.address, tokens('1000000'))
        await lp0Token.transfer(stakeholder, tokens('100'), { from: owner })
        await lp1Token.transfer(stakeholder, tokens('100'), { from: owner })
        await lp2Token.transfer(stakeholder, tokens('100'), { from: owner })
    })

    describe('LP0 Token Deployment', async () => {
        it('has a name', async () => {
            const name = await lp0Token.name()
            assert.equal(name, 'LP0 Token')
        })
    })

    describe('LP1 Token Deployment', async () => {
        it('has a name', async () => {
            const name = await lp1Token.name()
            assert.equal(name, 'LP1 Token')
        })
    })

    describe('LP2 Token Deployment', async () => {
        it('has a name', async () => {
            const name = await lp2Token.name()
            assert.equal(name, 'LP2 Token')
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
        it('stakes lp0 tokens', async () => {
            let result

            result = await lp0Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder has the right lp0 token balance')

            //await lp0Token.approve(tokenFarm.address, tokens('100'), { from: stakeholder })
            await tokenFarm.stakeLP0(tokens('100'), { from: stakeholder })

            result = await lp0Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('0'), 'stakeholder has staked the correct quantity of lp0')

            result = await lp0Token.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'contract has received staked lp0')

            result = await tokenFarm.pool()
            assert.equal(result.lp0Total.toString(), tokens('100'), 'farm balance updated correctly')

            result = await tokenFarm.stakeholders(stakeholder)
            assert.equal(result.isStaking.toString(), 'true', 'stakeholder staking status updated correctly')
        })

        it('stakes lp1 tokens', async () => {
            let result

            result = await lp1Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder has the right lp1 token balance')

            //await lp1Token.approve(tokenFarm.address, tokens('100'), { from: stakeholder })
            await tokenFarm.stakeLP1(tokens('100'), { from: stakeholder })

            result = await lp1Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('0'), 'stakeholder has staked the correct quantity of lp1')

            result = await lp1Token.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'contract has received staked lp1')

            result = await tokenFarm.pool()
            assert.equal(result.lp1Total.toString(), tokens('100'), 'farm balance updated correctly')

            result = await tokenFarm.stakeholders(stakeholder)
            assert.equal(result.isStaking.toString(), 'true', 'stakeholder staking status updated correctly')
        })

        it('stakes lp2 tokens', async () => {
            let result

            result = await lp2Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder has the right lp2 token balance')

            //await lp2Token.approve(tokenFarm.address, tokens('100'), { from: stakeholder })
            await tokenFarm.stakeLP2(tokens('100'), { from: stakeholder })

            result = await lp2Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('0'), 'stakeholder has staked the correct quantity of lp2')

            result = await lp2Token.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'contract has received staked lp2')

            result = await tokenFarm.pool()
            assert.equal(result.lp2Total.toString(), tokens('100'), 'farm balance updated correctly')

            result = await tokenFarm.stakeholders(stakeholder)
            assert.equal(result.isStaking.toString(), 'true', 'stakeholder staking status updated correctly')
        })
    })

    describe('Reward Interest', async () => {
        it('rewards stakeholders', async () => {
            let result = await tokenFarm.stakeholders(stakeholder)
            assert.equal(result.cropCount.toString(), tokens('460'), 'stakeholder received the right reward')
        })
    })

    describe('Withdraw Tokens', async () => {
        it('withdraws lp0 stake', async () => {
            let result

            await tokenFarm.withdrawLP0(tokens('100'), { from: stakeholder })

            result = await lp0Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder got back principal')

            result = await lp0Token.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'contract lp0 balance correct')

            result = await tokenFarm.stakeholders(stakeholder)
            assert.equal(result.isStaking.toString(), 'true', 'stakeholder is still staking')
        })

        it('withdraws lp1 stake', async () => {
            let result

            await tokenFarm.withdrawLP1(tokens('100'), { from: stakeholder })

            result = await lp1Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder got back principal')

            result = await lp1Token.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'contract lp1 balance correct')

            result = await tokenFarm.stakeholders(stakeholder)
            assert.equal(result.isStaking.toString(), 'true', 'stakeholder is still staking')
        })

        it('withdraws lp2 stake', async () => {
            let result

            await tokenFarm.withdrawLP2(tokens('100'), { from: stakeholder })

            result = await lp2Token.balanceOf(stakeholder)
            assert.equal(result.toString(), tokens('100'), 'stakeholder got back principal')

            result = await lp2Token.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'contract lp2 balance correct')

            result = await tokenFarm.stakeholders(stakeholder)
            assert.equal(result.isStaking.toString(), 'false', 'stakeholder is no longer staking')
        })
    })

})