import React, { useState, useEffect } from 'react';
import VenteService from "../../services/VenteService";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";

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
            console.log('error', e);
            setError( e.response?.data?.message || e.message);
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
        return <p>Erreur : {error}</p>;
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
                    <th>Etat</th>
                    <th>Employé</th>
                    <th>Date de création</th>
                    <th>Date de mise à jour</th>
                    <th>Supprimer ? 🚮</th>
                </tr>
                </thead>
                <tbody>
                {ventes && ventes.map((vente, index) => (
                    <tr key={vente.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/ventes/${vente.id}`} className='text-decoration-none'>{'Vente'} - {vente.id}</Link>
                        </td>
                        <td>{vente.montantTotal}</td>
                        <td>
                            <Link to={`/clients/${vente.client.id}`} className='text-decoration-none'>{vente.client.id} - {vente.client.nom}</Link>
                        </td>
                        <td>{vente.etat.libelle}</td>
                        <td>
                            <Link to={`/employes/${vente.employe.id}`} className='text-decoration-none'>{vente.employe.id} - {vente.employe.nom}</Link>
                        </td>
                        <td> {formatDate(vente.createdAt)}</td>
                        <td> {formatDate(vente.updatedAt)}</td>
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
