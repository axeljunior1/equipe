import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ProduitService from "../services/ProduitService";
import {usePanier} from "../context/PanierContext";
import ProduitDetailComp from "../components/ProduitDetailComp";
import AlertComp from "../components/AlertComp";
import ErrorAlert from "../exceptions/ErrorAlert";
import apiCrudService from "../services/ApiCrudService";

const ProduitDetail = (props) => {
    const {id:rlt} = useParams(); // Récupère l'ID depuis l'URL*
    const id = rlt??props.id // id de l'url ou id dans props, ils'agit ici de l'id du produit
    const {panier, ajouterAuPanier, dejaPresent, nombreDansPanier} = usePanier();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    let initialFormDetailProduit = {
        nom : "",
        prixUnitaire : 0,
        description : "",
        categorieNom : "",
        categorieId : 0,
        stockInitial : 0,
        qrCode : ""
    };


    const [produit, setProduit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState(initialFormDetailProduit); // État pour stocker les modifications
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async () => {
        console.log(panier)
        setLoading(true);
        try {
            const data = await apiCrudService.getById('produits', id)
            // console.log(data)
            setProduit(data);
            setFormData(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

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
        fetchProduit().then(r => r)// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!produit) {
        return <h1>Produit introuvable</h1>;
    }

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };



    function handeIsEditing() {
        setIsEditing(true);
    }

    const handleStockProduit = (id) =>{
        navigate(`/mouvements-stock/produit/${id}`);
    }
    if(error){
       return <ErrorAlert error={error} />
    }

    return (

        <div className="">
            {showAlertCreation && (
                <AlertComp
                    message="Opération réussie le produit a été crée !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertCreation(false)}
                />
            )}

            <h1><strong>Détail du Produit</strong></h1>

            {!isEditing ? (

                <ProduitDetailComp id ={id} isEditing={handeIsEditing}  handleStockProduit = {handleStockProduit} />
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
                                value={formData.categorieNom}
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
