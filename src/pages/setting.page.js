import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";

import {
    verifyTokenAsync,
    userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import { useFormCheck } from "../utils/form-check.util";
import { userGetService, userUpdateService } from "../services/user.service";

import img from "../assets/images/user-register.jpg";

export default function UserEdit() {
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

    const { userId } = auth_obj.user;
    const history = useHistory();
    const [formError, setFormError] = useState("");
    const [user, setUser] = useState({
        role: "",
        name: "",
        email: "",
        phone: "",
    });

    const role = useFormCheck(user.role);
    const name = useFormInput(user.name);
    const email = useFormInput(user.email);
    const phone = useFormInput(user.phone);
    const pass = useFormInput("");
    const pass_confirm = useFormInput("");

    useEffect(() => {
        async function getData() {
            const result = await userGetService(userId);
            if (result.error) {
                dispatch(userLogoutAsync());
            } else {
                console.log(result.data);
                setUser(result.data);
            }
        }
        getData();
    }, [dispatch, userId, setUser]);

    const handleSubmit = (e) => {
        e.preventDefault();

        async function fetchData() {
            let updateUser = {};
            if (pass.value !== pass_confirm.value) {
                setFormError("Re-enter the passwords!");
            } else {
                updateUser = {
                    role: user.role,
                    email: email.value,
                    phone: phone.value,
                    name: name.value,
                    password: pass.value,
                };
            }

            updateUser.isAdmin = updateUser.role === "admin" ? true : false;
            const result = await userUpdateService(userId, updateUser);
            if (result.error) {
                setFormError(result.errMsg);
            } else {
                history.push("/users");
            }
        }
        fetchData();
    };

    const handleCancel = (e) => {
        e.preventDefault();
        history.push("/users");
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">My Profile</h1>

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
                                                disabled={true}
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
                                                disabled={true}
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
                                                disabled={true}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...name}
                                            placeholder="Enter Full Name"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            {...email}
                                            placeholder="Enter Email Address"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...phone}
                                            placeholder="Enter Phone Number"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            {...pass}
                                            placeholder="Enter Password"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>
                                            Confirm Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            {...pass_confirm}
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
                                Update
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
