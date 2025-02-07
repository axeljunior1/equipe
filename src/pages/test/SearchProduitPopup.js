import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import ProduitService from "../../services/ProduitService";
import {usePanier} from "../../context/PanierContext";
import Pagination from "../../components/Pagination";
import SearchProduitCritere from "../../components/SearchProduitCritere";

const SearchProduitPopup = ({ onSelect }) => {
    const [produits, setProduits] = useState([]); // Liste des employés

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const {  ajouterAuPanier, dejaPresent, nombreDansPanier } = usePanier();
    const [searchInput, SetSearchInput] = useState('');
    const [filters, setFilters] = useState({
        nom: "",
        description: "",
        stockInitialMin: "",
        stockInitialMax: "",
        prixUnitaireMin: "",
        prixUnitaireMax: "",
    });
    // Fonction pour récupérer les employés via l'API
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
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


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchProduitByMotCle(searchInput).then(r => console.log(r));
    }




    const handleSearchInput = (e)=>{
        SetSearchInput(e.target.value);
    }



    // Recherche des employés lorsqu'on tape dans le champ de recherche
    useEffect(() => {
        fetchProduits();
    }, [currentPage, pageSize]);

    return (
        <div>

            <SearchProduitCritere
                handleSubmitSearch={handleSubmitSearch}
                searchInput={searchInput}
                handleSearchInput={handleSearchInput}
                handleSubmitFilter={handleSubmitFilter}
                filters={filters}
                handleInputChange={handleInputChange}

            />


            <Table striped bordered hover className={'mt-4'} >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {produits.map((produit) => (
                    <tr key={produit.id}>
                        <td>{produit.id}</td>
                        <td>{produit.nom}</td>
                        <td>{produit.description}</td>
                        <td>
                            <Button variant="primary" onClick={() => onSelect(produit.id, produit.nom, produit.prixUnitaire, )}>
                                Sélectionner
                            </Button>
                        </td>
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

export default SearchProduitPopup;
