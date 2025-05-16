import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import PaginationComp from "../../components/PaginationComp";
import useAuthority from "../../hooks/useAuthority";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";


const ListAuthority = () => {
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
    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE); // Taille de la page
    const navigate = useNavigate();
    const {
        authorities, loading, error, fetchAllAuthorities, totalElements, totalPages} = useAuthority()

    // Fonction pour récupérer les autorisations avec pagination
    const fetchAuth = async () => {
        await fetchAllAuthorities(currentPage, pageSize);
    };




    useEffect(() => {
        fetchAuth();
    }, [currentPage, pageSize]);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
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
        // await fetchByParams(params)
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        // fetchAutorisationByMotCle(searchInput).then(r => console.log(r));
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
            <h1><strong>Autorisation</strong></h1>


            <HeaderBtnElementComp titreFil='creer-autorisation' variant='outline-primary'
                                  valueBtn='Créer Autorisation'/>

            {error && <p className={"text-danger"}> {error} </p>}
{/*
            <SearchAutorisationCritere
                handleSubmitSearch={handleSubmitSearch}
                searchInput={searchInput}
                handleSearchInput={handleSearchInput}
                handleSubmitFilter={handleSubmitFilter}
                filters={filters}
                handleInputChange={handleInputChange}

            />*/}

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {authorities.map((authoritie) => (
                    <tr key={authorities.id}>
                        <td>
                            <Link to={`/autorisations/${authoritie.id}`} className='text-decoration-none'>{authoritie.nom}</Link>
                        </td>
                        <td>{authoritie.description}</td>
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

            />
        </div>
    );
};

export default ListAuthority;
