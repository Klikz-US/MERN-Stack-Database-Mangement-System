import React, { Component, Fragment } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

import logo from "./../logo.png";

export default class AccountLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <Fragment>
                <Container>

                    <h1 className="m-5 text-center">Save This Life Database Admin Portal</h1>

                    <Row className="justify-content-md-center">
                        <Col>
                            <img src={logo} width="100%" height="auto" alt="STL Portal" />
                        </Col>

                        <Col>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>

                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>

                </Container>
            </Fragment>
        );
    }
}