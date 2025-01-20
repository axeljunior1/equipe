import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";

const Produits = () => {

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
        <div>
            <h1>Liste des Produits</h1>
            <ul>
                {produits.map((produit) => (
                    <li key={produit.id}>
                        <Link to={`/produits/${produit.id}`}>{produit.nom}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Produits;