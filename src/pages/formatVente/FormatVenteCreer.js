import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import apiCrudService from "../../services/ApiCrudService";
import useCategory from "../../hooks/useCategory";
import useProduct from "../../hooks/useProduct";

const FormatVenteCreer = () => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        image: '',
        quantity: 0,
        prixUnitaire: 0,
        categorieId: '',
        ean13: '',
        stockInitial: 0

    });
    const navigate = useNavigate();
    const { loading, error, create} = useProduct();
    const {categories, fetchCategories, loading: loadingCat, error: errorCat} = useCategory();

    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Fonction pour soumettre les données à l'API
    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await create(formData);


        if (res.success) {
            navigate(`/formatVentes/${res.data.id}`);
        }

    };


    const handleKeydown = (e) =>{
        if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    useEffect(() => {
        fetchCategories();
    },[])

    if (loadingCat || loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mt-5">
            <h3>Créer un nouveau formatVente</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {errorCat && <div className="alert alert-danger">{errorCat}</div>}
            <Form className=" mt-3 mb-4" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Entrez le nom du formatVente" required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Entrez la description" required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Ean13</Form.Label>
                    <Form.Control
                        type="text"
                        name="ean13"
                        value={formData.ean13}
                        onChange={handleChange}
                        onKeyDown={handleKeydown}
                        placeholder="Ean13"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prix Vente</Form.Label>
                    <Form.Control
                        type="number"
                        name="prixVente"
                        value={formData.prixVente}
                        onChange={handleChange}
                        placeholder="Entrez le prix Vente" required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prix Achat</Form.Label>
                    <Form.Control
                        type="number"
                        name="prixAchat"
                        value={formData.prixAchat}
                        onChange={handleChange}
                        maxLength={13}
                        minLength={13}
                        placeholder="Entrez le prix Achat" required
                    />
                </Form.Group>

                <Form.Select className="mb-3"
                             name="categorieId"
                             value={formData.categorieId} required
                             onChange={handleChange}
                             placeholder="Entrez la catégorie">
                    <option value="" disabled hidden>Entrez la catégorie</option>
                    <>
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>{item.nom}</option>
                    ))}</>
                </Form.Select>

                <Form.Group className="mb-3">
                    <Form.Label>Stock Initial</Form.Label>
                    <Form.Control
                        type="number"
                        name="stockInitial"
                        value={formData.stockInitial}
                        onChange={handleChange}
                        placeholder="Entrez le stock initial"
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Créer le formatVente'}
                </Button>
            </Form>


        </div>
    );
};

export default FormatVenteCreer;
