import React, { useState, useEffect } from 'react';
import VenteService from "../../services/VenteService";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

function Ventes() {
    const [ventes, setVentes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function fetchVentes() {
        setLoading(true);
        setError(null);

        try {
            let data = await VenteService.getVentes()
            setVentes(data.content)
        } catch (e) {
            setError(e.response.data);
        }finally {
            setLoading(false);
        }
    }

    useEffect( () => {
         fetchVentes().then(r => {});
    }, []);



    const handleUpdateVente = (id) => {
        const updatedData = { montant: 300 };
        VenteService.updateVente(id, updatedData)
            .then(updatedVente => {
                setVentes(ventes.map(vente => vente.id === id ? updatedVente : vente));
            })
            .catch(err => setError(err));
    };

    const handleDeleteVente = async (id) => {
        setLoading(true);
        setError(null);
        try{
             await VenteService.deleteVente(id);
            fetchVentes().then(r => {});
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
            <h1>Ventes </h1>


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Nom</th>
                    <th>Montant</th>
                    <th>Client</th>
                    <th>Employé</th>
                    <th>Supprimer ? 🚮</th>
                </tr>
                </thead>
                <tbody>
                {ventes.map((vente, index) => (
                    <tr key={vente.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/ventes/${vente.id}`} className='text-decoration-none'>{'Vente'} - {vente.id}</Link>
                        </td>
                        <td>{vente.montantTotal}</td>
                        <td>{vente.client}
                            <Link to={`/clients/${vente.clientId}`} className='text-decoration-none'>{vente.clientId} - {vente.clientNom}</Link>
                        </td>
                        <td>
                            <Link to={`/employes/${vente.employeId}`} className='text-decoration-none'>{vente.employeId} - {vente.employeNom}</Link>
                        </td>
                        <td>
                            <Button variant={"outline-danger"} className={"w-100"} onClick={()=>handleDeleteVente(vente.id)}> Supprimer la ligne </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Ventes;
