import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import ProduitService from "../services/ProduitService";
import HeaderBtnElement from "../components/HeaderBtnElement";
import {Button} from "react-bootstrap";
import {usePanier} from "../context/PanierContext";
import Pagination from "../components/Pagination";
import SearchProduitCritere from "../components/SearchProduitCritere";


const ListProduit = () => {
    const [produits, setProduits] = useState([]);
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

    // Fonction pour récupérer les produits avec pagination
    const fetchProduits = async () => {
        setLoading(true);
        try {
            let data = await ProduitService.getProduit(currentPage, pageSize);
            setProduits(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };
    // Fonction pour récupérer les produits depuis l'API
    const fetchProduitByMotCle = async () => {
        setLoading(true);
        try {
            let data = await ProduitService.getProduitByMotCle(searchInput);
            setProduits(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     fetchProduitByMotCle(searchInput).then(r => console.log(r));
    // }, [searchInput]);


    useEffect(() => {
        fetchProduits().then(r => null );
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

        ProduitService.getProduitDyn(params).then(data => {
            setProduits(data);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchProduitByMotCle(searchInput).then(r => console.log(r));
    }

    const handleAjouterAuPanier = (produit) => {
        ajouterAuPanier({ ...produit, quantite: 1 });
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
            <h1><strong>Produit</strong></h1>


            <HeaderBtnElement titreFil='' variant='outline-primary' onClick={() => navigate('/creer-produit')}
                              valueBtn='Créer produit' />



            <SearchProduitCritere
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
                {produits.map((produit, index) => (
                    <tr key={produit.id}>
                        <td>
                            <Link to={`/produits/${produit.id}`} className='text-decoration-none'>{produit.nom}</Link>
                        </td>
                        <td>{produit.description}</td>
                        <td>{produit.stockInitial}</td>
                        <td>{produit.prixUnitaire}</td>
                        <td><Button
                            variant="" className={'w-100 text-primary fw-bold'}
                            onClick={() => handleAjouterAuPanier(produit)} >
                            {dejaPresent(produit) ? ( <span> Ajouter (1) au panier 🧺 <span className={'text-danger'}> { nombreDansPanier(produit)} </span> </span> ):( <span>Ajouter au panier 🧺 </span>)}
                        </Button> </td>
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

export default ListProduit;
