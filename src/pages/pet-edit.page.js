import React, { Component, Fragment } from "react";
import axios from "axios";
import { Formik } from "formik";
import "@availity/yup";
import * as yup from "yup";
import csc from "country-state-city";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Image from "react-bootstrap/Image";

import nophoto from "../assets/nophoto.png";

const CountryOptions = (props) => (
    <option value={props.sortname}>{props.name}</option>
);

const microchipRegExp = /(^991\d{12}$|^990164\d{9}$|^\d{9}$|^[a-zA-Z0-9]{10}$)/;

const schema = yup.object({
    microchip: yup
        .string()
        .min(9, "Microchip must be at least 9 characters")
        .max(15, "Microchip must be at most 15 characters")
        .matches(
            microchipRegExp,
            "Invalid microchip number. Enter only the 9, 10 or 15 character microchip number, with no punctuation or spaces."
        )
        .required("Microchip is a required field"),
    petName: yup.string().required("Pet Name is a required field"),
    petSpecies: yup
        .string()
        .notOneOf(["Choose One"])
        .required("Select Species"),
    petBreed: yup.string().required("Breed is a required field"),
    petColor: yup.string().required("Color is a required field"),
    petGender: yup.string().required("Please select one"),
    petBirth: yup.date().required("Birthdate is a required field"),
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is a required field"),
});

export default class RegisterPet extends Component {
    constructor(props) {
        super(props);

        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onPetPhotoUpdate = this.onPetPhotoUpdate.bind(this);
        this.photoErrorHandle = this.photoErrorHandle.bind(this);

        this.state = {
            values: {
                microchip: "",
                petName: "",
                petSpecies: "",
                petBreed: "",
                petColor: "",
                petGender: "male",
                petBirth: "",
                specialNeeds: "",
                vetInfo: "",
                dateRV: "",
                implantedCompany: "",
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
                membership: "platinum",
            },

            petPhoto: undefined,
            petPhotoPreview: undefined,
        };
    }

