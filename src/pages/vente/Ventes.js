import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Alert, Button} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import useVente from "../../hooks/useVentes";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";
import PaginationComp from "../../components/PaginationComp";

function Ventes() {
    const {ventes, error, loading, fetchAllVentes, remove, totalElements,
        totalPages} = useVente()

    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE); // Taille de la page

    async function fetchVentes(page=currentPage, size = pageSize) {
        fetchAllVentes(page, size);
    }

    useEffect(() => {
        fetchVentes().then();
    }, []);


    const handleDeleteVente = async (id) => {
        remove(id)
    };

    useEffect(() => {
        fetchAllVentes(currentPage, pageSize);

    }, [currentPage, pageSize]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
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

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Nom</th>
                    <th>Montant</th>
                    <th className="text-danger">Reste à payer</th>
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
                        <td className="text-danger">{vente.resteAPayer}</td>
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

            {/* Pagination controls */}

            <PaginationComp className={"mb-5"}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            handlePageSizeChange={handlePageSizeChange}
                            nombreElt={totalElements}
                            nbreElmentsSouhaite = {pageSize}

            />
        </div>
    );
}

export default Ventes;
