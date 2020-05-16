import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import Pagination from "../utils/pagination.util";

const Owner = (props) => (
    <tr>
        <td>
            <Link to={"/owners/edit/" + props.owner._id}>
                {props.owner.ownerName}
            </Link>
        </td>
        <td className="text-lowercase">{props.owner.email}</td>
        <td>{props.owner.ownerPhone1}</td>
        <td className="text-capitalize">{props.owner.ownerCity}</td>
        <td className="text-capitalize">{props.owner.ownerState}</td>
        <td>{props.owner.registered_at}</td>
    </tr>
);

export default class OwnerList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allOwners: [],
            activePage: 1,
            totalPages: 1,
        };

        this.handleNextPage = this.handleNextPage.bind(this);
    }

    componentDidMount() {
        axios
            .get(window.$server_url + "/owners/page/1")
            .then((res) => {
                this.setState({
                    allOwners: res.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(window.$server_url + "/owners/count")
            .then((res) => {
                this.setState({
                    totalPages: parseInt(res.data / 20),
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    ownerList() {
        return this.state.allOwners.map(function (owner, index) {
            const replace_obj = {
                registered_at: moment(new Date(owner.registered_at)).format(
                    "MMM DD, YYYY"
                ),
            };

            return <Owner owner={{ ...owner, ...replace_obj }} key={index} />;
        });
    }

    handleNextPage(activePage) {
        axios
            .get(window.$server_url + "/owners/page/" + activePage)
            .then((res) => {
                this.setState({
                    activePage,
                    allOwners: res.data,
                });
            })
            .catch((err) => {
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
                                    <th style={{ width: "20%" }}>Full Name</th>
                                    <th style={{ width: "24%" }}>
                                        Email Address
                                    </th>
                                    <th style={{ width: "14%" }}>
                                        Primary Phone
                                    </th>
                                    <th style={{ width: "14%" }}>City</th>
                                    <th style={{ width: "14%" }}>State</th>
                                    <th style={{ width: "14%" }}>
                                        Registered At
                                    </th>
                                </tr>
                            </thead>

                            <tbody>{this.ownerList()}</tbody>
                        </Table>
                    </Row>

                    <Row className="mt-4">
                        <Col>
                            {this.state.totalPages > 1 && (
                                <Pagination
                                    totalPages={this.state.totalPages}
                                    currentPage={this.state.activePage}
                                    onChange={this.handleNextPage}
                                />
                            )}
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}
