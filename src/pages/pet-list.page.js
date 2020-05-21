import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { MdErrorOutline } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

import {
    petGetListService,
    petGetCountService,
    petDeleteService,
} from "./../services/pet.service";
import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { petSearchService } from "../services/search.service";
import { useFormInput } from "../utils/form-input.util";
import { useFormCheck } from "../utils/form-check.util";
import Pagination from "../utils/pagination.util";
import nophoto from "../assets/nophoto.png";

export default function PetList() {
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

    const [pets, setPets] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageLoading, setPageLoading] = useState(true);

    const searchCategory = useFormCheck("microchip");
    const searchValue = useFormInput("");
    const [hasResult, setHasResult] = useState(false);
    const [hasSearchError, setHasSearchError] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const petList = await petGetListService(activePage);
            if (!petList.error) {
                setPets(petList.data);
            }

            const petCount = await petGetCountService();
            if (!petCount.error) setTotalPages(parseInt(petCount.data / 20));
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

                const searchResult = await petSearchService(searchReq);
                if (searchResult.error) {
                    setHasSearchError(true);
                    setHasResult(false);
                } else {
                    setHasSearchError(false);
                    setHasResult(true);
                    setPets(searchResult.data);
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
            const result = await petDeleteService(_id);
            if (result.error) {
                console.log(result.errMsg);
            } else {
                async function fetchPetData() {
                    const petList = await petGetListService(activePage);
                    if (!petList.error) {
                        if (hasResult) {
                            handleSearch();
                        } else {
                            setPets(petList.data);
                        }
                    }

                    const petCount = await petGetCountService();
                    if (!petCount.error)
                        setTotalPages(parseInt(petCount.data / 20));
                }
                fetchPetData();
            }
            setPageLoading(false);
        }
        setPageLoading(true);
        fetchData();
    };

    const photoErrorHandle = (e) => {
        e.preventDefault();
        e.target.src = nophoto;
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

    const renderPhotoPopover = (pet) => {
        return (
            <Popover id={pet.microchip} className="shadow">
                <Popover.Title as="h2" className="text-center">
                    {pet.microchip}
                </Popover.Title>
                <Popover.Content>
                    <img
                        src={pet.photoPath ? pet.photoPath : nophoto}
                        width="100%"
                        height="auto"
                        alt={pet.microchip}
                        onError={photoErrorHandle}
                    />
                </Popover.Content>
            </Popover>
        );
    };

    const Pet = (props) => (
        <tr style={{ height: "70px" }}>
            <td>
                <Link to={"/pets/edit/" + props.pet._id}>
                    {props.pet.microchip}
                </Link>
            </td>
            <td className="text-uppercase">{props.pet.membership}</td>
            <td className="text-capitalize">{props.pet.petName}</td>
            <td className="text-lowercase">
                {props.pet.ownerId !== "" && (
                    <Link to={"/owners/edit/" + props.pet.ownerId}>
                        {props.pet.email}
                    </Link>
                )}
                {props.pet.ownerId === "" && <>{props.pet.email}</>}
            </td>
            <td className="text-capitalize">{props.pet.ownerName}</td>
            <td>
                {moment(new Date(props.pet.registered_at)).format(
                    "MMM DD, YYYY"
                )}
            </td>
            <td className="p-1">
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderPhotoPopover(props.pet)}
                >
                    <img
                        src={
                            props.pet.photoPath ? props.pet.photoPath : nophoto
                        }
                        width="73"
                        height="73"
                        alt={props.pet.microchip}
                        onError={photoErrorHandle}
                    />
                </OverlayTrigger>
            </td>
            <td className="text-center pt-3">
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(props.pet._id)}
                >
                    {" "}
                    <FaTrashAlt className="text-danger mx-1" />
                </span>
            </td>
        </tr>
    );

    const petList = (pets) => {
        if (pageLoading) {
            return (
                <tr>
                    <td>
                        <Container
                            className="py-5 text-center"
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
            return pets.map(function (pet, index) {
                return <Pet pet={pet} key={index} />;
            });
        }
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Registerd Pets</h1>

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
                                        <option value="microchip">
                                            Microchip
                                        </option>
                                        <option value="email">
                                            Owner Email
                                        </option>
                                        <option value="petName">
                                            Pet Name
                                        </option>
                                        <option value="ownerName">
                                            Owner Name
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
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    Microchip
                                </th>
                                <th style={{ width: "11%", maxWidth: "11%" }}>
                                    Membership
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    Pet Name
                                </th>
                                <th style={{ width: "20%", maxWidth: "20%" }}>
                                    Owner Email
                                </th>
                                <th style={{ width: "20%", maxWidth: "20%" }}>
                                    Owner Name
                                </th>
                                <th style={{ width: "13%", maxWidth: "13%" }}>
                                    Registered At
                                </th>
                                <th style={{ width: "4%", maxWidth: "4%" }}>
                                    Photo
                                </th>
                                <th style={{ width: "4%", maxWidth: "4%" }}>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {!hasSearchError && <tbody>{petList(pets)}</tbody>}
                    </Table>
                </Row>

                {hasSearchError && (
                    <Row className="justify-content-md-center my-5">
                        <MdErrorOutline
                            className="text-warning mr-1"
                            size={24}
                        />
                        No Pet Found
                    </Row>
                )}
            </Container>
        </>
    );
}
