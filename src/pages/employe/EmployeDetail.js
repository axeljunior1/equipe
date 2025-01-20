import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import EmployeService from "../../services/EmployeService";

const EmployeDetail = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const [employe, setEmploye] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour le mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les données du formulaire

    // Fonction pour récupérer les données de l'employé
    const fetchEmploye = async () => {
        EmployeService.getEmployesById(id)
            .then(data => {
                setEmploye(data)
                setFormData(data); // Pré-remplit le formulaire
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    };

    // Fonction pour mettre à jour les données de l'employé
    const updateEmploye = async () => {
        EmployeService.updateEmploye(id, formData).then(data => {
            setEmploye(data)
            setFormData(data);
            setIsEditing(false);
        }).catch(err => setError('Une erreur est survenue lors de la mise à jour de l\'employé' + err ));

    };

    useEffect(() => {
        fetchEmploye(); // Récupère les données à l'initialisation
    }, [id]);

    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Gestion des états
    if (loading) {
        return (
            <div className="text-center">
                <h1>Chargement en cours...</h1>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <h1 className="text-danger">{error}</h1>;
    }

    if (!employe) {
        return <h1 className="text-warning">Employé introuvable</h1>;
    }

    return (
        <div className="container mt-5">
            {!isEditing ? (
                <div className="card p-4 shadow">
                    <h3 className="card-title text-center">{employe.nom}</h3>
                    <div className="card-body">
                        <p><strong>Prénom :</strong> {employe.prenom}</p>
                        <p><strong>Date de Création :</strong> {employe.dateCreation}</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier l'Employé</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            updateEmploye(); // Appelle la fonction de mise à jour
                        }}
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
                            <label htmlFor="prenom" className="form-label">Prénom :</label>
                            <input
                                type="text"
                                id="prenom"
                                name="prenom"
                                className="form-control"
                                value={formData.prenom}
                                onChange={handleChange}
                                placeholder="Entrez le prénom"
                            />
                        </div>

                        {/* Date de Création */}
                        <div className="mb-3">
                            <label htmlFor="dateCreation" className="form-label">Date de Création :</label>
                            <input
                                type="date"
                                id="dateCreation"
                                name="dateCreation"
                                className="form-control"
                                value={formData.dateCreation}
                                onChange={handleChange}
                                placeholder="Entrez la date de création"
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
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeDetail;
