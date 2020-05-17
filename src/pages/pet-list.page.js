import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { FaSearch } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

import {
    petGetListService,
    petGetCountService,
} from "./../services/pet.service";
import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { searchService } from "../services/search.service";
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
    const [petsDataBackup, setPetsDataBackup] = useState(pets);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const searchCategory = useFormCheck("microchip");
    const searchValue = useFormInput("");
    const [hasResult, setHasResult] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const petList = await petGetListService(activePage);
            if (!petList.error) {
                setPetsDataBackup(petList.data);
                setPets(petList.data);
            }

            const petCount = await petGetCountService();
            if (!petCount.error) setTotalPages(parseInt(petCount.data / 20));
        }
        fetchData();
    }, [dispatch, activePage]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchValue.value !== "") {
            async function fetchData() {
                setIsSearching(true);

                const searchReq = {
                    field: searchCategory.selected,
                    value: searchValue.value,
                };

                const searchResult = await searchService(searchReq);
                if (searchResult.error) {
                    setHasResult(false);
                } else {
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

        setPets(petsDataBackup);
        setHasResult(false);
    };

    const pagination = () => {
        async function handleNextPage(activePage) {
            if (!petList.error) setActivePage(activePage);
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
            <Popover id={pet.microchip}>
                <Popover.Title as="h3">Popover right</Popover.Title>
                <Popover.Content>
                    <img
                        src={pet.photoPath ? pet.photoPath : nophoto}
                        width="100%"
                        height="auto"
                        alt={pet.membership}
                    />
                </Popover.Content>
            </Popover>
        );
    };

    const Pet = (props) => (
        <tr style={{ height: "70px" }}>
            <td>
                <Link to={"/pets/edit/" + props.pet.microchip}>
                    {props.pet.microchip}
                </Link>
            </td>
            <td className="text-uppercase">{props.pet.membership}</td>
            <td className="text-capitalize">{props.pet.petName}</td>
            <td className="text-lowercase">{props.pet.email}</td>
            <td className="text-capitalize">{props.pet.ownerName}</td>
            <td>{props.pet.registered_at}</td>
            <td className="p-0">
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderPhotoPopover(props.pet)}
                >
                    <img
                        src={
                            props.pet.photoPath ? props.pet.photoPath : nophoto
                        }
                        width="70"
                        height="70"
                        alt={props.pet.membership}
                    />
                </OverlayTrigger>
            </td>
        </tr>
    );

    const petList = (pets) => {
        return pets.map(function (pet, index) {
            const replace_obj = {};

            return <Pet pet={{ ...pet, ...replace_obj }} key={index} />;
        });
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Registerd Pets</h1>

                <Row className="mt-4">
                    <Col>
                        <Form>
                            <Form.Group as={Row}>
                                <Col md="4" className="pl-0">
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
                                        <option value="petBreed">
                                            Pet Breed
                                        </option>
                                        <option value="implanted">
                                            Implanted Company
                                        </option>
                                    </Form.Control>
                                </Col>

                                <Col md="5" className="pl-0">
                                    <Form.Control
                                        type="text"
                                        {...searchValue}
                                    />
                                </Col>

                                <Col md="3" className="pl-0">
                                    <Button
                                        variant="outline-info"
                                        className="float-left"
                                        disabled={isSearching}
                                        onClick={handleSearch}
                                    >
                                        <FaSearch className="text-danger mx-1" />
                                    </Button>{" "}
                                    <Button
                                        variant="outline-danger"
                                        className="float-left"
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
                        {totalPages > 1 && !hasResult && pagination()}
                    </Col>
                </Row>

                <Row>
                    <Table responsive striped>
                        <thead className="bg-danger text-white">
                            <tr>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    Microchip
                                </th>
                                <th style={{ width: "11%", maxWidth: "11%" }}>
                                    Membership
                                </th>
                                <th style={{ width: "15%", maxWidth: "15%" }}>
                                    Pet Name
                                </th>
                                <th style={{ width: "21%", maxWidth: "21%" }}>
                                    Owner Email
                                </th>
                                <th style={{ width: "20%", maxWidth: "20%" }}>
                                    Owner Name
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    Registered At
                                </th>
                                <th style={{ width: "5%", maxWidth: "5%" }}>
                                    Photo
                                </th>
                            </tr>
                        </thead>

                        <tbody>{petList(pets)}</tbody>
                    </Table>
                </Row>
            </Container>
        </>
    );
}
