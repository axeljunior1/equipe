import React, { useState, useEffect } from 'react';
import productService from '../services/ProduitService'; // Importer le service

const ProductsList = () => {
    const [products, setProducts] = useState([]); // État pour stocker les produits
    const [loading, setLoading] = useState(true); // État pour indiquer le chargement
    const [error, setError] = useState(null); // État pour gérer les erreurs


    // Fonction pour charger les produits
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getAll(); // Utiliser le service pour récupérer les produits
            setProducts(data);
            console.log(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Charger les produits au montage du composant
    useEffect(() => {
        loadProducts();
    }, []);

    // Affichage pendant le chargement
    if (loading) {
        return <p>Chargement des produits...</p>;
    }

    // Affichage en cas d'erreur
    if (error) {
        return <p style={{ color: 'red' }}>Erreur : {error}</p>;
    }

    // Affichage de la liste des produits
    return (
        <div>
            <h2>Liste des produits</h2>
            {products.length === 0 ? (
                <p>Aucun produit disponible.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {products.map((product) => (
                        <li
                            key={product.id} // Assurez-vous que chaque produit possède un ID unique
                            style={{
                                marginBottom: '15px',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                            }}
                        >
                            <h3>{product.nom}</h3>
                            <p>Prix : {product.prixUnitaire} €</p>
                            <p>Description : {product.description}</p>
                            <p>Catégorie : {product.categorie}</p>
                            <p>Stock initial : {product.stockInitial}</p>
                            {product.qrCode && (
                                <div>
                                    <p>QR Code :</p>
                                    <img
                                        src={`data:image/png;base64,${product.qrCode}`}
                                        alt="QR Code"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductsList;
