// FactureEdit.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import {useParams, useHistory, useNavigate} from 'react-router-dom';
import apiCrudService from "../../services/ApiCrudService";

const FactureEdit = () => {
    const { id } = useParams();  // Récupère l'ID de la facture depuis l'URL
    const [facture, setFacture] = useState({
        numeroFacture: '',
        dateFacture: '',
        montantTotal: '',
        statut: '',
        modePaiement: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const fetchFactureById = async () => {
        setLoading(true);
        setError(null);
        try {
            let data = await apiCrudService.get(`/factures/${id}`);
            setFacture(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        fetchFactureById().then()

    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacture({ ...facture, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        try {
            await apiCrudService.put(`/factures/${id}`);

            navigate(`/factures/${id}`);  // Redirection vers la page de détail après modification

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <h2>Modifier la Facture</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="numeroFacture">
                    <Form.Label>Numéro de Facture</Form.Label>
                    <Form.Control
                        type="text"
                        name="numeroFacture"
                        value={facture.numeroFacture}
                        onChange={handleChange}
                        disabled
                    />
                </Form.Group>

                <Form.Group controlId="dateFacture">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="dateFacture"
                        value={facture.dateFacture.substring(0, 10)}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="montantTotal">
                    <Form.Label>Montant Total</Form.Label>
                    <Form.Control
                        type="number"
                        name="montantTotal"
                        value={facture.montantTotal}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="statut">
                    <Form.Label>Statut</Form.Label>
                    <Form.Control
                        as="select"
                        name="statut"
                        value={facture.statut}
                        onChange={handleChange}
                    >
                        <option>En attente</option>
                        <option>Payée</option>
                        <option>Annulée</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="modePaiement">
                    <Form.Label>Mode de Paiement</Form.Label>
                    <Form.Control
                        type="text"
                        name="modePaiement"
                        value={facture.modePaiement}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Sauvegarder
                </Button>
            </Form>
        </div>
    );
};

export default FactureEdit;
