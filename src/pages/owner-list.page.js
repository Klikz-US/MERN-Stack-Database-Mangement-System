import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { MdErrorOutline } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

import {
    ownerGetListService,
    ownerGetCountService,
    ownerDeleteService,
} from "./../services/owner.service";
import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { ownerSearchService } from "../services/search.service";
import { useFormInput } from "../utils/form-input.util";
import { useFormCheck } from "../utils/form-check.util";
import Pagination from "../utils/pagination.util";

export default function OwnerList() {
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

    const [owners, setOwners] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageLoading, setPageLoading] = useState(true);

    const searchCategory = useFormCheck("email");
    const searchValue = useFormInput("");
    const [hasResult, setHasResult] = useState(false);
    const [hasSearchError, setHasSearchError] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const ownerList = await ownerGetListService(activePage);
            if (!ownerList.error) {
                setOwners(ownerList.data);
            }

            const ownerCount = await ownerGetCountService();
            if (!ownerCount.error)
                setTotalPages(parseInt(ownerCount.data / 20));
            setPageLoading(false);
        }
        if (!hasResult) {
            setPageLoading(true);
            fetchData();
        }
    }, [dispatch, activePage, hasResult]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();

        if (searchValue.value.trim() !== "") {
            async function fetchData() {
                setIsSearching(true);

                const searchReq = {
                    field: searchCategory.selected,
                    value: searchValue.value.trim(),
                };

                const searchResult = await ownerSearchService(searchReq);
                if (searchResult.error) {
                    setHasSearchError(true);
                    setHasResult(false);
                } else {
                    setHasSearchError(false);
                    setHasResult(true);
                    setOwners(searchResult.data);
                }

                setIsSearching(false);
            }
            fetchData();
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();

        setHasSearchError(false);
        setHasResult(false);
    };

    const handleDelete = (_id) => {
        async function fetchData() {
            const result = await ownerDeleteService(_id);
            if (result.error) {
                console.log(result.errMsg);
            } else {
                async function fetchOwnerData() {
                    const ownerList = await ownerGetListService(activePage);
                    if (!ownerList.error) {
                        if (hasResult) {
                            handleSearch();
                        } else {
                            setOwners(ownerList.data);
                        }
                    }

                    const ownerCount = await ownerGetCountService();
                    if (!ownerCount.error)
                        setTotalPages(parseInt(ownerCount.data / 20));
                }
                fetchOwnerData();
            }
            setPageLoading(false);
        }
        setPageLoading(true);
        fetchData();
    };

    const pagination = () => {
        async function handleNextPage(activePage) {
            setActivePage(activePage);
        }

        return (
            <Pagination
                totalPages={totalPages}
                currentPage={activePage}
                onChange={handleNextPage}
            />
        );
    };

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
            <td>
                {moment(new Date(props.owner.registered_at)).format(
                    "MMM DD, YYYY"
                )}
            </td>
            <td className="text-center">
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(props.owner._id)}
                >
                    {" "}
                    <FaTrashAlt className="text-danger mx-1" />
                </span>
            </td>
        </tr>
    );

    const ownerList = (owners) => {
        if (pageLoading) {
            return (
                <tr>
                    <td>
                        <Container
                            className="my-5 py-5 text-center"
                            style={{ position: "absolute" }}
                        >
                            <ClipLoader
                                css="margin: auto;"
                                size={100}
                                color={"#ff0000"}
                                loading={pageLoading}
                            />
                        </Container>
                    </td>
                </tr>
            );
        } else {
            return owners.map(function (owner, index) {
                return <Owner owner={owner} key={index} />;
            });
        }
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Registerd Owners</h1>

                <Row className="mt-4">
                    <Col>
                        <Form>
                            <Form.Group as={Row}>
                                <Col md="4" className="pl-0 my-auto">
                                    <Form.Control
                                        as="select"
                                        className="text-capitalize"
                                        {...searchCategory}
                                    >
                                        <option value="email">Email</option>
                                        <option value="ownerName">
                                            Owner Name
                                        </option>
                                        <option value="ownerState">
                                            Owner State
                                        </option>
                                    </Form.Control>
                                </Col>

                                <Col md="5" className="pl-0 my-auto">
                                    <Form.Control
                                        type="text"
                                        {...searchValue}
                                    />
                                </Col>

                                <Col md="3" className="pl-0">
                                    <Button
                                        type="submit"
                                        variant="outline-info"
                                        className="float-left px-2"
                                        disabled={isSearching}
                                        onClick={handleSearch}
                                    >
                                        <FaSearch className="text-danger mx-1" />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        className="float-left px-2"
                                        disabled={isSearching}
                                        onClick={handleCancel}
                                    >
                                        <FcCancel className="text-info mx-1" />
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className="px-0">
                        {totalPages > 1 &&
                            !hasResult &&
                            !hasSearchError &&
                            pagination()}
                    </Col>
                </Row>

                <Row>
                    <Table responsive>
                        <thead className="bg-danger text-white">
                            <tr>
                                <th style={{ width: "20%", maxWidth: "20%" }}>
                                    Full Name
                                </th>
                                <th style={{ width: "20%", maxWidth: "20%" }}>
                                    Email Address
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    Primary Phone
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    City
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    State
                                </th>
                                <th style={{ width: "13%", maxWidth: "13%" }}>
                                    Registered At
                                </th>
                                <th style={{ width: "5%", maxWidth: "5%" }}>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {!hasSearchError && <tbody>{ownerList(owners)}</tbody>}
                    </Table>
                </Row>

                {hasSearchError && (
                    <Row className="justify-content-md-center my-5">
                        <MdErrorOutline
                            className="text-warning mr-1"
                            size={24}
                        />
                        No Owner Found
                    </Row>
                )}
            </Container>
        </>
    );
}
