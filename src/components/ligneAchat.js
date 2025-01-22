import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Table from "react-bootstrap/Table";
import ProduitService from "../services/produitService";

const LigneAchat = ({LignesAchat}) => {




    const [ligneAchat, setLigneAchat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les modifications


    // Fonction pour récupérer les données d'un produit
    const fetchLigneAchat = async () => {
        ProduitService.getProduitsById(LignesAchat.id).then(data => {
            setLigneAchat(data);
            setFormData(data);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };



    useEffect(() => {
        fetchLigneAchat(); // Récupère les données lors du chargement du composant
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    if (!ligneAchat) {
        return <h1>Produit introuvable</h1>;
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Qte</th>
                    <th>prix Unitaire</th>
                </tr>
                </thead>
                <tbody>
                {ligneAchat.map((produit, index) => (
                    <tr key={produit.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/produits/${produit.id}`} className='text-decoration-none'>{produit.nom}</Link>
                        </td>
                        <td>{produit.description}</td>
                        <td>{produit.stockInitial}</td>
                        <td>{produit.prixUnitaire}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default LigneAchat;