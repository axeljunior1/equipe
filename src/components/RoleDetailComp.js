import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import apiCrudService from "../services/ApiCrudService";
import SelectMultiple from "../pages/roles/SelectMultiple";

const RoleDetailComp = (props) => {
    const [role, setRole] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // Fonction pour récupérer les données d'un role
    const fetchRole = async (id) => {
        try {
            const data = await apiCrudService.getById("roles", id)
            console.log(data)
            setRole(data);

        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchRole(props.id).then(r => r);
    }, [props.id]);


    const handleDeleteRole = async (id) => {
        try {
            await apiCrudService.delete("roles", id);
            navigate("/roles?showAlertSupprRole=true");
        } catch (err) {
            setError(err);
        }
    }


    return (
        <div className="card p-4 shadow">
            <h3 className="card-title text-center">{role.nom}</h3>
            <div className="card-body">
                <p><strong>Nom :</strong> {role.nom} </p>
                <p><strong>Description :</strong> {role.description}</p>
                <p><strong>Autorisations :</strong> {(role.authorityNoms)?.join(', ')}</p>
            </div>
            <div className="d-flex justify-content-center">
                {/*Il n'est plus necessaire car c'est testé dans le parent*/}

                <button
                    className="btn btn-outline-primary me-2 fw-bold"
                    onClick={() => props.isEditing()}
                >
                    Modifier
                </button>
                <Button variant={"danger"} onClick={() => handleDeleteRole(props.id)}> Supprimer le role</Button>

            </div>
        </div>
    );
};

export default RoleDetailComp;