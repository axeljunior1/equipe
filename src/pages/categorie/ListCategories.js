import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import PaginationComp from "../../components/PaginationComp";
import SearchCategorieCritere from "../../components/SearchCategorieCritere";
import useCategory from "../../hooks/useCategory";


const ListCategories = () => {
    const [searchInput,setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        nom: "",
        description: "",
        stockInitialMin: "",
        stockInitialMax: "",
        prixUnitaireMin: "",
        prixUnitaireMax: "",
    });
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(5); // Taille de la page
    const navigate = useNavigate();
    const {
        categories, loading, error, fetchCategories: fetchCats,  fetchByMotCle, fetchByParams,
        totalPages} = useCategory()

    // Fonction pour récupérer les categories avec pagination
    const fetchCategories = async () => {
        await fetchCats(currentPage, pageSize);
    };

    // Fonction pour récupérer les categories depuis l'API
    const fetchCategorieByMotCle = async (motCle = searchInput) => {
            await fetchByMotCle(motCle);
    };



    useEffect(() => {
        fetchCategories().then();
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

        // Construire dynamiquement les paramètres de la requête
        const params = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== "")
        );
        await fetchByParams(params)
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchCategorieByMotCle(searchInput).then(r => console.log(r));
    }


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    const handleSearchInput = (e)=>{
        setSearchInput(e.target.value);
    }

    return (
        <div>
            <h1><strong>Categorie</strong></h1>


            <HeaderBtnElementComp titreFil='' variant='outline-primary' onClick={() => navigate('/creer-categorie')}
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
                {categories.map((categorie) => (
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

export default ListCategories;
