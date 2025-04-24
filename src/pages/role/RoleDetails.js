import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import RoleDetailComp from "../../components/RoleDetailComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import SelectMultiple from "../../components/SelectMultiple";
import PropTypes from "prop-types";
import useRole from "../../hooks/useRole";
import useAuthority from "../../hooks/useAuthority";

const RoleDetail = (props) => {
    const {id:rlt} = useParams(); // Récupère l'ID depuis l'URL*
    const id = rlt??props.id // id de l'url ou id dans props, ils'agit ici de l'id du role



    let initialFormDetailRole = {
        nom : "",
        description : "",
        authoritiesNoms : [],
    };
    const [isEditing, setIsEditing] = useState(false); // État pour basculer en mode édition
    const [formData, setFormData] = useState(initialFormDetailRole); // État pour stocker les modifications
    const {roles: role, error, loading, fetchById, update} = useRole()
    const {authorities, error: errorA, loading: loadingA, fetchAllAuthorities} = useAuthority()

    // Fonction pour récupérer les données d'un role

    const fetchRole = async () => {
            fetchById(id)
    };

    useEffect(() => {
       if (role && role.length > 0) {
           let preFormData = formData;
           preFormData.nom = role.nom;
           preFormData.description = role.description;
           preFormData.authoritiesNoms = role.authorityNoms ;
           setFormData(preFormData);
       }
    }, [role]);

    // Fonction pour récupérer les données d'un role
    const fetchAuthorities = async () => {
        fetchAllAuthorities();
    };

    // Fonction pour mettre à jour un role (PATCH)
    const updateRole = async () => {
        update(id, formData);
        setIsEditing(false)
    };


    useEffect(() => {
        fetchRole().then()// Appel de la fonction asynchrone
        fetchAuthorities().then()// Appel de la fonction asynchrone

    }, []);

    if (loading || loadingA) {
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

    if(errorA){
        return <ErrorAlert error={errorA} />
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

                <RoleDetailComp id ={id} setIsEditing={handeIsEditing} />
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

RoleDetail.propTypes = {
    id: PropTypes.number.isRequired
}

export default RoleDetail;
