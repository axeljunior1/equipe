import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Button, FormControl} from "react-bootstrap";
import ErrorAlert from "../../exceptions/ErrorAlert";
import AlertComp from "../../components/AlertComp";
import useTarifAchat from "../../hooks/useTarifAchat";
import PaginationComp from "../../components/PaginationComp";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";

function TarifAchat() {
    const [showAlertUpdateTA, setShowAlertUpdateTA] = useState(false);
    const {tarifAchats :tarifAchat, error, loading, fetchAllTarifAchats, update, totalPages, totalElements} = useTarifAchat()
    const [prixAchatValues, setPrixAchatValues] = useState({});

    const [currentPage, setCurrentPage] = useState(0); // Page actuelle

    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE); // Taille de la page

    const handleChange = (id, value) => {
        setPrixAchatValues((prev) => ({...prev, [id]: value}));
    };

    async function fetchTarifAchat(page = 0, size = pageSize) {
        fetchAllTarifAchats(page, size)
    }


    useEffect(() => {
        fetchTarifAchat().then();
    }, []);

    useEffect(() => {
        fetchTarifAchat(currentPage, pageSize ).then();

    }, [currentPage, pageSize]);


    useEffect(() => {
        if (tarifAchat?.length > 0) {
            let obj = {}
            tarifAchat.forEach(element => {
                obj[element.id] = element.prixAchat;
            })
            setPrixAchatValues(obj)
        }
    }, [tarifAchat]);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (!tarifAchat) {
        return <p>Aucun tarif</p>;
    }

    if (error) {
        return <ErrorAlert error={error}/>;
    }


// Exemple : augmenter tous les tarifs de 10%
    const handleIncreaseAllPrices = () => {
    };


    const handleEditTarif = async (id, value) => {
        update(id, {prixAchat: value});


    }

    return (
        <div>
            <h1><strong>TarifAchat</strong></h1>

            {showAlertUpdateTA && (
                <AlertComp
                    message="Opération réussie le Tarif d'achat a été mis a jour !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertUpdateTA(false)}
                />
            )}


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID Tarif</th>
                    <th>ID Produit</th>
                    <th>Prix Achat</th>
                    <th>Modifier</th>
                </tr>
                </thead>
                <tbody>
                {tarifAchat.map((tarif) => (
                    <tr key={tarif.id}>
                        <td>{tarif.id}</td>
                        <td>
                            {tarif["produit"]?.id} - {tarif["produit"]?.nom}
                        </td>
                        <td>
                            <FormControl
                                type="number"
                                id={`${tarif.id}`}
                                name={`${tarif.id}`}
                                value={prixAchatValues[tarif.id] || ""}
                                onChange={(e) => handleChange(tarif.id, e.target.value)}
                            />
                        </td>
                        <td>
                            <Button
                                variant="warning"
                                onClick={() => handleEditTarif(tarif.id, prixAchatValues[tarif.id])}
                            >
                                Modifier
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Button variant="success" onClick={handleIncreaseAllPrices} disabled>
                Augmenter tous les prix
            </Button>
            <br/>
            <br/>

            <PaginationComp className={"mb-5"}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            handlePageSizeChange={handlePageSizeChange}
                            nombreElt={totalElements}

            />

        </div>
    );
}

export default TarifAchat;
