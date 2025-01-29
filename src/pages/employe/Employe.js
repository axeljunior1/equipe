import React, { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import EmployeService from "../../services/EmployeService";

function Achats() {
    const [employes, setEmployes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Charger les achats au chargement du composant
        EmployeService.getEmploye()
            .then(data => setEmployes(data))
            .catch(err => setError(err));
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
                    <th>id</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Date de creation</th>
                </tr>
                </thead>
                <tbody>
                {employes.map((employe, index) => (
                    <tr key={employe.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/employes/${employe.id}`} className='text-decoration-none'>{employe.id}</Link>
                        </td>
                        <td>{employe.nom}</td>
                        <td>{employe.prenom}</td>
                        <td>{employe.dateCreation}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Achats;
