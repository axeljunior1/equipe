import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AlertComp from "../../components/AlertComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import useProduct from "../../hooks/useProduct";
import useCategory from "../../hooks/useCategory";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";
import PropTypes from "prop-types";
import ProductEditForm from "./ProductEditForm";

const ProduitDetailEditer = (props) => {
    const id = useParams().id ?? props.id;
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    const initialFormDetailProduit = {
        nom: "",
        description: "",
        prixUnitaire: 0,
        categorieId: 0,
        stockInitial: 0,
        prixVente: 0,
        prixAchat: 0
    };

    const [formData, setFormData] = useState(initialFormDetailProduit);
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

    useEffect(() => {
        fetchCategories(0, DEFAULT_PAGINATION_SIZE);
        fetchById(id);
    }, [id]);

    useEffect(() => {
        if (produit) {
            setFormData(produit);
        }
    }, [produit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        await update(id, formData);
        navigate(`/produits/${id}`);
    };

    const handleCancel = () => {
        navigate(`/produits/${id}`);
    };

    if (loadingPro || loadingCat) return <h1>Chargement en cours...</h1>;
    if (errorPro) return <ErrorAlert error={errorPro} />;
    if (errorCat) return <ErrorAlert error={errorCat} />;
    if (!produit) return <h1>Produit introuvable</h1>;

    return (
        <div>
            {showAlertCreation && (
                <AlertComp
                    message="Opération réussie le produit a été créé !"
                    type="success"
                    timeout={9500}
                    onClose={() => setShowAlertCreation(false)}
                />
            )}

            <h1><strong>Détail du Produit</strong></h1>

            <div className="card p-4 shadow bg-light">
                <h3 className="text-center mb-4">Modifier le produit</h3>
                <ProductEditForm
                    formData={formData}
                    categories={categories}
                    onChange={handleChange}
                    onSubmit={handleSubmitForm}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};

ProduitDetailEditer.propTypes = {
    id: PropTypes.string,
};

export default ProduitDetailEditer;
