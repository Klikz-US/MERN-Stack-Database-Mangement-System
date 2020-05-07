import React from "react";
import { Link } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Container, Button } from "react-bootstrap";

import logo from './../assets/logo.png';

export default function Navigation() {
    return (
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

                    <Nav className="ml-auto">
                        <Link to="/account/logout" className="d-block px-2"><Button variant="warning">Logout</Button></Link>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}