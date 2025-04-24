import React from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import PropTypes from "prop-types";

const AchatAddLineForm =(props)=> {
    return <Form onSubmit={props.onSubmit} className="mt-5">
        <Row>
            {/* Produit ID */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                        {props.formAddLigne.produitNom ? (
                            <span className="text-danger">{props.formAddLigne.produitNom}</span>
                        ) : (
                            "Produit ID"
                        )}
                    </Form.Label>
                    <InputGroup className="mb-1">
                        <Form.Control
                            type="number"
                            value={props.formAddLigne.produitId}
                            onChange={props.onChange}
                            name="produitId"
                            className={`my-1 ${props.formErrors.produitId ? "is-invalid" : ""}`}
                        />
                        <Button variant="outline-info" onClick={props.onClick}>
                            🔍Search
                        </Button>
                    </InputGroup>
                    {props.formErrors.produitId && (
                        <div className="invalid-feedback d-block">
                            {props.formErrors.produitId}
                        </div>
                    )}
                </Form.Group>
            </Col>

            {/* Nom */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                <Form.Label className="fw-bold">Nom</Form.Label>
                <Form.Control
                    type="text"
                    value={props.formAddLigne.produitNom}
                    onChange={props.onChange}
                    placeholder="Nom du produit"
                    name="produitNom"
                    readOnly
                    className="my-1"
                />
            </Col>

            {/* Quantité */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                <Form.Label className="fw-bold">Quantité</Form.Label>
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
            </Col>

            {/* Prix Achat */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                <Form.Label className="fw-bold">Prix Achat</Form.Label>
                <Form.Control
                    type="number"
                    value={props.formAddLigne.prixAchat}
                    onChange={props.onChange}
                    placeholder="Prix unitaire d'achat"
                    name="prixAchat"
                    className="my-1"
                    disabled
                />
            </Col>

            {/* Prix Achat Forcé */}
            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                <Form.Label className="fw-bold">Prix Achat Forcé</Form.Label>
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