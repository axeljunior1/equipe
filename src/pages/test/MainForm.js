import React, {useState} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import SearchProduitPopup from "./SearchProduitPopup";
import InputGroup from "react-bootstrap/InputGroup"


const MainForm = () => {
    const [employId, setEmployId] = useState(""); // ID sélectionné
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal

    // Fonction pour gérer la sélection d'un employé
    const handleEmployeeSelect = (id) => {
        setEmployId(id); // Remplit le champ employId
        setShowModal(false); // Ferme le modal
    };
    const handleSearch = () => {
        const query = document.getElementById('search-input').value;
        // Appelle la fonction avec la valeur saisie
    };

    return (
        <div className="container mt-5">
            <h2>Formulaire Principal</h2>


            <Form>
                <Form.Group controlId="employId">
                    <Form.Label>Employé ID</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Recipient's username"
                            value={employId}
                        />
                        <Button onClick={() => {
                            setShowModal(true);
                        }
                        }>
                            <InputGroup.Text id="basic-addon2">🔍Search</InputGroup.Text>

                        </Button>
                    </InputGroup>
                </Form.Group>

                <Row className={"justify-content-start mt-5"}>

                    <Col xs={3}>

                        <Button variant="success" className="ml-2" type="submit">
                            Soumettre
                        </Button>
                    </Col>
                </Row>
            </Form>

            <br/>
            <br/>
            {/* Modal de recherche d'employé */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rechercher un Employé</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SearchProduitPopup onSelect={handleEmployeeSelect}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MainForm;
