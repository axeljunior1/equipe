import React from 'react';
import {Button, Col, FloatingLabel, Form, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import PropTypes from "prop-types";

const AchatAddLineForm = (props) => {
    return <Form onSubmit={props.onSubmit} className="mt-5">
        <Row>
            {/* Produit ID */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3} className=" ">

                <div className="position-relative">
                    <Form.Floating>
                        <Form.Control
                            type="number"
                            value={props.formAddLigne.produitId}
                            onChange={props.onChange}
                            name="produitId"
                            id="produitId"
                            className={`pe-5 ${props.formErrors.produitId ? "is-invalid" : ""}`}
                            placeholder="Produit ID"
                        />

                        {props.formErrors.produitId && (
                            <div className="invalid-feedback d-block">
                                {props.formErrors.produitId}
                            </div>
                        )}
                        <label htmlFor="produitId" className="fw-bold">
                            {props.formAddLigne.produitNom ? (
                                <span className="text-success">{props.formAddLigne.produitNom}</span>
                            ) : (
                                "Produit ID"
                            )}
                        </label>
                    </Form.Floating>
                    <Button
                        variant="outline-info"
                        size="sm"
                        onClick={props.onClick}
                        className="position-absolute top-50 end-0 translate-middle-y me-2"
                        style={{ zIndex: 2 }}
                    >
                        🔍
                    </Button>
                </div>



                {/*<Form.Floating className="mb-3">
                    <label className="fw-bold">
                        {props.formAddLigne.produitNom ? (
                            <span className="text-danger">{props.formAddLigne.produitNom}</span>
                        ) : (
                            "Produit ID"
                        )}
                    </label>
                    <InputGroup className="mb-1">

                    </InputGroup>
                    {props.formErrors.produitId && (
                        <div className="invalid-feedback d-block">
                            {props.formErrors.produitId}
                        </div>
                    )}
                </Form.Floating>*/}
            </Col>


            {/* Quantité */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>

                <Form.Floating className="mb-3">

                    <Form.Control
                        type="number"
                        value={props.formAddLigne.quantite}
                        onChange={props.onChange}
                        placeholder="Quantité"
                        name="quantite"
                        className={`my-1 ${props.formErrors.quantite ? "is-invalid" : ""}`}
                    />
                    {props.formErrors.quantite && (
                        <div className="invalid-feedback d-block">
                            {props.formErrors.quantite}
                        </div>
                    )}
                    <label htmlFor="quantite" className="fw-bold">Quantité </label>
                </Form.Floating>


            </Col>

            {/* Prix Achat */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                <FloatingLabel
                    controlId="prixAchat"
                    label="Prix Achat"
                    className="my-1 fw-bold"
                >
                    <Form.Control
                        type="number"
                        value={props.formAddLigne.prixAchat}
                        onChange={props.onChange}
                        placeholder="Prix unitaire d'achat"
                        name="prixAchat"
                        disabled
                    />
                </FloatingLabel>
            </Col>

            {/* Prix Achat Forcé */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                <FloatingLabel label="Prix Achat Forcé" controlId="" className="my-1 fw-bold">
                    <Form.Control
                        type="number"
                        value={props.formAddLigne.prixAchatF}
                        onChange={props.onChange}
                        placeholder="Forcer le prix d'achat"
                        name="prixAchatF"
                        className={`my-1 ${props.formErrors.prixAchatF ? "is-invalid" : ""}`}
                    />
                    {props.formErrors.prixAchatF && (
                        <div className="invalid-feedback d-block">
                            {props.formErrors.prixAchatF}
                        </div>
                    )}
                </FloatingLabel>
            </Col>
        </Row>

        {/* Bouton Ajouter */}
        <Row className="justify-content-end mt-3">
            <Col xs={12} sm={6} md={3}>
                <Button variant="outline-primary" type="submit" className="w-100">
                    Ajouter la ligne
                </Button>
            </Col>
        </Row>
    </Form>;
}

AchatAddLineForm.propTypes = {
    onSubmit: PropTypes.func,
    formAddLigne: PropTypes.shape({
        prixAchat: PropTypes.number,
        prixAchatF: PropTypes.string,
        quantite: PropTypes.number,
        achatId: PropTypes.string,
        produitId: PropTypes.number,
        produitNom: PropTypes.string
    }),
    onChange: PropTypes.func,
    formErrors: PropTypes.object,
    onClick: PropTypes.func
};

export default AchatAddLineForm;