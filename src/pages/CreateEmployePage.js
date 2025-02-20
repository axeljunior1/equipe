import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import {useJwt} from "../context/JwtContext";
import EmployeService from "../services/EmployeService";

const CreateEmployePage = () => {
    const {loggedEmployee} = useJwt();

    let formInitialState = {
        nom: "",
        prenom: "",
        password: ""
    };
    const [formData, setFormData] = useState(formInitialState);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            let data = await EmployeService.createEmploye(formData);
            setFormData(formInitialState);
            navigate(`/employes/${data.id}`);
        }catch(error) {
            setError(error);
        }

    };

    useEffect(() => {
        console.log(loggedEmployee)
    },[])
    return (
        <div className="container mt-5">
            <h3>  Créer un employé </h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Entrez le nom"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        defaultValue={0}
                        placeholder="Entrez le prenom"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Mot de passe </Form.Label>
                    <Form.Control
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        defaultValue={0}
                        placeholder="Entrez le mot de passe"
                    />
                </Form.Group>



                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Créer'}
                </Button>
            </Form>
        </div>
    );
};

export default CreateEmployePage;
