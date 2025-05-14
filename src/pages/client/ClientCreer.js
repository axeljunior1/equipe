import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import apiCrudService from "../../services/ApiCrudService";
import useCategory from "../../hooks/useCategory";
import useClient from "../../hooks/useClients";

const ClientCreer = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: ''

    });
    const {clients, loading, error, create} = useClient();
    const navigate = useNavigate();

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
        let response = await create(formData);

        if (response.success) {
            navigate(`/clients/${response.data.id}`);
        }

    };



    return (
        <div className="container mt-5">
            <h3>Créer un nouveau client</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Entrez le nom du client" required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Entrez la prenom" required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Entrez l'email"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="Entrez le telephone"
                        required
                    />
                </Form.Group>


                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Créer le client'}
                </Button>
            </Form>
        </div>
    );
};

export default ClientCreer;
