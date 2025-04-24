import React, {useEffect} from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import useVente from "../../hooks/useVentes";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";

function Ventes() {
    const {ventes, error, loading, fetchAllVentes, remove} = useVente()


    async function fetchVentes(page, size = DEFAULT_PAGINATION_SIZE) {
        fetchAllVentes()
    }

    useEffect(() => {
        fetchVentes().then();
    }, []);


    const handleDeleteVente = async (id) => {
        remove(id)
    };

    if (loading) {
        return (<div className="text-center">
            <h1>Chargement en cours...</h1>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>);
    }

    if (!ventes)

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
                            <Link to={`/ventes/${vente.id}`}
                                  className='text-decoration-none'>{'Vente'} - {vente.id}</Link>
                        </td>
                        <td>{vente.montantTotal}</td>
                        <td>
                            <Link to={`/clients/${vente.client.id}`}
                                  className='text-decoration-none'>{vente.client.id} - {vente.client.nom}</Link>
                        </td>
                        <td>{vente['etat']['libelle']}</td>
                        <td>
                            <Link to={`/employes/${vente['employe'].id}`}
                                  className='text-decoration-none'>{vente['employe'].id} - {vente['employe'].nom}</Link>
                        </td>
                        <td> {formatDate(vente.createdAt)}</td>
                        <td> {formatDate(vente.updatedAt)}</td>
                        <td>
                            <Button variant={"outline-danger"} className={"w-100"}
                                    onClick={() => handleDeleteVente(vente.id)}> Supprimer la ligne </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Ventes;