    componentDidMount() {
        axios
            .get(window.$server_url + "/pets/" + this.props.match.params.id)
            .then((res) => {
                let petValues = res.data;

                if (
                    petValues.petBirth === null ||
                    petValues.petBirth === undefined
                ) {
                    petValues.petBirth = "";
                } else {
                    petValues.petBirth = petValues.petBirth.split("T")[0];
                }

                if (
                    petValues.dateRV === null ||
                    petValues.dateRV === undefined
                ) {
                    petValues.dateRV = "";
                } else {
                    petValues.dateRV = petValues.dateRV.split("T")[0];
                }

                this.setState({
                    values: petValues,
                });

                axios
                    .get(window.$server_url + "/photos/" + petValues.microchip)
                    .then((res) => {
                        this.setState({
                            petPhotoPreview:
                                res.data === "" ? nophoto : res.data,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    photoErrorHandle = (e) => {
        e.preventDefault();
        e.target.src = nophoto;
    };

    onClickSubmit(values) {
        let photoPath = "";
        if (this.state.petPhoto !== undefined) {
            photoPath =
                "/uploads/photo/" +
                values.microchip +
                "." +
                this.state.petPhoto.name.split(".")[
                    this.state.petPhoto.name.split(".").length - 1
                ];
        }

        // Update Pet
        axios
            .patch(
                window.$server_url + "/pets/edit/" + this.props.match.params.id,
                {
                    ...values,
                    ...{ photoPath: photoPath },
                }
            )
            .then((res) => {
                if (this.state.petPhoto !== undefined) {
                    // Upload Pet's Photo
                    let photo_origin_name = this.state.petPhoto.name;
                    let petPhotoName =
                        values.microchip +
                        "." +
                        photo_origin_name.split(".")[
                            photo_origin_name.split(".").length - 1
                        ];

                    const photoData = new FormData();
                    photoData.append("petMicrochip", values.microchip);
                    photoData.append("petPhotoName", petPhotoName);
                    photoData.append("petPhotoData", this.state.petPhoto);

                    axios
                        .post(window.$server_url + "/photos/add", photoData)
                        .then((res) => {
                            this.props.history.push("/pets");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    this.props.history.push("/pets");
                }
            });
    }

    onClickCancel(e) {
        e.preventDefault();

        this.props.history.push("/pets");
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

    onPetPhotoUpdate(e) {
        e.preventDefault();

        this.setState({
            petPhoto: e.target.files[0],
            petPhotoPreview: URL.createObjectURL(e.target.files[0]),
        });
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <h1 className="m-5 text-center">Update Pet</h1>
                </Container>

                <Formik
                    enableReinitialize={true}
                    validationSchema={schema}
                    initialValues={{
                        microchip: this.state.values.microchip,
                        petName: this.state.values.petName,
                        petSpecies: this.state.values.petSpecies,
                        petBreed: this.state.values.petBreed,
                        petColor: this.state.values.petColor,
                        petGender: this.state.values.petGender,
                        petBirth: this.state.values.petBirth,
                        specialNeeds: this.state.values.specialNeeds,
                        vetInfo: this.state.values.vetInfo,
                        dateRV: this.state.values.dateRV,
                        implantedCompany: this.state.values.implantedCompany,
                        email: this.state.values.email,
                        membership: this.state.values.membership,
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
                                            <Card.Header className="bg-danger text-white">
                                                <h5 className="m-0">
                                                    Pet Information
                                                </h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form.Group as={Row}>
                                                    <Col>
                                                        <Form.Label>
                                                            Microchip Number
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="microchip"
                                                            placeholder="Microchip Number"
                                                            value={
                                                                values.microchip
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.microchip &&
                                                                !!errors.microchip
                                                            }
                                                            isValid={
                                                                touched.microchip &&
                                                                !errors.microchip
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.microchip}
                                                        </Form.Control.Feedback>
                                                        <Form.Text className="text-muted">
                                                            Do not include the
                                                            microchip type code
                                                            or manufacturer's
                                                            name or
                                                            abbreviation.
                                                        </Form.Text>
                                                    </Col>

                                                    <Col>
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
                                                            Never share this
                                                            email with anyone
                                                            else.
                                                        </Form.Text>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row}>
                                                    <Col>
                                                        <Form.Label>
                                                            Name
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="petName"
                                                            placeholder="Pet's Name"
                                                            value={
                                                                values.petName
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.petName &&
                                                                !!errors.petName
                                                            }
                                                            isValid={
                                                                touched.petName &&
                                                                !errors.petName
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.petName}
                                                        </Form.Control.Feedback>
                                                    </Col>

                                                    <Col>
                                                        <Form.Label>
                                                            Species
                                                        </Form.Label>
                                                        <Form.Control
                                                            className="text-capitalize"
                                                            as="select"
                                                            name="petSpecies"
                                                            value={values.petSpecies.toLowerCase()}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.petSpecies &&
                                                                !!errors.petSpecies
                                                            }
                                                            isValid={
                                                                touched.petSpecies &&
                                                                !errors.petSpecies
                                                            }
                                                        >
                                                            <option className="text-capitalize">
                                                                choose one
                                                            </option>
                                                            <option className="text-capitalize">
                                                                dog
                                                            </option>
                                                            <option className="text-capitalize">
                                                                cat
                                                            </option>
                                                            <option className="text-capitalize">
                                                                bird
                                                            </option>
                                                            <option className="text-capitalize">
                                                                ferret
                                                            </option>
                                                            <option className="text-capitalize">
                                                                goat
                                                            </option>
                                                            <option className="text-capitalize">
                                                                horse
                                                            </option>
                                                            <option className="text-capitalize">
                                                                pig
                                                            </option>
                                                            <option className="text-capitalize">
                                                                rabbit
                                                            </option>
                                                            <option className="text-capitalize">
                                                                snake
                                                            </option>
                                                        </Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.petSpecies}
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row}>
                                                    <Col>
                                                        <Form.Label>
                                                            Breed
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="petBreed"
                                                            placeholder="Pet's Breed"
                                                            value={
                                                                values.petBreed
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.petBreed &&
                                                                !!errors.petBreed
                                                            }
                                                            isValid={
                                                                touched.petBreed &&
                                                                !errors.petBreed
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.petBreed}
                                                        </Form.Control.Feedback>
                                                    </Col>

                                                    <Col>
                                                        <Form.Label>
                                                            Color
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="petColor"
                                                            placeholder="Pet's Color"
                                                            value={
                                                                values.petColor
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.petColor &&
                                                                !!errors.petColor
                                                            }
                                                            isValid={
                                                                touched.petColor &&
                                                                !errors.petColor
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.petColor}
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row}>
                                                    <Col>
                                                        <Form.Label>
                                                            Gender
                                                        </Form.Label>
                                                        <Col className="p-0">
                                                            <Form.Check
                                                                className="mr-4"
                                                                inline
                                                                type="radio"
                                                                label="Male"
                                                                name="petGender"
                                                                value="male"
                                                                checked={
                                                                    values.petGender.toLowerCase() ===
                                                                    "male"
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.petGender &&
                                                                    !!errors.petGender
                                                                }
                                                                isValid={
                                                                    touched.petGender &&
                                                                    !errors.petGender
                                                                }
                                                            />
                                                            <Form.Check
                                                                className="mr-4"
                                                                inline
                                                                type="radio"
                                                                label="Female"
                                                                name="petGender"
                                                                value="female"
                                                                checked={
                                                                    values.petGender.toLowerCase() ===
                                                                    "female"
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.petGender &&
                                                                    !!errors.petGender
                                                                }
                                                                isValid={
                                                                    touched.petGender &&
                                                                    !errors.petGender
                                                                }
                                                            />
                                                            <Form.Check
                                                                className="mr-4"
                                                                inline
                                                                type="radio"
                                                                label="Other"
                                                                name="petGender"
                                                                value="other"
                                                                checked={
                                                                    values.petGender.toLowerCase() ===
                                                                    "other"
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                isInvalid={
                                                                    touched.petGender &&
                                                                    !!errors.petGender
                                                                }
                                                                isValid={
                                                                    touched.petGender &&
                                                                    !errors.petGender
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {
                                                                    errors.petGender
                                                                }
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Col>

                                                    <Col>
                                                        <Form.Label>
                                                            Birthdate
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            name="petBirth"
                                                            value={
                                                                values.petBirth
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            isInvalid={
                                                                touched.petBirth &&
                                                                !!errors.petBirth
                                                            }
                                                            isValid={
                                                                touched.petBirth &&
                                                                !errors.petBirth
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.petBirth}
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row}>
                                                    <Col>
                                                        <Form.Label>
                                                            Pet's Photo
                                                        </Form.Label>
                                                        <Form.File custom>
                                                            <Form.File.Input
                                                                name="petPhoto"
                                                                onChange={
                                                                    this
                                                                        .onPetPhotoUpdate
                                                                }
                                                            />
                                                            <Form.File.Label data-browse="Upload">
                                                                Max. 512mb.
                                                                Type: .jpg /
                                                                .jpeg / .png /
                                                                .gif
                                                            </Form.File.Label>
                                                        </Form.File>
                                                        <Image
                                                            src={
                                                                this.state
                                                                    .petPhotoPreview
                                                            }
                                                            width="100%"
                                                            height="auto"
                                                            thumbnail
                                                            onError={
                                                                this
                                                                    .photoErrorHandle
                                                            }
                                                        />
                                                    </Col>

                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>
                                                                Any Special
                                                                Needs or
                                                                Medications
                                                            </Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                name="specialNeeds"
                                                                value={
                                                                    values.specialNeeds
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>
                                                                Veterinary
                                                                Information
                                                            </Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                name="vetInfo"
                                                                value={
                                                                    values.vetInfo
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Label>
                                                                Date of Rabies
                                                                Vaccination
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                name="dateRV"
                                                                value={
                                                                    values.dateRV
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Label>
                                                                Veterinary
                                                                Hospital or
                                                                Clinic where
                                                                Microchip was
                                                                registered.
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="implantedCompany"
                                                                placeholder="Veterinary Hospital or Clinic"
                                                                value={
                                                                    values.implantedCompany
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                Please Type Full
                                                                Name as it
                                                                appears. i.e.
                                                                "ZEPPY's Pet
                                                                Hospital"
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row}>
                                                    <Col></Col>

                                                    <Col></Col>
                                                </Form.Group>

                                                <Form.Group as={Row}>
                                                    <Col></Col>

                                                    <Col></Col>
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row className="mt-5">
                                    <Col>
                                        <Form.Group className="p-3 mb-0 shadow">
                                            <Row>
                                                <Col className="text-center">
                                                    <Form.Label className="mb-0">
                                                        Select Membership Type
                                                    </Form.Label>
                                                </Col>

                                                <Col className="p-0">
                                                    <Form.Check
                                                        className="mr-4"
                                                        inline
                                                        type="radio"
                                                        label="Platinum"
                                                        name="membership"
                                                        value="platinum"
                                                        checked={
                                                            values.membership ===
                                                            "platinum"
                                                        }
                                                        onChange={handleChange}
                                                    />

                                                    <Form.Check
                                                        className="mr-4"
                                                        inline
                                                        type="radio"
                                                        label="Diamond"
                                                        name="membership"
                                                        value="diamond"
                                                        checked={
                                                            values.membership ===
                                                            "diamond"
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>

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
                                            Update Pet
                                        </Button>
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
