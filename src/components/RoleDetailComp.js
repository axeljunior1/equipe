import React, {useEffect} from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import useRole from "../hooks/useRole";
import PropTypes from "prop-types";

const RoleDetailComp = (props) => {
    const navigate = useNavigate();
    const {roles: role, error, loading, fetchById, remove} = useRole()


    // Fonction pour récupérer les données d'un role
    const fetchRole = async (id) => {
        fetchById(id)
    };

    useEffect(() => {
        fetchRole(props.id).then(r => r);
    }, [props.id]);


    const handleDeleteRole = async (id) => {
        remove(id);
        navigate("/roles");
    }


    // Gestion des états
    if (loading ) {
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


    return (
        <div className="card p-4 shadow">
            <h3 className="card-title text-center">{role.nom}</h3>
            <div className="card-body">
                <p><strong>Nom :</strong> {role.nom} </p>
                <p><strong>Description :</strong> {role.description}</p>
                <p><strong>Autorisations :</strong> {(role['authorityNoms'])?.join(', ')}</p>
            </div>
            <div className="d-flex justify-content-center">
                {/*Il n'est plus necessaire car c'est testé dans le parent*/}

                <button
                    className="btn btn-outline-primary me-2 fw-bold"
                    onClick={props.setIsEditing}
                >
                    Modifier
                </button>
                <Button variant={"danger"} onClick={() => handleDeleteRole(props.id)}> Supprimer le role</Button>

            </div>
        </div>
    );
};

RoleDetailComp.propTypes = {
    id: PropTypes.number.isRequired,
    setIsEditing: PropTypes.func.isRequired,
}

export default RoleDetailComp;