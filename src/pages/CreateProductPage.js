import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import ProduitService from "../services/ProduitService";
import * as categories from "react-bootstrap/ElementChildren";
import CategorieService from "../services/CategorieService";

const CreateProductPage = () => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        image: '',
        quantity: 0,
        prixUnitaire: 0,
        categorieId: '',
        qrCode: [''],
        stockInitial: 0

    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            let data = await CategorieService.getCategories(0, 50);
            setCategories(data.content);  // Assuming 'content' is the array of products
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };

    // Fonction pour soumettre les données à l'API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        ProduitService.createProduit(formData).then(response => {
            navigate('/produits');

            console.log(response);
        }).catch(error => {
            setError(error);
        }).finally(() => setLoading(false));


    };

    function handleChangeSelect(e) {
        const { name, value } = e.target;
    }

    useEffect(() => {
        fetchCategories().then(response => response);
    },[])

    return (
        <div className="container mt-5">
            <h3>Créer un nouveau produit</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Entrez le nom du produit"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Entrez la description"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="URL de l'image"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Quantité</Form.Label>
                    <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Entrez la quantité"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prix Unitaire</Form.Label>
                    <Form.Control
                        type="number"
                        name="prixUnitaire"
                        value={formData.prixUnitaire}
                        onChange={handleChange}
                        placeholder="Entrez le prix unitaire"
                    />
                </Form.Group>

                <Form.Select aria-label="Default select example"
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

                <Form.Group className="mb-3">
                    <Form.Label>QR Code</Form.Label>
                    <Form.Control
                        type="text"
                        name="qrCode"
                        value={formData.qrCode[0]}
                        onChange={(e) => setFormData({ ...formData, qrCode: [e.target.value] })}
                        placeholder="QR Code"
                    />
                </Form.Group>

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
                    {loading ? 'Chargement...' : 'Créer le produit'}
                </Button>
            </Form>
        </div>
    );
};

export default CreateProductPage;
