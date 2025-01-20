import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import axios from "axios";
import {Link} from "react-router-dom";

const ListProduit = () => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les produits depuis l'API
    const fetchProduits = async () => {
        try {
            const response = await axios.get("http://localhost:8089/produit"); // Exemple d'API
            setProduits(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (err) {
            setError("Une erreur est survenue lors du chargement des produits");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduits();
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th></th>
                <th>Nom</th>
                <th>Description</th>
                <th>Stock initial</th>
                <th>prix Unitaire</th>
            </tr>
            </thead>
            <tbody>
            {produits.map((produit, index) => (
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
    );
};

export default ListProduit;