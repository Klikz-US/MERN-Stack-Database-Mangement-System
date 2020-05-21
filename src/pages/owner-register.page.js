import React, { Component, Fragment } from "react";
import axios from "axios";
import { Formik } from "formik";
import "@availity/yup";
import * as yup from "yup";
import csc from "country-state-city";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const CountryOptions = (props) => (
    <option value={props.sortname}>{props.name}</option>
);

const zipcodeRegExp = /^\d{5}(?:[-\s]\d{4})?$/;

const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is a required field"),
    ownerName: yup.string().required("Owner Name is a required field"),
    ownerPhone1: yup
        .string()
        .phone("Phone number is not valid")
        .required("Phone is a required field"),
    ownerPhone2: yup.string().phone("Phone number is not valid"),
    ownerPhone3: yup.string().phone("Phone number is not valid"),
    ownerPhone4: yup.string().phone("Phone number is not valid"),
    ownerPhone5: yup.string().phone("Phone number is not valid"),
    ownerPhone6: yup.string().phone("Phone number is not valid"),
    ownerPhone7: yup.string().phone("Phone number is not valid"),
    ownerAddress1: yup.string().required("Address is a required field"),
    ownerCity: yup.string().required("City is a required field"),
    ownerState: yup.string().required("State is a required field"),
    ownerZip: yup
        .string()
        .matches(zipcodeRegExp, "Invalid Zip Code.")
        .required("Zipcode is a required field"),
});

export default class RegisterOwner extends Component {
    constructor(props) {
        super(props);

        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);

