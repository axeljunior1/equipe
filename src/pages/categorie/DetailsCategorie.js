import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CategorieDetailComp from "../../components/CategoriesDetailComp";
import useCategory from "../../hooks/useCategory";


const CategorieDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL


    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les modifications
    const {
        categories : categorie, loading, error,  fetchById, update
        } = useCategory()

    // Fonction pour récupérer les données d'un categorie
    const fetchCategorie = async () => {
           await fetchById(id)
    };

    // Fonction pour mettre à jour un categorie (PATCH)
    const updateCategorie =  () => {

            update(id, formData)
    };

    useEffect(() => {

        setFormData(categorie);
        setIsEditing(false);
    }, [categorie])


    useEffect(() => {
        fetchCategorie().then()// Appel de la fonction asynchrone
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



    function handeIsEditing() {
        console.log('isEditing')
        setIsEditing(true);
    }

    return (

        <div className="">

            <h1><strong>Détails du Categorie</strong></h1>

            {!isEditing ? (

                <CategorieDetailComp categories ={categorie} isEditing={handeIsEditing}  />
                
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
