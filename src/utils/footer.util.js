import React from "react";

import { Container, Row, Col } from "react-bootstrap";

import logo from "./../assets/logo.png";

export default function Navigation() {
    return (
        <footer className="mt-auto pt-5">
            <div className=" pt-4 pb-4 bg-light shadow-lg">
                <Container>
                    <Row>
                        <Col className="text-center">
                            <img
                                src={logo}
                                width="60%"
                                height="auto"
                                alt="STL Portal"
                            />
                        </Col>

                        <Col className="border border-dark border-top-0 border-bottom-0 pb-2 mb-4">
                            <h5 className="text-dark px-2 py-0">Quick Links</h5>
                            <a
                                rel="noopener noreferrer"
                                className="text-info px-2 py-1 d-block"
                                href="https://shop.savethislife.com"
                                target="_blank"
                            >
                                Save This Life Shopify
                            </a>
                            <a
                                rel="noopener noreferrer"
                                className="text-danger px-2 py-1 d-block"
                                href="https://shop.savethislife.com"
                                target="_blank"
                            >
                                Asana Dashboard
                            </a>
                            <a
                                rel="noopener noreferrer"
                                className="text-alert px-2 py-1 d-block"
                                href="https://shop.savethislife.com"
                                target="_blank"
                            >
                                TalkDesk
                            </a>
                            <a
                                rel="noopener noreferrer"
                                className="text-success px-2 py-1 d-block"
                                href="https://shop.savethislife.com"
                                target="_blank"
                            >
                                CSR Portal
                            </a>
                            <a
                                rel="noopener noreferrer"
                                className="text-primary px-2 py-1 d-block"
                                href="https://shop.savethislife.com"
                                target="_blank"
                            >
                                Resources
                            </a>
                        </Col>

                        <Col>
                            <h5 className="text-dark p-2">Live Updates</h5>
                        </Col>
                    </Row>

                    <p className="text-center text-dark m-0">
                        © 2020 Save This Life Inc. All rights reserved.
                    </p>
                    <p className="text-center text-dark m-0">
                        Save This Life and Save This Life logo are registered
                        trademarks of Save This Life, Inc.
                    </p>
                </Container>
            </div>
        </footer>
    );
}
