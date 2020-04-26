import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Route path = "/" exact component = {MicrochipList}></Route>
        <Route path = "/edit/:id" exact component = {EditMicrochip}></Route>
        <Route path = "/create" exact component = {CreateMicrochip}></Route>
      </Router>
    );
  }
}

export default App;
