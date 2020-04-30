import React, { Component, Fragment } from "react";
import axios from "axios";
import { Formik } from "formik";
import '@availity/yup';
import * as yup from "yup";
import csc from 'country-state-city';
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const CountryOptions = props => (
    <option value={props.sortname}>
        {props.name}
    </option>
);

const StateOptions = props => (
    <option value={props.sortname}>
        {props.name}
    </option>
)

const microchipRegExp = /(^991\d{12}$|^990164\d{9}$|^\d{9}$|^[a-zA-Z0-9]{10}$)/;
const schema = yup.object({
    microchip: yup.string()
        .min(9, "Microchip must be at least 9 characters")
        .max(15, "Microchip must be at most 15 characters")
        .matches(microchipRegExp, "Invalid microchip number. Enter only the 9, 10 or 15 character microchip number, with no punctuation or spaces.")
        .required("Microchip is a required field"),
    petName: yup.string()
        .required("Pet Name is a required field"),
    petSpecies: yup.string()
        .notOneOf(["Choose One"], "Please select one")
        .required("Species is a required field"),
    petBreed: yup.string()
        .required("Breed is a required field"),
    petColor: yup.string()
        .required("Color is a required field"),
    petGender: yup.string()
        .required("Please select one"),
    petBirth: yup.date()
        .required("Birthdate is a required field"),
    email: yup.string()
        .email("Invalid email address")
        .required("Email is a required field"),
    ownerName: yup.string()
        .required("Owner Name is a required field"),
    ownerPhone1: yup.string()
        .phone('Phone number is not valid')
        .required("Phone is a required field"),
    ownerPhone2: yup.string()
        .phone('Phone number is not valid'),
    ownerPhone3: yup.string()
        .phone('Phone number is not valid'),
    ownerPhone4: yup.string()
        .phone('Phone number is not valid'),
    ownerPhone5: yup.string()
        .phone('Phone number is not valid'),
    ownerPhone6: yup.string()
        .phone('Phone number is not valid'),
    ownerPhone7: yup.string()
        .phone('Phone number is not valid'),
    ownerAddress1: yup.string()
        .required("Address is a required field"),
    ownerCity: yup.string()
        .required("City is a required field"),
    ownerState: yup.string()
        .oneOf(["KY"], "State is not valid")
        .required("State is a required field"),
    ownerZip: yup.string()
        .required("Zipcode is a required field")
        
});

export default class RegisterPet extends Component {
    constructor(props) {
        super(props);

        this.onInputUpdate = this.onInputUpdate.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);

