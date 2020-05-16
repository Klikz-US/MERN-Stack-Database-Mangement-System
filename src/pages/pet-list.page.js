import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col } from "react-bootstrap";

import {
    petGetListService,
    petGetCountService,
} from "./../services/pet.service";
import {
    verifyTokenAsync,
    userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
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

    useEffect(() => {
        async function fetchData() {
            const petList = await petGetListService(activePage);
            if (petList.error) {
                dispatch(userLogoutAsync());
            } else {
                setPets(petList.data);
            }

            const petCount = await petGetCountService();
            if (petCount.error) {
                dispatch(userLogoutAsync());
            } else {
                setTotalPages(parseInt(petCount.data / 20));
            }
        }
        fetchData();
    }, [dispatch, activePage]);

    const pagination = () => {
        async function handleNextPage(activePage) {
            if (petList.error) {
                dispatch(userLogoutAsync());
            } else {
                setActivePage(activePage);
            }
        }

        return (
            <Pagination
                totalPages={totalPages}
                currentPage={activePage}
                onChange={handleNextPage}
            />
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
            <td
                className="p-0"
                style={{
                    backgroundPosition: "center",
                    backgroundImage: `url(${nophoto})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div
                    style={{
                        backgroundImage: `url(${props.pet.photoPath})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        padding: "50%",
                    }}
                ></div>
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

                <Row className="mt-4">
                    {totalPages > 1 && <Col>{pagination()}</Col>}
                </Row>
            </Container>
        </>
    );
}
