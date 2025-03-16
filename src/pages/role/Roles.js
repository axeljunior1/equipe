import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import apiCrudService from "../../services/ApiCrudService";
import ErrorAlert from "../../exceptions/ErrorAlert";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import {Pagination} from "react-bootstrap";


const ListRole = () => {
    const [roles, setRoles] = useState([]);



    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const [nombreTotalDeLigne, setNombreTotalDeLigne] = useState(0); // Nombre total de pages
    const navigate = useNavigate();

    // Fonction pour récupérer les role avec pagination
    const fetchRoles = async () => {
        setLoading(true);
        try {
            // let data = await RoleService.getRole(currentPage, pageSize); // on peut ajouter des critères de filtre (nom : desc, description : asc)
            let data = await apiCrudService.get('roles', currentPage, pageSize);
            setRoles(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
            setNombreTotalDeLigne(data.totalElements)
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };


    useEffect(() => {
        fetchRoles().then(r => null);
    }, [currentPage, pageSize]);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }



    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };


    if (error) {
        return <ErrorAlert error={error}/>;
    }

    return (
        <div>

            <h1><strong>Role</strong></h1>


            <HeaderBtnElementComp titreFil='' variant='outline-primary' onClick={() => navigate('/creer-role')}
                                  valueBtn='Créer role'/>



            <h5> Nombre total de ligne : <strong className={"text-danger"}>{nombreTotalDeLigne}</strong> </h5>
            <Table striped bordered hover>
                <thead>
                <tr className="text-center align-middle">
                    <th className="text-center align-middle">Nom</th>
                    <th className="text-center align-middle">Description</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.id} className="text-center align-middle">
                        <td className="text-center align-middle">
                            <Link to={`/roles/${role.id}`} className="text-decoration-none">
                                {role.nom}
                            </Link>
                        </td>
                        <td className="text-center align-middle ">{role.description}</td>
                    </tr>
                ))}
                </tbody>
            </Table>


            {/* Pagination controls */}

            <Pagination className={"mb-5"}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        handlePageSizeChange={handlePageSizeChange}

            />

            <span className={"mb-5"}></span>


        </div>
    );
};

export default ListRole;
