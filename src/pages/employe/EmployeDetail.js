import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import SelectMultiple from "../roles/SelectMultiple";
import apiCrudService from "../../services/ApiCrudService";
import ErrorAlert from "../../exceptions/ErrorAlert";

const EmployeDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const [employe, setEmploye] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour le mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les données du formulaire
    const [roles, setRoles] = useState([]);

    // Fonction pour récupérer les données de l'employé
    const fetchEmploye = async () => {
        try {
            const data = await apiCrudService.getById('employes', id)
            setEmploye(data)
            setFormData(data); // Pré-remplit le formulaire
            fetchRoles().then()
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour les données de l'employé
    const updateEmploye = async () => {
        const data = await apiCrudService.put("employes", id, formData)
        try {
            setEmploye(data)
            setFormData(data);
            setIsEditing(false);
        } catch (err) {
            setError('Une err eur est survenue lors de la mise à jour de l\'employé' + err)

        } finally {
            setLoading(false);
        }

    };
    // Fonction pour récupérer les données d'un role
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.get('roles')
            // console.log(data)
            setRoles(data.content);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const setSelectedOptions = (selectedItems) => {
        let newFormData = {...formData,
            rolesNoms: selectedItems.map(item => item.nom),
            rolesIds: selectedItems.map(item => item.id)
            };
        console.log(newFormData.rolesNoms);

        setFormData(newFormData);

    }
    const OnSubmitPutEmploye = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        updateEmploye().then(); // Appelle la fonction de mise à jour
    }


    useEffect(() => {
        fetchRoles().then()
    }, []);

    useEffect(() => {
        fetchEmploye().then(); // Récupère les données à l'initialisation
    }, [])
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

    if (!employe) {
        return <h1 className="text-warning">Employé introuvable</h1>;
    }

    return (
        <div className="container mt-5">

            {error &&
                <ErrorAlert error={error}/>
            }

            {!isEditing ? (
                <>
                    {employe && (<div className="card p-4 shadow">
                        <h3 className="card-title text-center">{employe.nom}</h3>
                        <div className="card-body">
                            <p><strong>Prénom :</strong> {employe.prenom}</p>
                            <p><strong>Date de Création :</strong> {employe.dateCreation}</p>
                            {employe.rolesNoms && (
                                <p><strong>Roles :</strong> {(employe.rolesNoms)?.join(', ')}</p>
                            )}
                        </div>
                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => setIsEditing(true)}
                            >
                                Modifier
                            </button>
                        </div>
                    </div>)}
                </>
            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier l'Employé</h3>
                    <form
                        onSubmit={OnSubmitPutEmploye}
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

                        <div className="mb-3">

                            {roles && (
                                <SelectMultiple title="Roles : " options={roles} selectedOptions={employe.roles}
                                                setSelectedOptions={setSelectedOptions}/>
                            )}

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
