import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container>
                <Row className="text-center">
                    <Col>
                        <p className="mb-0">© {new Date().getFullYear()} StockPOS | Tous droits réservés</p>
                    </Col>
                    <Col>
                        <p className="mb-0">
                            <a href="/support" className="text-light">Support</a> |
                            <a href="/contact" className="text-light"> Contact</a>
                        </p>
                    </Col>
                    <Col>
                        <p className="mb-0">Version 1.0.0</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
