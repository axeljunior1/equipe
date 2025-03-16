import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ProduitService from "../../services/ProduitService";
import AlertComp from "../../components/AlertComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import apiCrudService from "../../services/ApiCrudService";
import {Form} from "react-bootstrap";
import {updateObject} from "../../utils/objectMapping";

const ProduitDetailEditer = (props) => {
    const id = useParams().id ?? props.id; // id de l'url ou id dans props, ils'agit ici de l'id du produit


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    let initialFormDetailProduit = {
        nom: "",
        description: "",
        prixUnitaire: 0,
        categorieId: 0,
        stockInitial: 0,
        prixVente: 0
    };


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(initialFormDetailProduit); // État pour stocker les modifications
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);
    const [categories, setCategories] = useState([]);
    const [produit, setProduit] = useState({});

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.getById('produits', id)
            // console.log(data)
            setProduit(data)
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

            await ProduitService.updateProduit(id, formData);

            // si tout est ok, on navigue
            navigate(`/produits/${id}`);

        } catch (error) {
            setLoading(false);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null)
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
        fetchProduit().then();

    }, [id])


    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!produit) {
        return <h1>Produit introuvable</h1>;
    }


    if (error) {
        return <ErrorAlert error={error}/>
    }

    const handleSubmitForm = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        updateProduit().then(); // Appelle la fonction de mise à jour

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

            <div className="card p-4 shadow bg-light">
                <h3 className="text-center mb-4">Modifier le produit</h3>
                <form
                    onSubmit={handleSubmitForm}
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
                        <label htmlFor="prixVente" className="form-label">Prix Unitaire :</label>
                        <input
                            type="number"
                            id="prixVente"
                            name="prixVente"
                            className="form-control"
                            value={formData.prixVente}
                            onChange={handleChange}
                            placeholder="Entrez le prix unitaire de vente"
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
                            onClick={() => navigate(`/produits/${id}`)}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>

        </div>


    );
};

export default ProduitDetailEditer;
