import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import CategorieService from "../services/CategorieService";
import HeaderBtnElement from "../components/HeaderBtnElement";
import {Accordion, Button, Col, Container, Form, Row} from "react-bootstrap";
import {usePanier} from "../context/PanierContext";
import Pagination from "../components/Pagination";
import SearchCategorieCritere from "../components/SearchCategorieCritere";


const ListCategories = () => {
    const [categories, setCategories] = useState([]);
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

    // Fonction pour récupérer les categories avec pagination
    const fetchCategories = async () => {
        setLoading(true);
        console.log("test")
        try {
            let data = await CategorieService.getCategories(currentPage, pageSize);
            setCategories(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };
    // Fonction pour récupérer les categories depuis l'API
    const fetchCategorieByMotCle = async () => {
        setLoading(true);
        try {
            let data = await CategorieService.getCategorieByMotCle(searchInput);
            setCategories(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     fetchCategorieByMotCle(searchInput).then(r => console.log(r));
    // }, [searchInput]);


    useEffect(() => {
        fetchCategories().then(r => null );
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

        CategorieService.getCategorieDyn(params).then(data => {
            setCategories(data);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchCategorieByMotCle(searchInput).then(r => console.log(r));
    }

    const handleAjouterAuPanier = (categorie) => {
        ajouterAuPanier({ ...categorie, quantite: 1 });
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
            <h1><strong>Categorie</strong></h1>


            <HeaderBtnElement titreFil='' variant='outline-primary' onClick={() => navigate('/creer-categorie')}
                              valueBtn='Créer categorie' />



            <SearchCategorieCritere
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
                </tr>
                </thead>
                <tbody>
                {categories.map((categorie, index) => (
                    <tr key={categorie.id}>
                        <td>
                            <Link to={`/categories/${categorie.id}`} className='text-decoration-none'>{categorie.nom}</Link>
                        </td>
                        <td>{categorie.description}</td>
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

export default ListCategories;
