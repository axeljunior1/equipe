// FactureDetail.js
import React, {useState, useEffect} from 'react';
import {Card, Button} from 'react-bootstrap';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import apiCrudService from "../../services/ApiCrudService";

const FactureDetail = () => {
    const {id} = useParams();  // Récupère l'ID de la facture depuis l'URL
    const [facture, setFacture] = useState(null);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const fetchFactureById = async () => {
        setLoading(true);
        setError(null);
        try {
            let data = await apiCrudService.get(`factures/${id}`);
            setFacture(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchFactureById().then()
        // Remplacer cette URL par l'URL de votre API
    }, [id]);

    const handleEditClick = () => {
        navigate(`/factures/edit/${id}`);  // Redirection vers la page d'édition de la facture
    };

    if (!facture) return <div>Chargement...</div>;

    return (
        <div>
            <h2>Détails de la Facture </h2>
            <Card>
                <Card.Body>
                    <Card.Title>{facture.numeroFacture}</Card.Title>
                    <Card.Text>
                        <strong>Date :</strong> {new Date(facture.dateFacture).toLocaleDateString()} <br/>
                        <strong>Montant Total :</strong> {facture.montantTotal} € <br/>
                        <strong>Statut :</strong> {facture.statut} <br/>
                        <strong>Mode de Paiement :</strong> {facture.modePaiement} <br/>
                    </Card.Text>
                    <Button variant="secondary" onClick={handleEditClick}>
                        Modifier la Facture
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default FactureDetail;