        this.state = {
            error: "",
        };
    }

    onClickSubmit(values) {
        // Register Owner
        axios
            .post(window.$server_url + "/owners/register", values)
            .then((res) => {
                this.props.history.push("/owners");
            })
            .catch((err) => {
                this.setState({
                    error: err.response.data,
                });
            });
    }

    onClickCancel(e) {
        e.preventDefault();
        this.props.history.push("/owners");
    }

    listAllCountryOptions() {
        return csc.getAllCountries().map(function (country, index) {
            return (
                <CountryOptions
                    name={country.name}
                    sortname={country.sortname}
                    key={index}
                ></CountryOptions>
            );
        });
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <h1 className="m-5 text-center">Register New Owner</h1>
                </Container>

                <Formik
                    validationSchema={schema}
                    initialValues={{
                        email: "",
                        ownerName: "",
                        ownerPhone1: "",
                        ownerPhone2: "",
                        ownerPhone3: "",
                        ownerPhone4: "",
                        ownerPhone5: "",
                        ownerPhone6: "",
                        ownerPhone7: "",
                        ownerAddress1: "",
                        ownerAddress2: "",
                        ownerCity: "",
                        ownerState: "",
                        ownerZip: "",
                        ownerCountry: "US",
                        ownerSecContact: "",
                        ownerNote: "",
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            this.onClickSubmit(values);
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({
                        values,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                        isSubmitting,
                    }) => (
                        <Form
                            noValidate
                            onSubmit={handleSubmit}
                            autoComplete="off"
                        >
                            <Container>
                                <Row>
                                    <Col>
                                        <Card className="h-100 shadow">
                                            <Card.Header className="bg-success text-white">
                                                <h5 className="m-0">
                                                    Owner Information
                                                </h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form.Row>
                                                    <Form.Group as={Col}>
                                                        <Form.Label>
                                                            Email Address
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            placeholder="Owner's Email Address"
                                                            value={values.email}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.email &&
                                                                !!errors.email
                                                            }
                                                            isValid={
                                                                touched.email &&
                                                                !errors.email
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.email}
                                                        </Form.Control.Feedback>
                                                        <Form.Text className="text-muted">
                                                            We'll never share
                                                            your email with
                                                            anyone else.
                                                        </Form.Text>
                                                    </Form.Group>

                                                    <Form.Group as={Col}>
                                                        <Form.Label>
                                                            Name
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="ownerName"
                                                            placeholder="Owner's Full Name"
                                                            value={
                                                                values.ownerName
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.ownerName &&
                                                                !!errors.ownerName
                                                            }
                                                            isValid={
                                                                touched.ownerName &&
                                                                !errors.ownerName
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.ownerName}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col}>
                                                        <Form.Label>
                                                            Phone
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="phone"
                                                            name="ownerPhone1"
                                                            placeholder="Owner's Primary Phone Number"
                                                            value={
                                                                values.ownerPhone1
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.ownerPhone1 &&
                                                                !!errors.ownerPhone1
                                                            }
                                                            isValid={
                                                                touched.ownerPhone1 &&
                                                                !errors.ownerPhone1
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.ownerPhone1}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col}>
                                                        <Form.Label>
                                                            Secondary Phone
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="phone"
                                                            name="ownerPhone2"
                                                            placeholder="Owner's Secondary Phone Number"
                                                            value={
                                                                values.ownerPhone2
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.ownerPhone2 &&
                                                                !!errors.ownerPhone2
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.ownerPhone2}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Label>Address</Form.Label>
                                                <Form.Row>
                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            type="text"
                                                            name="ownerAddress1"
                                                            placeholder="1234 Main St"
                                                            value={
                                                                values.ownerAddress1
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.ownerAddress1 &&
                                                                !!errors.ownerAddress1
                                                            }
                                                            isValid={
                                                                touched.ownerAddress1 &&
                                                                !errors.ownerAddress1
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {
                                                                errors.ownerAddress1
                                                            }
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            type="text"
                                                            name="ownerAddress2"
                                                            placeholder="Apartment, studio, or floor"
                                                            value={
                                                                values.ownerAddress2
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            type="text"
                                                            name="ownerCity"
                                                            placeholder="City"
                                                            value={
                                                                values.ownerCity
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.ownerCity &&
                                                                !!errors.ownerCity
                                                            }
                                                            isValid={
                                                                touched.ownerCity &&
                                                                !errors.ownerCity
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.ownerCity}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            type="text"
                                                            name="ownerState"
                                                            placeholder="State"
                                                            value={
                                                                values.ownerState
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.ownerState &&
                                                                !!errors.ownerState
                                                            }
                                                            isValid={
                                                                touched.ownerState &&
                                                                !errors.ownerState
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.ownerState}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            type="text"
                                                            name="ownerZip"
                                                            placeholder="12345 (12345-6789)"
                                                            value={
                                                                values.ownerZip
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.ownerZip &&
                                                                !!errors.ownerZip
                                                            }
                                                            isValid={
                                                                touched.ownerZip &&
                                                                !errors.ownerZip
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.ownerZip}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            as="select"
                                                            name="ownerCountry"
                                                            value={
                                                                values.ownerCountry
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            {this.listAllCountryOptions(
                                                                values.ownerCountry
                                                            )}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row>
                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>
                                                                Secondary
                                                                Contact
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="ownerSecContact"
                                                                placeholder="Owner's Secondary Contact Information"
                                                                value={
                                                                    values.ownerSecContact
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Label>
                                                                Special Note
                                                            </Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                name="ownerNote"
                                                                value={
                                                                    values.ownerNote
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </Col>

                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>
                                                                Additional
                                                                Phones
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="phone"
                                                                name="ownerPhone3"
                                                                value={
                                                                    values.ownerPhone3
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.ownerPhone3 &&
                                                                    !!errors.ownerPhone3
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {
                                                                    errors.ownerPhone3
                                                                }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Control
                                                                type="phone"
                                                                name="ownerPhone4"
                                                                value={
                                                                    values.ownerPhone4
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.ownerPhone4 &&
                                                                    !!errors.ownerPhone4
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {
                                                                    errors.ownerPhone4
                                                                }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Control
                                                                type="phone"
                                                                name="ownerPhone5"
                                                                value={
                                                                    values.ownerPhone5
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.ownerPhone5 &&
                                                                    !!errors.ownerPhone5
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {
                                                                    errors.ownerPhone5
                                                                }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Control
                                                                type="phone"
                                                                name="ownerPhone6"
                                                                value={
                                                                    values.ownerPhone6
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.ownerPhone6 &&
                                                                    !!errors.ownerPhone6
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {
                                                                    errors.ownerPhone6
                                                                }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Control
                                                                type="phone"
                                                                name="ownerPhone7"
                                                                value={
                                                                    values.ownerPhone7
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.ownerPhone7 &&
                                                                    !!errors.ownerPhone7
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {
                                                                    errors.ownerPhone7
                                                                }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                </Form.Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row className="mt-5">
                                    <Col>
                                        <Button
                                            className="float-right"
                                            variant="outline-secondary"
                                            onClick={this.onClickCancel}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            className="float-right mr-2"
                                            variant="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            Register Owner
                                        </Button>
                                    </Col>
                                </Row>
                                {this.state.error !== "" && (
                                    <Form.Text className="text-danger float-right pr-5">
                                        {this.state.error}
                                    </Form.Text>
                                )}
                            </Container>
                        </Form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}
