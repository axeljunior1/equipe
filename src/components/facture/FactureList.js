// FactureList.js
import React, {useEffect, useState} from 'react';
import {Button, Table} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import apiCrudService from "../../services/ApiCrudService";

const FactureList = () => {
    const [factures, setFactures] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const fetchFactures = async () => {
        setLoading(true);
        setError(null);
        try {
            let data  = await apiCrudService.get('factures');
            setFactures(data.content);
        }catch(err) {
            setError(err);
        }finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        // Remplacer cette URL par l'URL de votre API

        fetchFactures();

    }, []);


    return (
        <div>

            {error &&
            <div className="alert alert-danger">{error.message} </div>
            }

            <h2>Liste des Factures</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Numéro de Facture</th>
                    <th>Date</th>
                    <th>Montant Total</th>
                    <th>Statut</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {factures.map(facture => (
                    <tr key={facture.idFacture}>
                        <td>{facture.numeroFacture}</td>
                        <td>{new Date(facture.dateFacture).toLocaleDateString()}</td>
                        <td>{facture.montantTotal} €</td>
                        <td>{facture.statut}</td>
                        <td>
                            <Link className="primary"  to={`factures/${facture.idFacture}`}>
                                Voir Détails
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default FactureList;