        this.state = {
            values: {}
        };
    }

    onInputUpdate (values) {
        this.setState({
            values: values
        });

        console.log(this.state);
    }

    onClickSubmit (values) {
        axios.post('http://localhost:4000/pets/register', values)
        .then(res => {
            console.log(res)
            this.props.history.push('/pets');
        })
        .catch(err => {
            console.log(err);
        });
    }

    onClickCancel (e) {
        e.preventDefault();
        this.props.history.push('/pets');
    }

    listAllCountryOptions () {
        return csc.getAllCountries().map(function (country, index) {
            return <CountryOptions name={country.name} sortname={country.sortname} key={index}></CountryOptions>
        });
    }

    listStateOptions (countryCode = "US") {
        let countryId = csc.getCountryByCode(countryCode).id;
        return csc.getStatesOfCountry(countryId).map(function (state, index) {
            return <StateOptions name={state.name} sortname={state.sortname} key={index}></StateOptions>
        })
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <h1 className="m-5 text-center">Register New Pet</h1>
                </Container>

                <Formik
                    validationSchema={schema}
                    initialValues={{
                        microchip: '',
                        petName: '',
                        petSpecies: '',
                        petBreed: '',
                        petColor: '',
                        petGender: '',
                        petBirth: '',
                        specialNeeds: '',
                        vetInfo: '',
                        dateRV: '',
                        implantedCompany: '',

                        email: '',
                        ownerName: '',
                        ownerPhone1: '',
                        ownerPhone2: '',
                        ownerPhone3: '',
                        ownerPhone4: '',
                        ownerPhone5: '',
                        ownerPhone6: '',
                        ownerPhone7: '',
                        ownerAddress1: '',
                        ownerAddress2: '',
                        ownerCity: '',
                        ownerState: '',
                        ownerZip: '',
                        ownerCountry: 'US',
                        ownerSecContact: '',
                        ownerNote: '',
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            this.onClickSubmit(values);
                            setSubmitting(false);
                        }, 400);
                    }}
                    onChange={(values) => {
                        this.onInputUpdate(values);
                    }}
                >
                    {({
                        values,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                        isSubmitting
                    }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Header><h5 className="m-0">Pet Information</h5></Card.Header>
                                        <Card.Body>

                                            <Form.Group>
                                                <Form.Label>Microchip Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="microchip"
                                                    placeholder="Microchip Number"
                                                    value={values.microchip}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.microchip}
                                                    isValid={touched.microchip && !errors.microchip}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.microchip}</Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                Do not include the microchip type code or manufacturer's name or abbreviation.
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="petName"
                                                    placeholder="Pet's Name"
                                                    value={values.petName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.petName}
                                                    isValid={touched.petName && !errors.petName}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.petName}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Species</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="petSpecies"
                                                    value={values.petSpecies}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.petSpecies}
                                                    isValid={touched.petSpecies && !errors.petSpecies}
                                                >
                                                    <option>Choose One</option>
                                                    <option>Dog</option>
                                                    <option>Cat</option>
                                                    <option>Bird</option>
                                                    <option>Ferret</option>
                                                    <option>Goat</option>
                                                    <option>Horse</option>
                                                    <option>Pig</option>
                                                    <option>Rabbit</option>
                                                    <option>Snake</option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">{errors.petSpecies}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Breed</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="petBreed"
                                                    placeholder="Pet's Breed"
                                                    value={values.petBreed}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.petBreed}
                                                    isValid={touched.petBreed && !errors.petBreed}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.petBreed}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Color</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="petColor"
                                                    placeholder="Pet's Color"
                                                    value={values.petColor}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.petColor}
                                                    isValid={touched.petColor && !errors.petColor}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.petColor}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Gender</Form.Label>
                                                <Col className="p-0">
                                                    <Form.Check 
                                                        className="mr-4"
                                                        inline type="radio"
                                                        label="Male"
                                                        name="petGender"
                                                        value="male"
                                                        checked={values.petGender === "male"}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.petGender}
                                                        isValid={touched.petGender && !errors.petGender}
                                                    />
                                                    <Form.Check 
                                                        className="mr-4"
                                                        inline type="radio"
                                                        label="Female"
                                                        name="petGender"
                                                        value="female"
                                                        checked={values.petGender === "female"}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.petGender}
                                                        isValid={touched.petGender && !errors.petGender}
                                                    />
                                                    <Form.Check 
                                                        className="mr-4"
                                                        inline
                                                        type="radio"
                                                        label="Other"
                                                        name="petGender"
                                                        value="other"
                                                        checked={values.petGender === "other"}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.petGender}
                                                        isValid={touched.petGender && !errors.petGender}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.petGender}</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Birthdate</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="petBirth"
                                                    value={values.petBirth}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.petBirth}
                                                    isValid={touched.petBirth && !errors.petBirth}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.petBirth}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Any Special Needs or Medications</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="specialNeeds"
                                                    value={values.specialNeeds}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Veterinary Information</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="vetInfo"
                                                    value={values.vetInfo}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Date of Rabies Vaccination</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="dateRV"
                                                    value={values.dateRV}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Veterinary Hospital or Clinic where Microchip was registered.</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="implantedCompany"
                                                    placeholder="Veterinary Hospital or Clinic"
                                                    value={values.implantedCompany}
                                                    onChange={handleChange}
                                                />
                                                <Form.Text className="text-muted">
                                                    Please Type Full Name as it appears. i.e. "ZEPPY's Pet Hospital"
                                                </Form.Text>
                                            </Form.Group>

                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col>
                                    <Card>
                                        <Card.Header><h5 className="m-0">Owner Information</h5></Card.Header>
                                        <Card.Body>

                                            <Form.Group>
                                                <Form.Label>Email Address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="Owner's Email Address"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.email}
                                                    isValid={touched.email && !errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                We'll never share your email with anyone else.
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="ownerName"
                                                    placeholder="Owner's Full Name"
                                                    value={values.ownerName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerName}
                                                    isValid={touched.ownerName && !errors.ownerName}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerName}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Phone</Form.Label>
                                                <Form.Control
                                                    type="phone"
                                                    name="ownerPhone1"
                                                    placeholder="Owner's Primary Phone Number"
                                                    value={values.ownerPhone1}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerPhone1}
                                                    isValid={touched.ownerPhone1 && !errors.ownerPhone1}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerPhone1}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Secondary Phone</Form.Label>
                                                <Form.Control
                                                    type="phone"
                                                    name="ownerPhone2"
                                                    placeholder="Owner's Secondary Phone Number"
                                                    value={values.ownerPhone2}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerPhone2}
                                                    isValid={touched.ownerPhone2 && !errors.ownerPhone2}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerPhone2}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Label>Address</Form.Label>
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="ownerAddress1"
                                                    placeholder="1234 Main St"
                                                    value={values.ownerAddress1}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerAddress1}
                                                    isValid={touched.ownerAddress1 && !errors.ownerAddress1}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerAddress1}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="ownerAddress2"
                                                    placeholder="Apartment, studio, or floor"
                                                    value={values.ownerAddress2}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Row>

                                                <Form.Group as={Col}>
                                                    <Form.Control
                                                        type="text"
                                                        name="ownerCity"
                                                        placeholder="City"
                                                        value={values.ownerCity}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.ownerCity}
                                                        isValid={touched.ownerCity && !errors.ownerCity}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.ownerCity}</Form.Control.Feedback>
                                                    <Form.Control.Feedback></Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col}>
                                                    <Form.Control
                                                        as="select"
                                                        name="ownerCountry"
                                                        value={values.ownerCountry}
                                                        onChange={handleChange}
                                                    >
                                                        {this.listStateOptions()}
                                                    </Form.Control>
                                                </Form.Group>

                                            </Form.Row>

                                            <Form.Row>

                                                <Form.Group as={Col}>
                                                    <Form.Control
                                                        type="text"
                                                        name="ownerZip"
                                                        placeholder="Zip Code"
                                                        value={values.ownerZip}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={!!errors.ownerZip}
                                                        isValid={touched.ownerZip && !errors.ownerZip}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.ownerZip}</Form.Control.Feedback>
                                                    <Form.Control.Feedback></Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col}>
                                                    <Form.Control
                                                        as="select"
                                                        name="ownerCountry"
                                                        value={values.ownerCountry}
                                                        onChange={handleChange}
                                                    >
                                                        {this.listAllCountryOptions(values.ownerCountry)}
                                                    </Form.Control>
                                                </Form.Group>

                                            </Form.Row>

                                            <Form.Group>
                                                <Form.Label>Secondary Contact</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="ownerSecContact"
                                                    placeholder="Owner's Secondary Contact Information"
                                                    value={values.ownerSecContact}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Label>Additional Phones</Form.Label>
                                            <Form.Group>
                                                <Form.Control
                                                    className="mb-1"
                                                    type="phone"
                                                    name="ownerPhone3"
                                                    value={values.ownerPhone3}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerPhone3}
                                                    isValid={touched.ownerPhone3 && !errors.ownerPhone3}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerPhone3}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control
                                                    className="mb-1"
                                                    type="phone"
                                                    name="ownerPhone4"
                                                    value={values.ownerPhone4}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerPhone4}
                                                    isValid={touched.ownerPhone4 && !errors.ownerPhone4}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerPhone4}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>
                                            
                                            <Form.Group>
                                                <Form.Control
                                                    className="mb-1"
                                                    type="phone"
                                                    name="ownerPhone5"
                                                    value={values.ownerPhone5}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerPhone5}
                                                    isValid={touched.ownerPhone5 && !errors.ownerPhone5}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerPhone5}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>
                                            
                                            <Form.Group>
                                                <Form.Control
                                                    className="mb-1"
                                                    type="phone"
                                                    name="ownerPhone6"
                                                    value={values.ownerPhone6}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerPhone6}
                                                    isValid={touched.ownerPhone6 && !errors.ownerPhone6}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerPhone6}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>
                                            
                                            <Form.Group>
                                                <Form.Control
                                                    className="mb-1"
                                                    type="phone"
                                                    name="ownerPhone7"
                                                    value={values.ownerPhone7}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.ownerPhone7}
                                                    isValid={touched.ownerPhone7 && !errors.ownerPhone7}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.ownerPhone7}</Form.Control.Feedback>
                                                <Form.Control.Feedback></Form.Control.Feedback>
                                            </Form.Group>
                                            
                                            <Form.Group>
                                                <Form.Label>Special Note</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="ownerNote"
                                                    value={values.ownerNote}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col className="mt-3">
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>Register Pet</Button>{' '}
                                    <Button variant="outline-secondary" onClick={this.onClickCancel}>Cancel</Button>
                                </Col>
                            </Row>
                            
                        </Container>
                    </Form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}