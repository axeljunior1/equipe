import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import apiCrudService from "../../services/ApiCrudService";
import useCategory from "../../hooks/useCategory";

const CategorieCreer = () => {
    const [formData, setFormData] = useState({
        nom: '',
        description: ''

    });
    const navigate = useNavigate();
    const { loading, error, create} = useCategory();

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

        await create(formData)

        navigate(`/categories`);

    };

// Exemple d'affichage :





    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <div className="container mt-5">
            <h3>Créer une catégorie </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form className=" mt-3 mb-4" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Entrez le nom du produit" required
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

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Créer la catégorie'}
                </Button>
            </Form>


        </div>
    );
};

export default CategorieCreer;
