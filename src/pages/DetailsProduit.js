import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ProduitService from "../services/produitService";

const ProduitDetail = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL

    const [produit, setProduit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les modifications

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = useCallback( async () => {
        try {
            const data = await ProduitService.getProduitsById(id).then();
            setProduit(data);
            setFormData(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Fonction pour mettre à jour un produit (PATCH)
    const updateProduit = async () => {

        ProduitService.updateProduit(id, formData).then(data => {
            setProduit(data);
            setFormData(data);
            setIsEditing(false);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };


    useEffect(() => {
       fetchProduit()// Appel de la fonction asynchrone
    }, [fetchProduit]);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    if (!produit) {
        return <h1>Produit introuvable</h1>;
    }

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (

        <div className="container mt-5">
            {!isEditing ? (
                <div className="card p-4 shadow">
                    <h3 className="card-title text-center">{produit.nom}</h3>
                    <div className="card-body">
                        <p><strong>Prix :</strong> {produit.prixUnitaire} €</p>
                        <p><strong>Description :</strong> {produit.description}</p>
                        <p><strong>Catégorie :</strong> {produit.categorie}</p>
                        <p><strong>Stock initial :</strong> {produit.stockInitial}</p>
                        {produit.qrCode && (
                            <div>
                                <p><strong>QR Code :</strong></p>
                                <img
                                    src={`data:image/png;base64,${produit.qrCode}`}
                                    alt="QR Code"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier le produit</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            updateProduit(); // Appelle la fonction de mise à jour
                        }}
                    >
                        {/* Nom */}
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">Nom :</label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                className="form-control"
                                value={formData.nom}
                                onChange={handleChange}
                                placeholder="Entrez le nom"
                            />
                        </div>

                        {/* Prénom */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description :</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Entrez la description"
                            />
                        </div>
                        {/* Prénom */}
                        <div className="mb-3">
                            <label htmlFor="categorie" className="form-label">Catègorie :</label>
                            <input
                                type="text"
                                id="categorie"
                                name="categorie"
                                className="form-control"
                                value={formData.categorie}
                                onChange={handleChange}
                                placeholder="Entrez la description"
                            />
                        </div>

                        {/* Date de Création */}
                        <div className="mb-3">
                            <label htmlFor="stockInitial" className="form-label">Stock Initial :</label>
                            <input
                                type="number"
                                id="stockInitial"
                                name="stockInitial"
                                className="form-control"
                                value={formData.stockInitial}
                                onChange={handleChange}
                                placeholder="Entrez la date de création"
                            />
                        </div>

                        {/* Boutons */}
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success">
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>


    );
};

export default ProduitDetail;
