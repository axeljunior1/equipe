import React, { useState, useEffect } from 'react';
import AchatService from "../../services/AchatService";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";

function Achats() {
    const [achats, setAchats] = useState([]);
    const [error, setError] = useState(null);

    async function fetchAchats() {
        setError(null);

        try {
            let data = await AchatService.getAchats()
            setAchats(data.content)
        } catch (e) {
            setError(e.response.data);
        }
    }

    useEffect( () => {
         fetchAchats().then(r => {});
    }, []);

    const handleAddAchat = () => {
        const newAchat = { nom: 'Achat Test', montant: 200 };
        AchatService.createAchat(newAchat)
            .then(data => setAchats([...achats, data]))
            .catch(err => setError(err));
    };

    const handleUpdateAchat = (id) => {
        const updatedData = { montant: 300 };
        AchatService.updateAchat(id, updatedData)
            .then(updatedAchat => {
                setAchats(achats.map(achat => achat.id === id ? updatedAchat : achat));
            })
            .catch(err => setError(err));
    };

    const handleDeleteAchat = (id) => {
        AchatService.deleteAchat(id)
            .then(() => {
                setAchats(achats.filter(achat => achat.id !== id));
            })
            .catch(err => setError(err));
    };

    if (error) {
        return <p>Erreur : {error.message}</p>;
    }

    return (
        <div>
            <h1>Achats </h1>


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Montant</th>
                    <th>Client</th>
                    <th>Employe</th>
                </tr>
                </thead>
                <tbody>
                {achats.map((achat, index) => (
                    <tr key={achat.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/achats/${achat.id}`} className='text-decoration-none'>{'Achat'}</Link>
                        </td>
                        <td>{achat.montantTotal}</td>
                        <td>{achat.client}</td>
                        <td>
                            <Link to={`/employe/${achat.employeId}`} className='text-decoration-none'>{achat.employeId}</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Achats;
