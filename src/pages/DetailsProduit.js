import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ProduitService from "../services/ProduitService";
import {usePanier} from "../context/PanierContext";
import ProduitDetailComp from "../components/ProduitDetailComp";
import AlertComp from "../components/AlertComp";
import ErrorAlert from "../exceptions/ErrorAlert";
import apiCrudService from "../services/ApiCrudService";
import {updateObject} from "../utils/objectMapping";
import {Form} from "react-bootstrap";
import {useJwt} from "../context/JwtContext";

const ProduitDetail = (props) => {
    const {id: rlt} = useParams(); // Récupère l'ID depuis l'URL*
    const id = rlt ?? props.id // id de l'url ou id dans props, ils'agit ici de l'id du produit
    const {
        panier,
        ajouterAuPanier,
        retirerDuPanier,
        calculerTotal,
        refreshPanier,
        nombreProduitDansPanier,
        presentDansPanier,
        updatePanier} = usePanier();


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");
    // const [nbrePanier, setNbrePanier] = useState(0);
    const {panierId} = useJwt()

    let initialFormDetailProduit = {
        nom: "",
        description: "",
        prixUnitaire: 0,
        categorieId: 0,
        stockInitial: 0,
    };


    const [produit, setProduit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState(initialFormDetailProduit); // État pour stocker les modifications
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);
    const [categories, setCategories] = useState([]);

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.getById('produits', id)
            // console.log(data)
            setProduit(data);
            // Important pour ne retourner que les champs utiles pour la mise a jour
            setFormData((prev) => {
                let copie = {...prev};
                updateObject(copie, data);
                return copie;
            });
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
            // Important pour ne retourner que les champs utiles pour la mise a jour
            setFormData((prev) => {
                let copie = {...prev};
                updateObject(copie, data);
                return copie;
            });
            setIsEditing(false);
        } catch (error) {
            setLoading(false);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            let data = await apiCrudService.get("categories", 0, 50);
            setCategories(data.content);  // Assuming 'content' is the array of products
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    useEffect(() => {
        fetchCategories().then(response => response);

    }, [])

    useEffect(() => {
        fetchProduit().then(r => r)// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!produit) {
        return <h1>Produit introuvable</h1>;
    }




    function handeIsEditing() {
        setIsEditing(true);
    }

    const handleStockProduit = (id) => {
        navigate(`/mouvements-stock/produit/${id}`);
    }
    if (error) {
        return <ErrorAlert error={error}/>
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

                <ProduitDetailComp id={id} isEditing={handeIsEditing} handleStockProduit={handleStockProduit}
                                   nbrePanier={nombreProduitDansPanier}  panier={panier}/>

            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier le produit</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            updateProduit().then(); // Appelle la fonction de mise à jour
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
                            <Form.Select className="mb-3"
                                         name="categorieId"
                                         value={formData.categorieId}
                                         onChange={handleChange}
                                         placeholder="Entrez la catégorie">
                                <option>Catégorie</option>
                                <>
                                    {categories.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nom}</option>
                                    ))}</>
                            </Form.Select>
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
                                placeholder="Entrez le stock initial"
                            />
                        </div>

                        {/* Date de Création */}
                        <div className="mb-3">
                            <label htmlFor="prixUnitaire" className="form-label">Prix Unitaire :</label>
                            <input
                                type="number"
                                id="prixUnitaire"
                                name="prixUnitaire"
                                className="form-control"
                                value={formData.prixUnitaire}
                                onChange={handleChange}
                                placeholder="Entrez le prix unitaire"
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
