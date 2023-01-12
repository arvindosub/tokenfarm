import React, { Component } from 'react'
import lp from '../lp.png'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lpOption: "0",
      walletBalance: window.web3.utils.fromWei(this.props.lp0Wallet, 'Ether')
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ lpOption: e.target.value });
    let balance
    if (e.target.value == "0") {
      balance = window.web3.utils.fromWei(this.props.lp0Wallet, 'Ether')
    } else if (e.target.value == "1") {
      balance = window.web3.utils.fromWei(this.props.lp1Wallet, 'Ether')
    } else if (e.target.value == "2") {
      balance = window.web3.utils.fromWei(this.props.lp2Wallet, 'Ether')
    }
    this.setState({ walletBalance: balance });
  }

  render() {
    return (
      <div id="content" className="mt-3">
        <h5>FARM STAKES</h5>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">LP0</th>
              <th scope="col">LP1</th>
              <th scope="col">LP2</th>
              <th scope="col">CROP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.lp0Stake, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.lp1Stake, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.lp2Stake, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.cropFarm, 'Ether')}</td>
            </tr>
          </tbody>
        </table>

        <h5>TOTAL POOL</h5>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">LP0</th>
              <th scope="col">LP1</th>
              <th scope="col">LP2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.lp0Pool, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.lp1Pool, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.lp2Pool, 'Ether')}</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-2 text-center">
          <div><label><h5>MANAGE LP</h5></label></div>
          <div className="card-body mb-0">
            <form className="mb-2" onSubmit={(event) => {
                event.preventDefault()
                console.log(this.state.lpOption)
                console.log(this.state.walletBalance)
                console.log(this.input.value)
                let amount = window.web3.utils.toWei(this.input.value.toString(), 'Ether')
                if (this.input.value <= this.state.walletBalance) {
                  if (this.state.lpOption == "0") {
                    this.props.stakeLP0(amount)
                  } else if (this.state.lpOption == "1") {
                    this.props.stakeLP1(amount)
                  } else if (this.state.lpOption == "2") {
                    this.props.stakeLP2(amount)
                  }
                } else {
                  window.alert("You do not have that much balance!")
                }
              }}>
              <div className="select-container float-left">
                <select value={this.state.lpOption} onChange={this.handleChange}>
                  <option value="0">LP0</option>
                  <option value="1">LP1</option>
                  <option value="2">LP2</option>
                </select>
              </div>
              <span className="float-right text-muted">
                Wallet Balance: {this.state.walletBalance}
              </span>
              <div className="input-group mb-2">
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-md"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={lp} height='24' alt=""/>
                    &nbsp;&nbsp;&nbsp;
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-warning btn-block btn-md">Deposit</button>
            </form>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-md"
              onClick={(event) => {
                event.preventDefault()
                try {
                  event.preventDefault()
                  console.log(this.state.lpOption)
                  console.log(window.web3.utils.fromWei(this.props.lp0Stake, 'Ether'))
                  console.log(this.input.value)
                  let amount = window.web3.utils.toWei(this.input.value.toString(), 'Ether')
                  if ((this.state.lpOption == "0") && (parseInt(this.input.value) <= parseInt(window.web3.utils.fromWei(this.props.lp0Stake, 'Ether')))) {
                    this.props.withdrawLP0(amount)
                  } else if ((this.state.lpOption == "1") && (parseInt(this.input.value) <= parseInt(window.web3.utils.fromWei(this.props.lp1Stake, 'Ether')))) {
                    this.props.withdrawLP1(amount)
                  } else if ((this.state.lpOption == "2") && (parseInt(this.input.value) <= parseInt(window.web3.utils.fromWei(this.props.lp2Stake, 'Ether')))) {
                    this.props.withdrawLP2(amount)
                  } else {
                    window.alert("You do not have that much staked!")
                  }
                } catch (error) {
                  window.alert("Specify how much to withdraw")
                }
              }}>
                Withdraw
            </button>

            <button
              type="submit"
              className="btn btn-danger btn-block btn-md"
              onClick={(event) => {
                event.preventDefault()
                let amount = window.web3.utils.toWei(this.input.value.toString(), 'Ether')
                window.alert("by right, need to pay...")
                this.props.buyLP(parseInt(this.state.lpOption), amount)
              }}>
                Buy
            </button>

          </div>
        </div>

        <div className="card mb-2 text-center">
          <div><label><h5>MANAGE CROPS</h5></label></div>
          <div className="card-body">
            <form className="mb-2" onSubmit={(event) => {
                event.preventDefault()
                let amount = window.web3.utils.toWei(this.input1.value.toString(), 'Ether')
                if (parseInt(this.input1.value) <= parseInt(window.web3.utils.fromWei(this.props.cropFarm, 'Ether'))) {
                  this.props.harvestCROP(amount)
                } else {
                  window.alert("You do not have that many crops!")
                }
              }}>
              <span className="float-left text-muted">
                Wallet Balance: {window.web3.utils.fromWei(this.props.cropWallet, 'Ether')}
              </span>
              <span className="float-right text-muted">
                CROPS Yield: {window.web3.utils.fromWei(this.props.cropFarm, 'Ether')}
              </span>
              <div className="input-group mb-2">
                <input
                  type="text"
                  ref={(input1) => { this.input1 = input1 }}
                  className="form-control form-control-md"
                  placeholder="0"
                  required />
              </div>
              <button type="submit" className="btn btn-success btn-block btn-md">Harvest!</button>
            </form>

          </div>
        </div>

        <h5>WALLET BALANCES</h5>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">LP0</th>
              <th scope="col">LP1</th>
              <th scope="col">LP2</th>
              <th scope="col">CROP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.lp0Wallet, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.lp1Wallet, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.lp2Wallet, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.cropWallet, 'Ether')}</td>
            </tr>
          </tbody>
        </table>
        
      </div>
    );
  }
}

export default Main;
