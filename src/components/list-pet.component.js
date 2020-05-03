import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table'
import { Container, Row, Col } from "react-bootstrap";
import Pagination from "./pagination.component";

const Pet = props => (
    <tr>
        <td><Link to={'/pets/edit/' + props.pet.microchip}>{props.pet.microchip}</Link></td>
        <td className="text-capitalize">{props.pet.membership}</td>
        <td className="text-capitalize">{props.pet.petName}</td>
        <td>{props.pet.email}</td>
        <td>{props.pet.updated_at_str}</td>
    </tr>
);

export default class PetList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allPets: [],
            activePage: 1,
            totalPages: 1
        }

        this.handleNextPage = this.handleNextPage.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:4000/pets/page/1')
            .then(res => {
                this.setState({
                    allPets: res.data
                });
            })
            .catch(err => {
                console.log(err);
            });
        axios.get('http://localhost:4000/pets/count')
            .then(res => {
                this.setState({
                    totalPages: parseInt(res.data / 20)
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    petList() {
        return this.state.allPets.map(function (pet, index) {
            let updated_at = (new Date(pet.updated_at)).toString().split(' ');
            let updated_at_obj = {
                updated_at_str: updated_at[1] + " " + updated_at[2] + ", " + updated_at[3] + " " + updated_at[4]
            }

            return (
                <Pet pet={{ ...pet, ...updated_at_obj }} key={index} />
            );
        });
    }

    handleNextPage(activePage) {
        this.setState({
            activePage
        });
        // fetch data for the next page
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
                                    <th>Membership</th>
                                    <th>Pet Name</th>
                                    <th>Owner Email</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.petList()}
                            </tbody>
                        </Table>
                    </Row>

                    <Row className="mt-4">
                        <Col>
                            {this.state.totalPages > 1 &&
                                <Pagination
                                    totalPages={this.state.totalPages}
                                    currentPage={this.state.activePage}
                                    onChange={this.handleNextPage}
                                />
                            }
                        </Col>
                    </Row>
                </Container>

            </Fragment>
        );
    }
}