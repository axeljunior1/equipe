import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import AchatService from "../services/AchatService";

const CreateAchatPage = () => {

    let formInitialState = {
        montantTotal: 0,
        employeId: 0
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
            let data = await AchatService.createAchat(formData);
            setFormData(formInitialState);
            navigate(`/achats/${data.id}`);
        }catch(error) {
            setError(error);
        }

    };

    return (
        <div className="container mt-5">
            <h3>Entrée en stock</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Employé</Form.Label>
                    <Form.Control
                        type="number"
                        name="employeId"
                        value={formData.employeId}
                        onChange={handleChange}
                        placeholder="Entrez l'employe"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Montant total</Form.Label>
                    <Form.Control
                        type="number"
                        name="montantTotal"
                        value={formData.montantTotal}
                        onChange={handleChange}
                        defaultValue={0}
                        placeholder="Entrez le montant total"
                    />
                </Form.Group>



                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Entree en Stock'}
                </Button>
            </Form>
        </div>
    );
};

export default CreateAchatPage;
