import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table'
import { Container, Row, Col } from "react-bootstrap";
import Pagination from "../utils/pagination.util";

const Owner = props => (
    <tr>
        <td><Link to={'/owners/edit/' + props.owner._id}>{props.owner.ownerName}</Link></td>
        <td>{props.owner.email}</td>
        <td>{props.owner.ownerPhone1}</td>
        <td className="text-capitalize">{props.owner.ownerCity}</td>
        <td className="text-capitalize">{props.owner.ownerState}</td>
        <td>{props.owner.created_at_str}</td>
    </tr>
);

export default class OwnerList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allOwners: [],
            activePage: 1,
            totalPages: 1
        }

        this.handleNextPage = this.handleNextPage.bind(this);
    }

    componentDidMount() {
        axios.get(window.$server_url + '/owners/page/1')
            .then(res => {
                this.setState({
                    allOwners: res.data
                });
            })
            .catch(err => {
                console.log(err);
            });

        axios.get(window.$server_url + '/owners/count')
            .then(res => {
                this.setState({
                    totalPages: parseInt(res.data / 20)
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    ownerList() {
        return this.state.allOwners.map(function (owner, index) {
            let created_at = (new Date(owner.created_at)).toString().split(' ');
            let created_at_obj = {
                created_at_str: created_at[1] + " " + created_at[2] + ", " + created_at[3] + " " + created_at[4]
            }

            return (
                <Owner owner={{ ...owner, ...created_at_obj }} key={index} />
            );
        });
    }

    handleNextPage(activePage) {
        axios.get(window.$server_url + '/owners/page/' + activePage)
            .then(res => {
                this.setState({
                    activePage,
                    allOwners: res.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <Fragment>
                <Container>

                    <h1 className="m-5 text-center">Registerd Owners</h1>

                    <Row>
                        <Table responsive striped>
                            <thead className="bg-danger text-white">
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email Address</th>
                                    <th>Primary Phone</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Registered Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.ownerList()}
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