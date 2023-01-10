import React, { Component } from 'react'
import Web3 from 'web3'
import LPToken from '../abis/LPToken.json'
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

    // Load LP Token
    const lpTokenData = LPToken.networks[networkId]
    if(lpTokenData) {
      const lpToken = new web3.eth.Contract(LPToken.abi, lpTokenData.address)
      this.setState({ lpToken })
      let lpTokenBalance = await lpToken.methods.balanceOf(this.state.account).call()
      this.setState({ lpTokenBalance: lpTokenBalance.toString() })
    } else {
      window.alert('LPToken contract not deployed to detected network.')
    }

    // Load Crop Token
    const cropTokenData = CropToken.networks[networkId]
    if(cropTokenData) {
      const cropToken = new web3.eth.Contract(CropToken.abi, cropTokenData.address)
      this.setState({ cropToken })
      let cropTokenBalance = await cropToken.methods.balanceOf(this.state.account).call()
      this.setState({ cropTokenBalance: cropTokenBalance.toString() })
    } else {
      window.alert('DappToken contract not deployed to detected network.')
    }

    // Load Token Farm
    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm })
      let stakeBalance = await tokenFarm.methods.stakeBalance(this.state.account).call()
      this.setState({ stakeBalance: stakeBalance.toString() })
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

  stakeLP = (amount) => {
    this.setState({ loading: true })
    this.state.lpToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeLP(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        window.location.reload()
        this.setState({ loading: false })
      })
    })
  }

  withdrawLP = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.withdrawLP().send({ from: this.state.account }).on('transactionHash', (hash) => {
      window.location.reload()
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      lpToken: {},
      cropToken: {},
      tokenFarm: {},
      lpTokenBalance: '0',
      cropTokenBalance: '0',
      stakeBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        lpTokenBalance={this.state.lpTokenBalance}
        cropTokenBalance={this.state.cropTokenBalance}
        stakeBalance={this.state.stakeBalance}
        stakeLP={this.stakeLP}
        withdrawLP={this.withdrawLP}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
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
