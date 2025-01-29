import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import {Button, Pagination} from "react-bootstrap";
import MouvementStockService from "../../services/MouvementStockService";
import HeaderBtnElement from "../../components/HeaderBtnElement";
import {usePanier} from "../../context/PanierContext";
import SearchMouvementStockCritere from "../../components/SearchMouvementStockCritere";


const MouvementStock = () => {
    const [mouvementStocks, setMouvementStocks] = useState([]);
    const [searchInput, SetSearchInput] = useState('');
    const [filters, setFilters] = useState({
        nom: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(5); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const navigate = useNavigate();
    const {  ajouterAuPanier, dejaPresent, nombreDansPanier } = usePanier();

    // Fonction pour récupérer les mouvementStocks avec pagination
    const fetchMouvementStocks = async () => {
        setLoading(true);
        try {
            let data = await MouvementStockService.getMouvementStock(currentPage, pageSize);
            setMouvementStocks(data.content);
            setTotalPages(data.totalPages); 
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };
    // Fonction pour récupérer les mouvementStocks depuis l'API
    const fetchMouvementStockByMotCle = async () => {
        setLoading(true);
        try {
            let data = await MouvementStockService.getMouvementStockByMotCle(searchInput);
            setMouvementStocks(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     fetchMouvementStockByMotCle(searchInput).then(r => console.log(r));
    // }, [searchInput]);


    useEffect(() => {
        fetchMouvementStocks().then(r => r );
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

        MouvementStockService.getMouvementStockDyn(params).then(data => {
            setMouvementStocks(data);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchMouvementStockByMotCle(searchInput).then(r => console.log(r));
    }

    const handleAjouterAuPanier = (mouvementStock) => {
        ajouterAuPanier({ ...mouvementStock, quantite: 1 });
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
            <h1><strong>MouvementStock</strong></h1>


            <HeaderBtnElement titreFil='' variant='outline-primary' onClick={() => navigate('/creer-mouvementStock')}
                              valueBtn='Créer mouvementStock' />



            <SearchMouvementStockCritere
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
                    <th>Réference</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Type de Mouvement</th>
                    <th>Date du Mouvement</th>
                    <th>Commentaire</th>
                </tr>
                </thead>
                <tbody>
                {mouvementStocks.map((mouvementStock) => (
                    <tr key={mouvementStock.id}>
                        <td>
                            <Link to={`/mouvementStocks/${mouvementStock.id}`} className='text-decoration-none'>{mouvementStock.reference}</Link>
                        </td>
                        <td>{mouvementStock.produitId} - {mouvementStock.produitNom}</td>
                        <td>{mouvementStock.quantite}</td>
                        <td>{mouvementStock.typeMouvementCode}</td>
                        <td>{mouvementStock.dateMouvement.substring(0,10)}</td>
                        <td>{mouvementStock.commentaire}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Pagination controls */}

            <Pagination
                currentPage = {currentPage}
                handlePageChange = {handlePageChange}
                totalPages = {totalPages}
                pageSize = {pageSize}
                handlePageSizeChange = {handlePageSizeChange}

            />
        </div>
    );
};

export default MouvementStock;
