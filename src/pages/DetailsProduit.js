import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ProduitService from "../services/produitService";
import produitService from "../services/produitService";
import {usePanier} from "../context/PanierContext";
import ProduitDetailComp from "../components/ProduitDetailComp";

const ProduitDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const {panier, ajouterAuPanier} = usePanier();


    const [produit, setProduit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les modifications

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = useCallback(async () => {
        console.log(panier)
        setLoading(true);
        try {
            const data = await produitService.getProduitsById(id)
            // console.log(data)
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
        setLoading(true);
        setError(null);
        try {
            let data = await ProduitService.updateProduit(id, formData)
            setProduit(data);
            setFormData(data);
            setIsEditing(false);
            console.log(data)
        } catch (error) {
            setLoading(false);
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProduit()// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        console.log('error545');
        return <h1> Une erruer {error}</h1>;
    }

    if (!produit) {
        return <h1>Produit introuvable</h1>;
    }

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleAjouterAuPanier = (produit) => {
        // console.log(produit)
        ajouterAuPanier({...produit, quantite: 1});
    };

    function handeIsEditing() {
        console.log('isEditing')
        setIsEditing(true);
    }

    return (

        <div className="">

            <h1><strong>Details du Produit</strong></h1>

            {!isEditing ? (

                <ProduitDetailComp id ={id} isEditing={handeIsEditing}  />
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
                                type="text"
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
