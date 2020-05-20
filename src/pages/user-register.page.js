import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import { useFormCheck } from "../utils/form-check.util";
import { userRegisterService } from "../services/user.service";

import img from "../assets/images/user-register.jpg";

export default function UserRegister() {
    /*
     * Private Page Token Verification Module.
     */
    const auth_obj = useSelector((state) => state.auth);
    const { token, expiredAt } = auth_obj;
    const dispatch = useDispatch();
    useEffect(() => {
        setAuthToken(token);
        const verifyTokenTimer = setTimeout(() => {
            dispatch(verifyTokenAsync(true));
        }, moment(expiredAt).diff() - 10 * 1000);
        return () => {
            clearTimeout(verifyTokenTimer);
        };
    }, [expiredAt, token, dispatch]);
    /* ----------------------- */

    const role = useFormCheck("vet");
    const name = useFormInput("");
    const email = useFormInput("");
    const phone = useFormInput("");
    const password = useFormInput("");
    const password_confirm = useFormInput("");

    const history = useHistory();
    const [formError, setFormError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password.value === password_confirm.value) {
            async function fetchData() {
                const newUser = {
                    role: role.selected,
                    email: email.value,
                    phone: phone.value,
                    name: name.value,
                    password: password.value,
                };
                newUser.isAdmin = newUser.role === "admin" ? true : false;
                const result = await userRegisterService(newUser);
                if (result.error) {
                    setFormError(result.errMsg);
                } else {
                    history.push("/users");
                }
            }
            fetchData();
        } else {
            setFormError("Password do not match");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        history.push("/users");
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Add A New Portal User</h1>

                <Form autoComplete="off">
                    <Row>
                        <Col className="align-self-center">
                            <Image src={img} roundedCircle width="90%" />
                        </Col>
                        <Col>
                            <Card className="shadow">
                                <Card.Header className="bg-success text-white">
                                    <h5 className="m-0">User Information</h5>
                                </Card.Header>

                                <Card.Body>
                                    <Form.Group>
                                        <Form.Label>Role</Form.Label>
                                        <Col className="p-0">
                                            <Form.Check
                                                inline
                                                className="mr-5"
                                                type="radio"
                                                name="role"
                                                value="admin"
                                                label="STL Admin"
                                                checked={
                                                    role.selected === "admin"
                                                }
                                                {...role}
                                            />
                                            <Form.Check
                                                inline
                                                className="mr-5"
                                                type="radio"
                                                name="role"
                                                value="rep"
                                                checked={
                                                    role.selected === "rep"
                                                }
                                                label="STL Representation"
                                                {...role}
                                            />
                                            <Form.Check
                                                inline
                                                className="mr-5"
                                                type="radio"
                                                name="role"
                                                value="vet"
                                                label="Vet Practice"
                                                checked={
                                                    role.selected === "vet"
                                                }
                                                {...role}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            id="userName"
                                            type="text"
                                            {...name}
                                            placeholder="Enter Full Name"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            id="userEmail"
                                            type="email"
                                            {...email}
                                            placeholder="Enter Email Address"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            id="userPhone"
                                            type="text"
                                            {...phone}
                                            placeholder="Enter Phone Number"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            id="userPass"
                                            type="password"
                                            {...password}
                                            placeholder="Enter Password"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>
                                            Confirm Password
                                        </Form.Label>
                                        <Form.Control
                                            id="userPassConfirm"
                                            type="password"
                                            {...password_confirm}
                                            placeholder="Enter Password Again"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Button
                                className="float-right mt-5"
                                variant="outline-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="float-right mr-2 mt-5"
                                variant="primary"
                                onClick={handleSubmit}
                            >
                                Add User
                            </Button>

                            {formError && (
                                <Form.Text className="text-danger float-right mr-4">
                                    {formError}
                                </Form.Text>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );
}
