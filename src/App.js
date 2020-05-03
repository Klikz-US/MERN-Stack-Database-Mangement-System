import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import ListGroup from 'react-bootstrap/ListGroup'
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
                            <Navbar.Brand href="/">
                                <img src={logo} width="auto" height="80" alt="STL Portal" />
                            </Navbar.Brand>

                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">

                                <Nav className="mr-auto" variant="pills">
                                    <NavDropdown title="Manage Pets">
                                        <NavDropdown.Item href="/pets">Registered Pets</NavDropdown.Item>
                                        <NavDropdown.Item href="/pets/register">Register New Pet</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/pets/import">Import Pets</NavDropdown.Item>
                                        <NavDropdown.Item href="/pets/export">Export Pets</NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title="Manage Users">
                                        <NavDropdown.Item href="/owners">Registered Owners</NavDropdown.Item>
                                        <NavDropdown.Item href="/owners/register">Add New Owner</NavDropdown.Item>
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
                                        <NavDropdown.Item href="/account">Settings</NavDropdown.Item>
                                        <NavDropdown.Item href="/account/logout">Logout</NavDropdown.Item>
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
                </main>

                <footer className="mt-5 pt-4 pb-4">
                    <Container>
                        <Row>
                            <Col>
                                <img src={logo} width="100%" height="auto" alt="STL Portal" />
                            </Col>

                            <Col className="border border-light border-top-0 border-bottom-0 pb-2 mb-4">
                                <h4 className="text-white p-2">Quick Links</h4>
                                <ListGroup>
                                    <ListGroup.Item action variant="primary" href="https://shop.savethislife.com">Save This Life Shopify</ListGroup.Item>
                                    <ListGroup.Item action variant="success" href="https://shop.savethislife.com">Save This Life Brand</ListGroup.Item>
                                    <ListGroup.Item action variant="danger" href="https://shop.savethislife.com">Asana Dashboard</ListGroup.Item>
                                    <ListGroup.Item action variant="warning" href="https://shop.savethislife.com">Talkdesk</ListGroup.Item>
                                    <ListGroup.Item action variant="info" href="https://shop.savethislife.com">Resources</ListGroup.Item>
                                </ListGroup>
                            </Col>

                            <Col>
                                <h4 className="text-white p-2">Live Updates</h4>
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