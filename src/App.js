import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import logo from "./logo.png";

import PetList from "./components/list-pet.component";
import EditPet from "./components/update-pet.component";
import RegisterPet from "./components/register-pet.component";
import OwnerList from "./components/list-owner.component";
import EditOwner from "./components/update-owner.component";
import RegisterOwner from "./components/register-owner.component";

import ImportPet from "./components/import-pet.component";

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

                                <Nav className="mr-auto" variant="pills">

                                    <NavDropdown title="Manage Pets">

                                        <NavDropdown.Item>
                                            <Link to="/pets">Registered Pets</Link>
                                        </NavDropdown.Item>

                                        <NavDropdown.Item>
                                            <Link to="/pets/register">Register New Pet</Link>
                                        </NavDropdown.Item>

                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/pets/import">Import Pets</NavDropdown.Item>
                                        <NavDropdown.Item href="/pets/export">Export Pets</NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title="Manage Owners">

                                        <NavDropdown.Item>
                                            <Link to="/owners">Registered Owners</Link>
                                        </NavDropdown.Item>

                                        <NavDropdown.Item>
                                            <Link to="/owners/register">Add New Owner</Link>
                                        </NavDropdown.Item>

                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/owners/import">Import Owners</NavDropdown.Item>
                                        <NavDropdown.Item href="/owners/export">Export Owners</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>

                                <Form inline className="mr-5" onSubmit={this.onSubmit}>
                                    <Form.Control type="text" placeholder="Quick Search" className="mr-sm-2 text-dark border-white" />
                                    <Button variant="outline-light">Search</Button>
                                </Form>

                                <Nav variant="pills">
                                    <NavDropdown title="Account">

                                        <NavDropdown.Item>
                                            <Link to="/account/settings">Settings</Link>
                                        </NavDropdown.Item>

                                        <NavDropdown.Item>
                                            <Link to="/account/logout">Logout</Link>
                                        </NavDropdown.Item>

                                    </NavDropdown>
                                </Nav>

                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </header>

                <main>
                    <Route path="/pets" exact component={PetList}></Route>
                    <Route path="/pets/edit/:id" component={EditPet}></Route>
                    <Route path="/pets/register" component={RegisterPet}></Route>
                    <Route path="/owners" exact component={OwnerList}></Route>
                    <Route path="/owners/edit/:id" component={EditOwner}></Route>
                    <Route path="/owners/register" component={RegisterOwner}></Route>

                    <Route path="/pets/import" component={ImportPet}></Route>
                </main>

                <footer className="mt-5 pt-4 pb-4">
                    <Container>
                        <Row>
                            <Col className="text-center">
                                <img src={logo} width="60%" height="auto" alt="STL Portal" />
                            </Col>

                            <Col className="border border-dark border-top-0 border-bottom-0 pb-2 mb-4">
                                <h4 className="text-dark p-2">Quick Links</h4>
                                <Nav.Link className="text-info" href="https://shop.savethislife.com" target="_blank">Save This Life Shopify</Nav.Link>
                                <Nav.Link className="text-danger" href="https://shop.savethislife.com" target="_blank">Asana Dashboard</Nav.Link>
                                <Nav.Link className="text-alert" href="https://shop.savethislife.com" target="_blank">TalkDesk</Nav.Link>
                                <Nav.Link className="text-success" href="https://shop.savethislife.com" target="_blank">CSR Portal</Nav.Link>
                                <Nav.Link className="text-primary" href="https://shop.savethislife.com" target="_blank">Resources</Nav.Link>
                            </Col>

                            <Col>
                                <h4 className="text-dark p-2">Live Updates</h4>
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