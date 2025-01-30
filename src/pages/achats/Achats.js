import React, { useState, useEffect } from 'react';
import AchatService from "../../services/AchatService";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import VenteService from "../../services/VenteService";

function Achats() {
    const [achats, setAchats] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchAchats() {
        setLoading(true);
        setError(null);

        try {
            let data = await AchatService.getAchats()
            setAchats(data.content)
        } catch (e) {
            setError(e.response.data);
        }finally {
            setLoading(false);
        }
    }

    useEffect( () => {
         fetchAchats().then(r => {});
    }, []);


    const handleUpdateAchat = (id) => {
        const updatedData = { montant: 300 };
        AchatService.updateAchat(id, updatedData)
            .then(updatedAchat => {
                setAchats(achats.map(achat => achat.id === id ? updatedAchat : achat));
            })
            .catch(err => setError(err));
    };

    const handleDeleteAchat =async (id) => {
        setLoading(true);
        setError(null);
        try{
            await AchatService.deleteAchat(id);
            fetchAchats().then(r => {});
        }catch(err){
            setError(err);
        }finally {
            setLoading(false);
        }
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
                    <th>Date de création/modification</th>
                    <th>Employé</th>
                    <th>Supprimer ? 🚮</th>
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
                        <td>{achat.dateCreation}</td>
                        <td>
                            <Link to={`/employes/${achat.employeId}`} className='text-decoration-none'>{achat.employeId} - {achat.employeNom}</Link>
                        </td>
                        <td>
                            <Button variant={"outline-danger"} className={"w-100"} onClick={()=>handleDeleteAchat(achat.id)}> Supprimer la ligne </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Achats;
