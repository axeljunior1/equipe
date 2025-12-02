import React, {useEffect} from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import useRetour from "../../hooks/useRetour";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";

function Retour() {
    const {retours, error, loading, fetchAllRetours, remove} = useRetour()


    async function fetchRetours(page, size = DEFAULT_PAGINATION_SIZE) {
        fetchAllRetours()
    }

    useEffect(() => {
        fetchRetours().then();
    }, []);


    const handleDeleteRetour = async (id) => {
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

    if (!retours) {
        if (error) {
            return <p>Erreur : {error}</p>;
        }
    }

    return (
        <div>
            <Card className="mb-4 shadow-sm border-0 bg-light">
                <Card.Body>
                    <h3 className="fw-bold mb-1">
                        <i className="bi bi-arrow-counterclockwise text-primary me-2"></i>
                        Retours de ventes clients
                    </h3>
                </Card.Body>
            </Card>


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Nom/Id</th>
                    <th className="text-danger">Etat</th>
                    <th>Client</th>
                    <th>Employé</th>
                    <th>Date de création</th>
                    <th>Supprimer ? 🚮</th>
                </tr>
                </thead>
                <tbody>
                {retours && retours.map((retour, index) => (
                    <tr key={retour.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/retours/${retour.id}`}
                                  className='text-decoration-none'>{'Retour'} - {retour.id}</Link>
                        </td>
                        <td>{retour['etatLibelle']}</td>
                        <td>
                            <Link to={`/clients/${retour.clientId}`}
                                  className='text-decoration-none'>{retour.clientNom} - {retour.clientNom}</Link>
                        </td>
                        <td>
                            <Link to={`/employes/${retour.employeId}`}
                                  className='text-decoration-none'>{retour['employeNom']} - {retour['employeNom']}</Link>
                        </td>
                        <td> {formatDate(retour.dateCreation)}</td>
                        <td>
                            <Button variant={"outline-danger"} className={"w-100 disabled"}
                                    onClick={() => handleDeleteRetour(retour.id)}> Supprimer la ligne </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Retour;
