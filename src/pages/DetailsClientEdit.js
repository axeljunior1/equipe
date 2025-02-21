import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ClientService from "../services/ClientService";
import AlertComp from "../components/AlertComp";
import ErrorAlert from "../exceptions/ErrorAlert";
import apiCrudService from "../services/ApiCrudService";
import {Form} from "react-bootstrap";
import {updateObject} from "../utils/objectMapping";

const ClientDetail = (props) => {
    const {id: rlt} = useParams(); // Récupère l'ID depuis l'URL*
    const id = rlt ?? props.id // id de l'url ou id dans props, ils'agit ici de l'id du client


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    let initialFormDetailClient = {
        nom: "",
        prenom: "",
        telephone: "",
        email: ""
    };


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(initialFormDetailClient); // État pour stocker les modifications
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);
    const [categories, setCategories] = useState([]);
    const [client, setClient] = useState({});

    // Fonction pour récupérer les données d'un client
    const fetchClient = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.getById('clients', id)
            // console.log(data)
            setClient(data)
            // Important pour ne retourner que les champs utiles pour la mise a jour
            setFormData((prev) => {
                let copie = {...prev};
                updateObject(copie, data);
                return copie;
            });
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    // Fonction pour mettre à jour un client (PATCH)
    const updateClient = async () => {
        setLoading(true);
        setError(null);
        try {


            await apiCrudService.patch(`clients`,id, formData);

            // si tout est ok, on navigue
            navigate(`/clients/${id}`);

        } catch (error) {
            setLoading(false);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null)
        try {
            let data = await apiCrudService.get("categories", 0, 50);
            setCategories(data.content);  // Assuming 'content' is the array of products
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    useEffect(() => {
        fetchCategories().then(response => response);

    }, [])


    useEffect(() => {
        fetchClient().then();

    }, [id])


    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!client) {
        return <h1>Client introuvable</h1>;
    }


    if (error) {
        return <ErrorAlert error={error}/>
    }

    const handleSubmitForm = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        updateClient().then(); // Appelle la fonction de mise à jour

    }

    return (

        <div className="">
            {showAlertCreation && (
                <AlertComp
                    message="Opération réussie le client a été crée !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertCreation(false)}
                />
            )}

            <h1><strong>Détail du Client</strong></h1>

            <div className="card p-4 shadow bg-light">
                <h3 className="text-center mb-4">Modifier le client</h3>
                <form
                    onSubmit={handleSubmitForm}
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
                        <label htmlFor="prenom" className="form-label">Description :</label>
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            className="form-control"
                            value={formData.prenom}
                            onChange={handleChange}
                            placeholder="Entrez le prenom"
                        />
                    </div>

                    {/* Prénom */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Description :</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Entrez l'email"
                        />
                    </div>

                    {/* Prénom */}
                    <div className="mb-3">
                        <label htmlFor="telephone" className="form-label">Description :</label>
                        <input
                            type="text"
                            id="telephone"
                            name="telephone"
                            className="form-control"
                            value={formData.telephone}
                            onChange={handleChange}
                            placeholder="Entrez le numéro de téléphone"
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
                            onClick={() => navigate(`/clients/${id}`)}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>

        </div>


    );
};

export default ClientDetail;
