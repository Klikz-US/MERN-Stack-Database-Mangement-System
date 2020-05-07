import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import logo from "./../assets/logo.png";

import { userLoginAsync } from '../actions/auth-async.actions';
import { useFormInput } from '../utils/forms.utils';

export default function AccountLogin() {
    const auth_obj = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const { loginLoading, loginError } = auth_obj;

    const email = useFormInput('');
    const password = useFormInput('');

    const handleLogin = () => {
        dispatch(userLoginAsync(email.value, password.value));
    }

    return (
        <Container>
            <Row className="justify-content-md-center min-vh-100">
                <Card className="shadow w-50 my-auto">

                    <Card.Header className="bg-danger text-white">
                        <h3 className="m-0 text-center">Save This Life Admin Portal</h3>
                    </Card.Header>

                    <Card.Body>
                        <Row>
                            <Col className="my-auto">
                                <Card.Img variant="left" className="w-100" src={logo} />
                            </Col>

                            <Col>
                                <Card.Title>Login Information</Card.Title>
                                <Card.Text>
                                    Please request Heather the login credentials if you are a identified Vet Practice.
                                </Card.Text>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            {...email}
                                            autoComplete="new-password"
                                            placeholder="Enter email"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            {...password}
                                            autoComplete="new-password"
                                            placeholder="Enter Password"
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="outline-primary"
                                        onClick={handleLogin}
                                        disabled={loginLoading}
                                    >
                                        {loginLoading ? 'Loading...' : 'Login'}
                                    </Button>
                                    {loginError &&
                                        <Form.Text className="text-muted text-danger">
                                            {loginError}
                                        </Form.Text>
                                    }
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
}