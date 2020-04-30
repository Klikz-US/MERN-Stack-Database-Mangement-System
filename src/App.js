import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.png";

import PetList from "./components/list-pet.component";
import EditPet from "./components/update-pet.component";
import RegisterPet from "./components/register-pet.component";

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
                  <Link to="/pets" className="nav-link">Registered Pets</Link>
                </li>

                <li className="navbar-item">
                  <Link to="/pets/register" className="nav-link">Register New Pet</Link>
                </li>

              </ul>
            </div>

          </nav>
        </header>

        <Route path = "/pets" exact component = {PetList}></Route>
        <Route path = "/pets/edit/:id" component = {EditPet}></Route>
        <Route path = "/pets/register" component = {RegisterPet}></Route>
      </Router>
    );
  }
}

export default App;