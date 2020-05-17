import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { FaSearch } from "react-icons/fa";

import { searchService } from "./../services/search.service";
import {
    verifyTokenAsync,
    userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import { useFormCheck } from "../utils/form-check.util";
import nophoto from "../assets/nophoto.png";

export default function Search() {
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

    const [results, setResults] = useState([]);
    const searchCategory = useFormCheck("microchip");
    const searchValue = useFormInput("");
    const [hasResult, setHasResult] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const renderPhotoPopover = (result) => {
        return (
            <Popover id={result.microchip}>
                <Popover.Title as="h3">Popover right</Popover.Title>
                <Popover.Content>
                    <img
                        src={result.photoPath ? result.photoPath : nophoto}
                        width="100%"
                        height="auto"
                        alt={result.membership}
                    />
                </Popover.Content>
            </Popover>
        );
    };

    const Result = (props) => (
        <tr style={{ height: "70px" }}>
            <td>
                <Link to={"/pets/edit/" + props.result.microchip}>
                    {props.result.microchip}
                </Link>
            </td>
            <td className="text-uppercase">{props.result.membership}</td>
            <td className="text-capitalize">{props.result.petName}</td>
            <td className="text-lowercase">{props.result.email}</td>
            <td className="text-capitalize">{props.result.ownerName}</td>
            <td>{props.result.registered_at}</td>
            <td className="p-0">
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderPhotoPopover(props.result)}
                >
                    <img
                        src={
                            props.result.photoPath
                                ? props.result.photoPath
                                : nophoto
                        }
                        width="70"
                        height="70"
                        alt={props.result.membership}
                    />
                </OverlayTrigger>
            </td>
        </tr>
    );

    const resultList = (results) => {
        return results.map(function (result, index) {
            const replace_obj = {};

            return <Result result={result} key={index} />;
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchValue.value !== "") {
            async function fetchData() {
                setIsSearching(true);
                const searchReq = {
                    field: searchCategory.selected,
                    value: searchValue.value,
                };

                console.log(searchReq);
                const searchResult = await searchService(searchReq);
                if (searchResult.error) {
                    setHasResult(false);
                } else {
                    setHasResult(true);
                    setResults(searchResult.data);
                }

                setIsSearching(false);
            }
            fetchData();
        }
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Search</h1>
                <Form>
                    <Form.Group as={Row} className="justify-content-md-center">
                        <Col md="3">
                            <Form.Control
                                as="select"
                                className="text-capitalize"
                                {...searchCategory}
                            >
                                <option value="microchip">Microchip</option>
                                <option value="email">Owner Email</option>
                                <option value="petName">Pet Name</option>
                                <option value="ownerName">Owner Name</option>
                                <option value="petBreed">Pet Breed</option>
                                <option value="implanted">
                                    Implanted Company
                                </option>
                            </Form.Control>
                        </Col>

                        <Col md="4">
                            <Form.Control
                                type="text"
                                {...searchValue}
                                placeholder="Microchip Number"
                            />
                        </Col>

                        <Col md="1">
                            <Button
                                className="float-right mr-2"
                                variant="outline-info"
                                disabled={isSearching}
                                onClick={handleSearch}
                            >
                                <FaSearch className="text-danger mx-1" />
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>

                <h1 className="m-5 text-center">Search Result</h1>
                <Row>
                    <Table responsive striped>
                        <thead className="bg-danger text-white">
                            <tr>
                                <th
                                    style={{
                                        width: "14%",
                                        maxWidth: "14%",
                                    }}
                                >
                                    Microchip
                                </th>
                                <th
                                    style={{
                                        width: "11%",
                                        maxWidth: "11%",
                                    }}
                                >
                                    Membership
                                </th>
                                <th
                                    style={{
                                        width: "15%",
                                        maxWidth: "15%",
                                    }}
                                >
                                    Pet Name
                                </th>
                                <th
                                    style={{
                                        width: "21%",
                                        maxWidth: "21%",
                                    }}
                                >
                                    Owner Email
                                </th>
                                <th
                                    style={{
                                        width: "20%",
                                        maxWidth: "20%",
                                    }}
                                >
                                    Owner Name
                                </th>
                                <th
                                    style={{
                                        width: "14%",
                                        maxWidth: "14%",
                                    }}
                                >
                                    Registered At
                                </th>
                                <th style={{ width: "5%", maxWidth: "5%" }}>
                                    Photo
                                </th>
                            </tr>
                        </thead>
                        {hasResult && <tbody>{resultList(results)}</tbody>}
                    </Table>
                </Row>
            </Container>
        </>
    );
}
