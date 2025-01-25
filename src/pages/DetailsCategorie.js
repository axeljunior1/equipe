import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CategorieService from "../services/CategorieService";
import categorieService from "../services/CategorieService";
import {usePanier} from "../context/PanierContext";
import * as PropTypes from "prop-types";
import CategorieDetailComp from "../components/CategoriesDetailComp";



const CategorieDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const {panier, ajouterAuPanier} = usePanier();


    const [categorie, setCategorie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les modifications

    // Fonction pour récupérer les données d'un categorie
    const fetchCategorie = useCallback(async () => {
        console.log(panier)
        setLoading(true);
        try {
            const data = await categorieService.getCategoriesById(id)
            // console.log(data)
            setCategorie(data);
            setFormData(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Fonction pour mettre à jour un categorie (PATCH)
    const updateCategorie = async () => {
        setLoading(true);
        setError(null);
        try {
            let data = await CategorieService.updateCategorie(id, formData)
            setCategorie(data);
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
        fetchCategorie()// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        console.log('error545');
        return <h1> Une erruer {error}</h1>;
    }

    if (!categorie) {
        return <h1>Categorie introuvable</h1>;
    }

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleAjouterAuPanier = (categorie) => {
        // console.log(categorie)
        ajouterAuPanier({...categorie, quantite: 1});
    };

    function handeIsEditing() {
        console.log('isEditing')
        setIsEditing(true);
    }

    return (

        <div className="">

            <h1><strong>Details du Categorie</strong></h1>

            {!isEditing ? (

                <CategorieDetailComp id ={id} isEditing={handeIsEditing}  />
                
            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier le categorie</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            updateCategorie(); // Appelle la fonction de mise à jour
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

export default CategorieDetail;
