import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table'
import { Container, Row } from "react-bootstrap";

const Pet = props => (
    <tr>
        <td>{props.pet.microchip}</td>
        <td>{props.pet.petName}</td>
        <td>{props.pet.ownerName}</td>
        <td>{props.pet.email}</td>
        <td><Link to={'/pets/edit/' + props.pet._id}>Edit</Link></td>
    </tr>
);

export default class PetList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allPets: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/pets')
            .then(res => {
                this.setState({
                    allPets: res.data
                });
            })
            .catch(err => {
                console.log(err);
            })
    }

    petList() {
        return this.state.allPets.map(function (pet, index) {
            return (
                <Pet pet={pet} key={index} />
            );
        });
    }

    render() {
        return (
            <Fragment>
                <Container>

                    <h1 className="m-5 text-center">Registerd Pets</h1>

                    <Row>
                        <Table responsive striped>
                            <thead className="bg-danger text-white">
                                <tr>
                                    <th>Microchip Number</th>
                                    <th>Pet Name</th>
                                    <th>Owner Name</th>
                                    <th>Owner Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.petList()}
                            </tbody>
                        </Table>
                    </Row>
                </Container>

            </Fragment>
        );
    }
}