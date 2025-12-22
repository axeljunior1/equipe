import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import useVente from "../../hooks/useVentes";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";
import PaginationComp from "../../components/PaginationComp";
import SearchCritereComp from "../../components/SearchCritereComp";
import useClient from "../../hooks/useClients";
import {label} from "framer-motion/m";
import useEmploye from "../../hooks/useEmploye";
import useEtatVente from "../../hooks/useEtatVente";
import ProduitListe from "../produit/ProduitsListe";

function Ventes() {
    const {ventes, error, loading, fetchAllVentes, remove, totalElements,
        totalPages, searchVente} = useVente()
    const {clients,  error : errorClients, fetchAll: fetchAllClients } = useClient();
    const {employes, error : errorEmployes, fetchAllEmployes } = useEmploye();
    const {etatVentes, error : errorEtatVente, fetchAllEtatVentes } = useEtatVente();
    const [showModal, setShowModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE); // Taille de la page
    const [searchInput,setSearchInput] = useState('');
    const initialFilters = {
        // 🟢 Actif / supprimé
        actif: "",

        // 🔢 Numéro de vente
        venteId: "",
        venteIdPartiel: "false",

        // 💰 Montant total
        montantMin: "",
        montantMax: "",

        // 👤 Client
        clientId: "",

        // 🧑‍💼 Employé
        employeId: "",

        // ⭐ État de la vente
        etatVenteId: "",

        // 📅 Date de création
        createdAtFrom: "",
        createdAtTo: "",

        produitId : "",

        produitNom : "Id du produit",
    };

    const [filters, setFilters] = useState(initialFilters);

    async function fetchVentes(page=currentPage, size = pageSize) {
        fetchAllVentes(page, size);
    }

    useEffect(() => {
        fetchVentes().then();
    }, []);

    useEffect(() => {
        fetchAllClients();
    }, []);

    useEffect(() => {
        fetchAllEmployes();
    }, []);

    useEffect(() => {
        fetchAllEtatVentes();
    }, []);


    const buildPayload = () => ({
        actif: filters.actif === "" ? null : filters.actif === "true",
        venteId: filters.venteId ? Number(filters.venteId) : null,
        venteIdPartiel: filters.venteIdPartiel === "true",

        montantMin: filters.montantMin ? Number(filters.montantMin) : null,
        montantMax: filters.montantMax ? Number(filters.montantMax) : null,

        clientId: filters.clientId ? Number(filters.clientId) : null,
        employeId: filters.employeId ? Number(filters.employeId) : null,
        etatVenteId: filters.etatVenteId ? Number(filters.etatVenteId) : null,

        createdAtFrom: filters.createdAtFrom || null,
        createdAtTo: filters.createdAtTo || null,

        produitId : filters.produitId ? Number(filters.produitId) : null


    });


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

    let cols = [

        // 🟢 Vente active / supprimée
        {
            type: "select",
            name: "actif",
            placeholder: "Ventes actives uniquement ?",
            options: [
                { value: "true", label: "Oui" },
                { value: "false", label: "Non" }
            ]
        },

        // 🔢 Numéro de vente (partiel)
        {
            type: "text",
            name: "venteId",
            placeholder: "Numéro de vente"
        },

        // 🔍 Mode recherche numéro
        {
            type: "select",
            name: "venteIdPartiel",
            placeholder: "Recherche partielle ?",
            options: [
                { value: "true", label: "Oui" },
                { value: "false", label: "Exact" }
            ]
        },

        // 💰 Montant total min
        {
            type: "text",
            name: "montantMin",
            placeholder: "Montant total min"
        },

        // 💰 Montant total max
        {
            type: "text",
            name: "montantMax",
            placeholder: "Montant total max"
        },

        // 👤 Client
        {
            type: "select",
            name: "clientId",
            placeholder: "Client",
            // options chargées depuis API clients
            options: [
                { value: "", label: "Tous" },
                    ...clients.map(client => ({
                        value: client.id,
                        label: `${client.id} - ${client.nom}`
                    }))
            ]
        },

        // 🧑‍💼 Employé
        {
            type: "select",
            name: "employeId",
            placeholder: "Employé",
            // options chargées depuis API employés
            options: [
                {value: "", label: "Tous"},
                ...employes.map(employe => ({
                    value: employe.id,
                    label: `${employe.id} - ${employe.nom}`
                }))
            ]
        },

        // ⭐ État de la vente
        {
            type: "select",
            name: "etatVenteId",
            placeholder: "État de la vente",
            // options chargées depuis API états de vente
            options: [
                { value: "", label: "Tous" },
                ...etatVentes.map(etat => ({
                    value: etat.id,
                    label: `${etat.id} - ${etat.libelle}`
                }))
            ]
        },

        // 📅 Date création - début
        {
            type: "date",
            name: "createdAtFrom",
            placeholder: "Date de création (début)"
        },

        // 📅 Date création - fin
        {
            type: "date",
            name: "createdAtTo",
            placeholder: "Date de création (fin)"
        },

        // Id du Produit
        {
            type: "text",
            name: "produitId",
            placeholder: "Id du produit"
        },

        {
            type: "full",
            render: <>
                <div className="position-relative">
                    <Form.Floating>
                        <Form.Control
                            type="number"
                            value={filters.produitId}
                            onChange={(e) => handleInputChange(e)}
                            name="produitId"
                            id="produitId"
                            className={`pe-5`}
                            placeholder="Produit ID"
                        />


                        <label htmlFor="produitId" className="fw-bold">
                            {filters.produitNom}
                        </label>
                    </Form.Floating>
                    <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => setShowModal(true)}
                        className="position-absolute top-50 end-0 translate-middle-y me-2"
                        style={{ zIndex: 2 }}
                    >
                        🔍
                    </Button>
                </div>
            </>
        }

    ];

    const handleSubmitSearch = async (e) => {
        e.preventDefault();
        //Todo definir la fonction de search
        // fetchAllVentes(currentPage, pageSize);
        // search().then();
    }
    // Fonction pour récupérer les produits depuis l'API
    const search = async () => {
        await searchVente(buildPayload(), currentPage, pageSize);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmitFilter = async (e) => {
        e.preventDefault();
        setCurrentPage(0);  // Revenir en première page après un filtre

        // Filtrer dynamiquement les paramètres non vides
        let params = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value)
        );
        console.log(params)
        // const queryString = new URLSearchParams(params).toString();
        // Appel API
        // await fetchByParams(params);
        await search()

    };

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    }
    const handleProduitSelect = (produit) => {
        console.log(produit)
        setFilters({...filters, produitId: produit.id, produitNom: produit.nom});
        setShowModal(false); // Ferme le modal
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

            <SearchCritereComp cols={cols}
                               handleSubmitFilter={handleSubmitFilter}
                               filters={filters}
                               setFilters={setFilters}
                               handleInputChange={handleInputChange}
            />

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
            {/* Modal de recherche d'un produit */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rechercher un Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProduitListe onSelect={handleProduitSelect}/>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default Ventes;
