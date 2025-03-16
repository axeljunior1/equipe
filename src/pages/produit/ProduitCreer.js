import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import CategorieService from "../../services/CategorieService";
import apiCrudService from "../../services/ApiCrudService";
import BarcodeScanner from "../../components/BarcodeReader";

const ProduitCreer = () => {
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

    // Gestion des modifications du ean
    const handleChangeEan13 = (value) => {

            setFormData((pData) => {
                return {
                    ...pData,
                    ean13: value
                }
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
        try {
            let response = await apiCrudService.post('produits',formData);
            debugger;
            navigate(`/produits/${response.id}?showAlertCreation=true`);

        }catch (error) {
            setError(error);
        }finally {
            setLoading(false);
        }


    };

    useEffect(() => {
        fetchCategories().then(response => response);
    },[])

    // if (error) return <ErrorAlert error={error} />;
    return (
        <div className="container mt-5">
            <h3>Créer un nouveau produit</h3>
            {error && <div className="alert alert-danger">{error.message}</div>}
            <Form className="mb-4" onSubmit={handleSubmit}>
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
                    <Form.Label>Ean13</Form.Label>
                    <Form.Control
                        type="text"
                        name="ean13"
                        value={formData.ean13}
                        onChange={handleChange}
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
                        placeholder="Entrez le prix Vente"
                    />
                </Form.Group>

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


            <BarcodeScanner width="100" onScan={handleChangeEan13}   />
        </div>
    );
};

export default ProduitCreer;
