import React, { Component } from 'react'
import farmer from '../farmer.jpg'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark flex-md-nowrap p-1 text-warning">
        <img src={farmer} width="200" height="130" className="d-inline-block align-mid float-right" alt="" />
        <div>
          <h1>LP Token Farm DApp</h1>
          <h4 className="text-secondary">by Arvind</h4>
        </div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
