import React, { useState, useEffect } from "react";
import {Table, Button, Form, Accordion, Container, Row, Col} from "react-bootstrap";
import ClientService from "../../services/ClientService";
import {Link, useNavigate} from "react-router-dom";
import {usePanier} from "../../context/PanierContext";
import Pagination from "../../components/Pagination";
import SearchClientCritere from "../../components/SearchClientCritere";

const SearchClientPopup = ({ onSelect }) => {
    const [clients, setClients] = useState([]); // Liste des employés

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const {  ajouterAuPanier, dejaPresent, nombreDansPanier } = usePanier();
    const [searchInput, SetSearchInput] = useState('');
    const [filters, setFilters] = useState({
        nom: "",
        description: ""
    });
    // Fonction pour récupérer les employés via l'API
    const fetchClients = async () => {
        setLoading(true);
        try {
            let data = await ClientService.getClient(currentPage, pageSize);
            setClients(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };




    const handleSubmitFilter = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construire dynamiquement les paramètres de la requête
        const params = {};
        if (filters.nom) params.nom = filters.nom;
        if (filters.description) params.description = filters.description;

        ClientService.getClientDyn(params).then(data => {
            setClients(data);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };




    const handleAjouterAuPanier = (client) => {
        ajouterAuPanier({ ...client, quantite: 1 });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };


    // Fonction pour récupérer les clients depuis l'API
    const fetchClientByMotCle = async () => {
        setLoading(true);
        try {
            let data = await ClientService.getClientByMotCle(searchInput);
            setClients(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchClientByMotCle(searchInput).then(r => console.log(r));
    }




    const handleSearchInput = (e)=>{
        SetSearchInput(e.target.value);
    }




    // Recherche des employés lorsqu'on tape dans le champ de recherche
    useEffect(() => {
        fetchClients();
    }, [currentPage, pageSize]);

    return (
        <div>

            {/* Permetre la recherche par le numero de telphone Ici */}
            <SearchClientCritere
                handleSubmitSearch={handleSubmitSearch}
                searchInput={searchInput}
                handleSearchInput={handleSearchInput}
                handleSubmitFilter={handleSubmitFilter}
                // filters={filters}
                handleInputChange={handleInputChange}

            />


            <Table striped bordered hover className={'mt-4'} >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Tel</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td>{client.id}</td>
                        <td>{client.nom}</td>
                        <td>{client.prenom}</td>
                        <td>{client.email}</td>
                        <td>{client.telephone}</td>
                        <td>
                            <Button variant="primary" onClick={() => {
                                let cli = {
                                    id : client.id ,
                                    nom : client.nom ,
                                    prenom : client.prenom ,
                                    email : client.email ,
                                    telephone: client.telephone
                                }
                                onSelect(cli)
                            }}>
                                Sélectionner
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Pagination controls */}


            <Pagination className="mt-2"
                currentPage = {currentPage}
                handlePageChange = {handlePageChange}
                totalPages = {totalPages}
                pageSize = {pageSize}
                handlePageSizeChange = {handlePageSizeChange}

            />
        </div>
    );
};

export default SearchClientPopup;
