import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import moment from "moment";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";

import AdminCardSection2 from "./sections/AdminCardSection2";
import ChartSection1 from "./sections/ChartSection1";

const DashboardPage = () => {
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

    return (
        <Container>
            <h1 className="my-5 text-center">Welcome, {auth_obj.user.name}</h1>
            <AdminCardSection2 />
            <ChartSection1 />
        </Container>
    );
};

export default DashboardPage;
