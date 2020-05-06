import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Container, Row, Col, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import logo from "./logo.png";

import PetList from "./components/pet-list.component";
import PetEdit from "./components/pet-update.component";
import PetRegister from "./components/pet-register.component";
import OwnerList from "./components/owner-list.component";
import OwnerEdit from "./components/owner-update.component";
import OwnerRegister from "./components/owner-register.component";
import AccountLogin from "./components/account-login.component"

class App extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {

    }

    render() {
        return (
            <Router>
                <header>
                    <Navbar collapseOnSelect expand="lg" bg="info" variant="dark" className="shadow p-0 text-white">
                        <Container>
                            <Navbar.Brand>
                                <Link to="/">
                                    <img src={logo} width="auto" height="80" alt="STL Portal" />
                                </Link>
                            </Navbar.Brand>

                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">



                                <Nav className="mr-auto">

                                    <DropdownButton variant="danger" title="Manage Pets " className="mr-4">
                                        <Link to="/pets" className="d-block px-3 py-2 text-dark">Registered Pets</Link>
                                        <Link to="/pets/register" className="d-block px-3 py-2 text-dark">Register New Pet</Link>
                                    </DropdownButton>

                                    <DropdownButton variant="danger" title="Manage Owners ">
                                        <Link to="/pets" className="d-block px-3 py-2 text-dark">Registered Pets</Link>
                                        <Link to="/pets/register" className="d-block px-3 py-2 text-dark">Register New Pet</Link>
                                    </DropdownButton>

                                </Nav>

                                <Nav>
                                    <Link to="/account/login" className="d-block px-2"><Button variant="warning">Login</Button></Link>
                                </Nav>

                                <Nav>
                                    <Link to="/account/logout" className="d-block px-2"><Button variant="warning">Logout</Button></Link>
                                </Nav>

                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </header>

                <main>
                    <Route path="/pets" exact component={PetList}></Route>
                    <Route path="/pets/edit/:id" exact component={PetEdit}></Route>
                    <Route path="/pets/register" exact component={PetRegister}></Route>

                    <Route path="/owners" exact component={OwnerList}></Route>
                    <Route path="/owners/edit/:id" exact component={OwnerEdit}></Route>
                    <Route path="/owners/register" exact component={OwnerRegister}></Route>

                    <Route path="/account/login" exact component={AccountLogin}></Route>
                </main>

                <footer className="mt-5 pt-4 pb-4">
                    <Container>
                        <Row>
                            <Col className="text-center">
                                <img src={logo} width="60%" height="auto" alt="STL Portal" />
                            </Col>

                            <Col className="border border-dark border-top-0 border-bottom-0 pb-2 mb-4">
                                <h5 className="text-dark px-2 py-0">Quick Links</h5>
                                <Nav.Link className="text-info px-2 py-1" href="https://shop.savethislife.com" target="_blank">Save This Life Shopify</Nav.Link>
                                <Nav.Link className="text-danger px-2 py-1" href="https://shop.savethislife.com" target="_blank">Asana Dashboard</Nav.Link>
                                <Nav.Link className="text-alert px-2 py-1" href="https://shop.savethislife.com" target="_blank">TalkDesk</Nav.Link>
                                <Nav.Link className="text-success px-2 py-1" href="https://shop.savethislife.com" target="_blank">CSR Portal</Nav.Link>
                                <Nav.Link className="text-primary px-2 py-1" href="https://shop.savethislife.com" target="_blank">Resources</Nav.Link>
                            </Col>

                            <Col>
                                <h5 className="text-dark p-2">Live Updates</h5>
                            </Col>

                        </Row>

                        <p className="text-center text-dark m-0">© 2020 Save This Life Inc. All rights reserved.</p>
                        <p className="text-center text-dark m-0">Save This Life and Save This Life logo are registered trademarks of Save This Life, Inc.</p>

                    </Container>
                </footer>
            </Router>
        );
    }
}

export default App;