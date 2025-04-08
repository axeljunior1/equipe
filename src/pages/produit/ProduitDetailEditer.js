import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AlertComp from "../../components/AlertComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import {Form} from "react-bootstrap";
import useProduct from "../../hooks/useProduct";
import useCategory from "../../hooks/useCategory";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";
import PropTypes from "prop-types";

const ProduitDetailEditer = (props) => {
    const id = useParams().id ?? props.id; // id de l'url ou id dans props, ils'agit ici de l'id du produit

    ProduitDetailEditer.propTypes = {
        id: PropTypes.string,
    };

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
        prixVente: 0,
        prixAchat: 0
    };


    const [formData, setFormData] = useState(initialFormDetailProduit); // État pour stocker les modifications
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);
    const {
        produits: produit,
        loading: loadingPro,
        error: errorPro,
        fetchById,
        update,
    } = useProduct();
    const {
        categories,
        loading: loadingCat,
        error: errorCat,
        fetchCategories,
    } = useCategory();


    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async (ide = id) => {
        fetchById(ide)
    };





    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    useEffect(() => {
        fetchCategories(0, DEFAULT_PAGINATION_SIZE).then();

    }, [])

    useEffect(() => {
        setFormData(produit);
    }, [produit])


    useEffect(() => {
        fetchProduit().then();

    }, [id])


    if (loadingPro) {
        return <h1>Chargement en cours...</h1>;
    }

    if (loadingCat) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!produit) {
        return <h1>Produit introuvable</h1>;
    }


    if (errorPro) {
        return <ErrorAlert error={errorPro}/>
    }

    if (errorCat) {
        return <ErrorAlert error={errorCat}/>
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        await update(id, formData); // Appelle la fonction de mise à jour

        navigate(`/produits/${id}`);

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

                    {/* Date de Création */}
                    <div className="mb-3">
                        <label htmlFor="prixVente" className="form-label">Prix Unitaire Achat :</label>
                        <input
                            type="number"
                            id="prixAchat"
                            name="prixAchat"
                            className="form-control"
                            value={formData.prixAchat}
                            onChange={handleChange}
                            placeholder="Entrez le prix unitaire d'achat"
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
