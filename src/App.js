import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import MicrochipList from "./components/list-microchip.component";
import EditMicrochip from "./components/edit-microchip.component";
import RegisterMicrochip from "./components/register-microchip.component";

import "bootstrap/dist/css/bootstrap.min.css";

import logo from "./logo.png";

class App extends Component {
  render() {
    return (
      <Router>
        <header>
          <nav className="container-fluid navbar navbar-expand-lg navbar-light bg-light">

            <Link to="/" className="nav-link">
              <img src={logo} width="auto" height="60" alt="STL Portal" />
            </Link>

            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">

                <li className="navbar-item">
                  <Link to="/" className="nav-link">List Microchip</Link>
                </li>

                <li className="navbar-item">
                  <Link to="/register" className="nav-link">Register Microchip</Link>
                </li>

              </ul>
            </div>

          </nav>
        </header>

        <Route path = "/" exact component = {MicrochipList}></Route>
        <Route path = "/edit/:id" component = {EditMicrochip}></Route>
        <Route path = "/register" component = {RegisterMicrochip}></Route>
      </Router>
    );
  }
}

export default App;