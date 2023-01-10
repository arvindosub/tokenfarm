import React, { Component } from 'react'
import lp from '../lp.png'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Stake Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.stakeBalance, 'Ether')} LP</td>
              <td>{window.web3.utils.fromWei(this.props.cropTokenBalance, 'Ether')} CROP</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >
          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let amount = window.web3.utils.toWei(this.input.value.toString(), 'Ether')
                this.props.stakeLP(amount)
              }}>
              <div>
                <label className="float-left"><b>Stake LP</b></label>
                <span className="float-right text-muted">
                  Wallet Balance: {window.web3.utils.fromWei(this.props.lpTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={lp} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; LP
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Deposit</button>
            </form>

            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.withdrawLP()
              }}>
                Withdraw!
            </button>

          </div>
        </div>

      </div>
    );
  }
}

export default Main;
