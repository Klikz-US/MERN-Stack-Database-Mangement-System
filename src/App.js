import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

import "./assets/css/App.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import STLRouter from "./routes/router";
import { verifyTokenAsync } from "./actions/auth-async.action";
import { Row } from "react-bootstrap";

export default function App() {
    const auth_obj = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const { authLoading } = auth_obj;

    useEffect(() => {
        dispatch(verifyTokenAsync());
    }, [dispatch]);

    if (authLoading) {
        return (
            <Row className="vh-100">
                <ClipLoader
                    css="margin: auto;"
                    size={100}
                    color={"#ff0000"}
                    loading={authLoading}
                />
            </Row>
        );
    }
    return <STLRouter />;
}
