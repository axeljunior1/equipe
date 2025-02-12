import React, { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import EmployeService from "../../services/EmployeService";
import axios from "axios";
import apiService from "../../services/ApiCrudService";
import {formatDate} from "../../utils/dateUtils";

function Achats() {
    const [employes, setEmployes] = useState([]);
    const [error, setError] = useState(null);

    const fetchEmployes = async () => {
        try{
            let data = await apiService.get("employes");
            setEmployes(data.content);
        }catch(e){
            setError(e);

        }finally{
        }
    }

    useEffect(() => {
        fetchEmployes().then();
    }, []);

    const handleAddEmploye = () => {
        const newAchat = { nom: 'Achat Test', montant: 200 };
        EmployeService.createEmploye(newAchat)
            .then(data => setEmployes([...employes, data]))
            .catch(err => setError(err));
    };

    const handleUpdateEmploye = (id) => {
        const updatedData = { montant: 300 };
        EmployeService.updateEmploye(id, updatedData)
            .then(updatedAchat => {
                setEmployes(employes.map(achat => achat.id === id ? updatedAchat : achat));
            })
            .catch(err => setError(err));
    };

    const handleDeleteEmploye = (id) => {
        EmployeService.deleteEmploye(id)
            .then(() => {
                setEmployes(employes.filter(achat => achat.id !== id));
            })
            .catch(err => setError(err));
    };

    if (error) {
        return <p>Erreur : {error.message}</p>;
    }

    return (
        <div>
            <h1>Gestion des Achats</h1>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Roles</th>
                    <th>Date de creation</th>
                </tr>
                </thead>
                <tbody>
                {employes?.map((employe, index) => (
                    <tr key={employe.id}>
                        <td>{index+1}</td>
                        <td>
                            <Link to={`/employes/${employe.id}`} className='text-decoration-none'>{employe.id} - {employe.nom}  </Link>
                        </td>
                        <td>{employe.prenom}</td>
                        <td className="fw-bold">
                            {employe.roles.length > 3
                                ? employe.roles.slice(0, 3).map(r => r.nom).join(', ') + '...'
                                : employe.roles.map(r => r.nom).join(', ')}
                        </td>
                        <td>{formatDate(employe.dateCreation)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Achats;
