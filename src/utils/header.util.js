import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Container, Button } from "react-bootstrap";
import { FiLogOut, FiSettings } from "react-icons/fi";

import { userLogoutAsync } from "../actions/auth-async.action";

import logo from "./../assets/logo.png";

export default function Navigation() {
    const auth_obj = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const { isAdmin } = auth_obj.user;

    const handleLogout = () => {
        dispatch(userLogoutAsync());
    };

    return (
        <header>
            <Navbar
                collapseOnSelect
                expand="lg"
                bg="info"
                variant="dark"
                className="shadow p-0 text-white"
            >
                <Container>
                    <Navbar.Brand>
                        <Link to="/">
                            <img
                                src={logo}
                                width="auto"
                                height="80"
                                alt="STL Portal"
                            />
                        </Link>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            {isAdmin && (
                                <DropdownButton
                                    variant="danger"
                                    title="Administration "
                                    className="mr-4"
                                >
                                    <Link
                                        to="/users"
                                        className="d-block px-3 py-2 text-dark"
                                    >
                                        Rep Accounts
                                    </Link>
                                    <Link
                                        to="/users/add"
                                        className="d-block px-3 py-2 text-dark"
                                    >
                                        Add New Rep
                                    </Link>
                                </DropdownButton>
                            )}

                            <DropdownButton
                                variant="danger"
                                title="Manage Pets "
                                className="mr-4"
                            >
                                <Link
                                    to="/pets"
                                    className="d-block px-3 py-2 text-dark"
                                >
                                    All Pets
                                </Link>
                                <Link
                                    to="/pets/register"
                                    className="d-block px-3 py-2 text-dark"
                                >
                                    Add New Pet
                                </Link>
                            </DropdownButton>

                            <DropdownButton
                                variant="danger"
                                title="Manage Owners "
                                className="mr-4"
                            >
                                <Link
                                    to="/owners"
                                    className="d-block px-3 py-2 text-dark"
                                >
                                    All Owners
                                </Link>
                                <Link
                                    to="/owners/register"
                                    className="d-block px-3 py-2 text-dark"
                                >
                                    Add New Owner
                                </Link>
                            </DropdownButton>
                        </Nav>

                        <Nav className="ml-auto">
                            <Link to="/setting" className="d-block">
                                <Button className="px-2" variant="info">
                                    <FiSettings
                                        size={24}
                                        className="text-white"
                                    />
                                </Button>
                            </Link>

                            <Button
                                className="px-2"
                                variant="info"
                                onClick={handleLogout}
                            >
                                <FiLogOut size={24} className="text-white" />
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}
