import React, { Component } from 'react'
import Web3 from 'web3'
import LP0Token from '../abis/LP0Token.json'
import LP1Token from '../abis/LP1Token.json'
import LP2Token from '../abis/LP2Token.json'
import CropToken from '../abis/CropToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load LP0 Token
    const lp0TokenData = LP0Token.networks[networkId]
    if(lp0TokenData) {
      const lp0Token = new web3.eth.Contract(LP0Token.abi, lp0TokenData.address)
      this.setState({ lp0Token })
      let lp0Wallet = await lp0Token.methods.balanceOf(this.state.account).call()
      this.setState({ lp0Wallet: lp0Wallet.toString() })
    } else {
      window.alert('LP0Token contract not deployed to detected network.')
    }

    // Load LP1 Token
    const lp1TokenData = LP1Token.networks[networkId]
    if(lp1TokenData) {
      const lp1Token = new web3.eth.Contract(LP1Token.abi, lp1TokenData.address)
      this.setState({ lp1Token })
      let lp1Wallet = await lp1Token.methods.balanceOf(this.state.account).call()
      this.setState({ lp1Wallet: lp1Wallet.toString() })
    } else {
      window.alert('LP1Token contract not deployed to detected network.')
    }

    // Load LP2 Token
    const lp2TokenData = LP2Token.networks[networkId]
    if(lp2TokenData) {
      const lp2Token = new web3.eth.Contract(LP2Token.abi, lp2TokenData.address)
      this.setState({ lp2Token })
      let lp2Wallet = await lp2Token.methods.balanceOf(this.state.account).call()
      this.setState({ lp2Wallet: lp2Wallet.toString() })
    } else {
      window.alert('LP2Token contract not deployed to detected network.')
    }

    // Load Crop Token
    const cropTokenData = CropToken.networks[networkId]
    if(cropTokenData) {
      const cropToken = new web3.eth.Contract(CropToken.abi, cropTokenData.address)
      this.setState({ cropToken })
      let cropWallet = await cropToken.methods.balanceOf(this.state.account).call()
      this.setState({ cropWallet: cropWallet.toString() })
    } else {
      window.alert('CropToken contract not deployed to detected network.')
    }

    // Load Token Farm
    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm })

      try {
        let lp0Stake = await tokenFarm.methods.stakeholders(this.state.account).call()
        this.setState({ lp0Stake: lp0Stake.lp0Count.toString() })
      } catch (error) {
        
      }

      let lp0Pool = await tokenFarm.methods.pool().call()
      this.setState({ lp0Pool: lp0Pool.lp0Total.toString() })

      try {
        let lp1Stake = await tokenFarm.methods.stakeholders(this.state.account).call()
        this.setState({ lp1Stake: lp1Stake.lp1Count.toString() })
      } catch (error) {
        
      }

      let lp1Pool = await tokenFarm.methods.pool().call()
      this.setState({ lp1Pool: lp1Pool.lp1Total.toString() })

      try {
        let lp2Stake = await tokenFarm.methods.stakeholders(this.state.account).call()
        this.setState({ lp2Stake: lp2Stake.lp2Count.toString() })
      } catch (error) {
        
      }

      let lp2Pool = await tokenFarm.methods.pool().call()
      this.setState({ lp2Pool: lp2Pool.lp2Total.toString() })

      try {
        let cropFarm = await tokenFarm.methods.stakeholders(this.state.account).call()
        this.setState({ cropFarm: cropFarm.cropCount.toString() })
      } catch (error) {
        
      }

    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }

    this.setState({ loading: false })

  }
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({method: 'eth_requestAccounts'})
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. Use MetaMask!')
    }
  }

  stakeLP0 = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.stakeLP0(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  stakeLP1 = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.stakeLP1(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  stakeLP2 = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.stakeLP2(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  withdrawLP0 = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.withdrawLP0(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }
  
  withdrawLP1 = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.withdrawLP1(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  withdrawLP2 = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.withdrawLP2(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  issueCROP = () => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.issueCROP().send({ from: this.state.tokenFarm._address }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  harvestCROP = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.harvestCROP(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  buyLP = (id, amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.buyLP(id, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      lp0Token: {},
      lp1Token: {},
      lp2Token: {},
      cropToken: {},
      tokenFarm: {},
      lp0Wallet: '0',
      lp0Stake: '0',
      lp0Pool: '0',
      lp1Wallet: '0',
      lp1Stake: '0',
      lp1Pool: '0',
      lp2Wallet: '0',
      lp2Stake: '0',
      lp2Pool: '0',
      cropWallet: '0',
      cropFarm: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        lp0Wallet={this.state.lp0Wallet}
        lp0Stake={this.state.lp0Stake}
        lp0Pool={this.state.lp0Pool}
        lp1Wallet={this.state.lp1Wallet}
        lp1Stake={this.state.lp1Stake}
        lp1Pool={this.state.lp1Pool}
        lp2Wallet={this.state.lp2Wallet}
        lp2Stake={this.state.lp2Stake}
        lp2Pool={this.state.lp2Pool}
        cropWallet={this.state.cropWallet}
        cropFarm={this.state.cropFarm}
        stakeLP0={this.stakeLP0}
        stakeLP1={this.stakeLP1}
        stakeLP2={this.stakeLP2}
        withdrawLP0={this.withdrawLP0}
        withdrawLP1={this.withdrawLP1}
        withdrawLP2={this.withdrawLP2}
        issueCROP={this.issueCROP}
        harvestCROP={this.harvestCROP}
        buyLP={this.buyLP}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-0">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '800px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
