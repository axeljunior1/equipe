// src/components/ProductEditForm.jsx

import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const ProductEditForm = ({ formData, categories, onChange, onSubmit, onCancel }) => {
    return (
        <form onSubmit={onSubmit}>
            {/* Nom */}
            <div className="mb-3">
                <label htmlFor="nom" className="form-label">Nom :</label>
                <input
                    type="text"
                    id="nom"
                    name="nom"
                    className="form-control"
                    value={formData.nom}
                    onChange={onChange}
                    placeholder="Entrez le nom"
                />
            </div>

            {/* Description */}
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description :</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Entrez la description"
                />
            </div>

            {/* Catégorie */}
            <div className="mb-3">
                <label htmlFor="categorieId" className="form-label">Catégorie :</label>
                <Form.Select
                    name="categorieId"
                    value={formData.categorieId}
                    onChange={onChange}
                >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>{item.nom}</option>
                    ))}
                </Form.Select>
            </div>

            {/* Stock Initial */}
            <div className="mb-3">
                <label htmlFor="stockInitial" className="form-label">Stock Initial :</label>
                <input
                    type="number"
                    id="stockInitial"
                    name="stockInitial"
                    className="form-control"
                    value={formData.stockInitial}
                    onChange={onChange}
                    placeholder="Entrez le stock initial"
                />
            </div>

            {/* Prix Vente */}
            <div className="mb-3">
                <label htmlFor="prixVente" className="form-label">Prix Unitaire :</label>
                <input
                    type="number"
                    id="prixVente"
                    name="prixVente"
                    className="form-control"
                    value={formData.prixVente}
                    onChange={onChange}
                    placeholder="Entrez le prix de vente"
                />
            </div>

            {/* Prix Achat */}
            <div className="mb-3">
                <label htmlFor="prixAchat" className="form-label">Prix Achat :</label>
                <input
                    type="number"
                    id="prixAchat"
                    name="prixAchat"
                    className="form-control"
                    value={formData.prixAchat}
                    onChange={onChange}
                    placeholder="Entrez le prix d'achat"
                />
            </div>

            {/* Boutons */}
            <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Annuler</button>
            </div>
        </form>
    );
};

ProductEditForm.propTypes = {
    formData: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ProductEditForm;
