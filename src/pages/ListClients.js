import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import ClientService from "../services/ClientService";
import HeaderBtnElementComp from "../components/HeaderBtnElementComp";
import {Button} from "react-bootstrap";
import {usePanier} from "../context/PanierContext";
import PaginationComp from "../components/PaginationComp";
import SearchClientCritereComp from "../components/SearchClientCritereComp";


const ListClient = () => {
    const [clients, setClients] = useState([]);
    const [searchInput, SetSearchInput] = useState('');
    const [filters, setFilters] = useState({
        nom: "",
        description: "",
        stockInitialMin: "",
        stockInitialMax: "",
        prixUnitaireMin: "",
        prixUnitaireMax: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(5); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const navigate = useNavigate();
    const {  ajouterAuPanier, dejaPresent, nombreDansPanier } = usePanier();

    // Fonction pour récupérer les clients avec pagination
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


    // useEffect(() => {
    //     fetchClientByMotCle(searchInput).then(r => console.log(r));
    // }, [searchInput]);


    useEffect(() => {
        fetchClients().then(r => null );
    }, [currentPage, pageSize]);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmitFilter = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construire dynamiquement les paramètres de la requête
        const params = {};
        if (filters.nom) params.nom = filters.nom;
        if (filters.description) params.description = filters.description;
        if (filters.stockInitialMin) params.stockInitialMin = filters.stockInitialMin;
        if (filters.stockInitialMax) params.stockInitialMax = filters.stockInitialMax;
        if (filters.prixUnitaireMin) params.prixUnitaireMin = filters.prixUnitaireMin;
        if (filters.prixUnitaireMax) params.prixUnitaireMax = filters.prixUnitaireMax;

        ClientService.getClientDyn(params).then(data => {
            setClients(data);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchClientByMotCle(searchInput).then(r => console.log(r));
    }

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

    const handleSearchInput = (e)=>{
        SetSearchInput(e.target.value);
    }

    return (
        <div>
            <h1><strong>Client</strong></h1>


            <HeaderBtnElementComp titreFil='' variant='outline-primary' onClick={() => navigate('/creer-client')}
                                  valueBtn='Créer client' />



            <SearchClientCritereComp
                handleSubmitSearch={handleSubmitSearch}
                searchInput={searchInput}
                handleSearchInput={handleSearchInput}
                handleSubmitFilter={handleSubmitFilter}
                filters={filters}
                handleInputChange={handleInputChange}

            />

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Stock initial</th>
                    <th>Prix Unitaire</th>
                    <th>Add to Cart 🛒</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client, index) => (
                    <tr key={client.id}>
                        <td>
                            <Link to={`/clients/${client.id}`} className='text-decoration-none'>{client.nom}</Link>
                        </td>
                        <td>{client.description}</td>
                        <td>{client.stockInitial}</td>
                        <td>{client.prixUnitaire}</td>
                        <td><Button
                            variant="" className={'w-100 text-primary fw-bold'}
                            onClick={() => handleAjouterAuPanier(client)} >
                            {dejaPresent(client) ? ( <span> Ajouter (1) au panier 🧺 <span className={'text-danger'}> { nombreDansPanier(client)} </span> </span> ):( <span>Ajouter au panier 🧺 </span>)}
                        </Button> </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Pagination controls */}

            <PaginationComp
                currentPage = {currentPage}
                handlePageChange = {handlePageChange}
                totalPages = {totalPages}
                pageSize = {pageSize}
                handlePageSizeChange = {handlePageSizeChange}

            />
        </div>
    );
};

export default ListClient;
