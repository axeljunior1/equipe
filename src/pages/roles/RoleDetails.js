import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import apiCrudService from "../../services/ApiCrudService";
import RoleDetailComp from "../../components/RoleDetailComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import SelectMultiple from "./SelectMultiple";

const RoleDetail = (props) => {
    const {id:rlt} = useParams(); // Récupère l'ID depuis l'URL*
    const id = rlt??props.id // id de l'url ou id dans props, ils'agit ici de l'id du role
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");
    const [authorities, setAuthorities] = useState([]);

    const [role, setRole] = useState(null);


    let initialFormDetailRole = {
        nom : "",
        description : "",
        authoritiesNoms : [],
    };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState(initialFormDetailRole); // État pour stocker les modifications
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);

    // Fonction pour récupérer les données d'un role
    const fetchRole = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.getById('roles', id)
            // console.log(data)
            setRole(data);
            let preFormData = formData;
            preFormData.nom = data.nom;
            preFormData.description = data.description;
            preFormData.authoritiesNoms = data.authorityNoms ;
            setFormData(preFormData);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour récupérer les données d'un role
    const fetchAuthorities = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.get('autorisations')
            // console.log(data)
            setAuthorities(data.content);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour un role (PATCH)
    const updateRole = async () => {
        setLoading(true);
        setError(null);
        try {
            let data = await apiCrudService.put("roles",id, formData)
            setRole(data);
            setFormData(data);
            setIsEditing(false);
        } catch (error) {
            setLoading(false);
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRole().then(r => r)// Appel de la fonction asynchrone
        fetchAuthorities().then(r => r)// Appel de la fonction asynchrone

    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!role) {
        return <h1>Role introuvable</h1>;
    }

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };



    function handeIsEditing() {
        setIsEditing(true);
    }



    if(error){
        return <ErrorAlert error={error} />
    }

    const setSelectedOptions = (selectedItems) => {
        setFormData({...formData, authoritiesNoms : selectedItems});
    }


    return (

        <div className="">
            {error &&
                <ErrorAlert error={error} />
            }

            <h1><strong>Détail du Role</strong></h1>

            {!isEditing ? (

                <RoleDetailComp id ={id} isEditing={handeIsEditing} />
            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier le role</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            updateRole(); // Appelle la fonction de mise à jour
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
                            <label htmlFor="description" className="form-label">Description :</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Entrez la description"
                            />
                        </div>
                        {/* Prénom */}
                        <div className="mb-3">

                            {authorities && (
                                <SelectMultiple title="Autorisations.." options={authorities
                                } selectedOptions={role.authorities} setSelectedOptions={setSelectedOptions} />
                            )}

                        </div>

                        {/* Date de Création */}


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

export default RoleDetail;
