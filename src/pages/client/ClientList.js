import React, {useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap"
import {Link, useLocation} from "react-router-dom";

import ErrorAlert from "../../exceptions/ErrorAlert";
import AlertComp from "../../components/AlertComp";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import SearchCritereComp from "../../components/SearchCritereComp";
import DataTableComp from "../../components/DataTableComp";
import PaginationComp from "../../components/PaginationComp";
import {formatDate} from "../../utils/dateUtils";
import useClient from "../../hooks/useClients";
import PropTypes from "prop-types";


const ClientList = (props) => {
    ClientList.propTypes = {
        onSelect: PropTypes.func,
    };


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertSupprClient = queryParams.get("showAlertSupprClient");
    const [showAlertSupprClient, setShowAlertSupprClient] = useState(!!pShowAlertSupprClient);


    const [searchBar, setSearchBar] = useState('');
    const [filters, setFilters] = useState({
        actif: true,
        nom: "",
        description: ""
    });
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page

    const {
        clients,
        loading,
        error,
        fetchByMotCle,
        fetchByParams,
        totalPages,
        totalElements
    } = useClient();


    // Fonction pour récupérer les clients depuis l'API
    const fetchClientByMotCle = async (motcle = searchBar) => {
        await fetchByMotCle(motcle, currentPage, pageSize);
    };


    useEffect(() => {
        fetchClientByMotCle().then();

    }, [currentPage, pageSize]);


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmitFilter = async (e) => {
        e.preventDefault();

        // Filtrer dynamiquement les paramètres non vides
        let params = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value && value !== "")
        );

        // Appel API
         await fetchByParams(params);
    };


    const removeColumns = (baseColumns, excludedAccessors) => {
        return baseColumns.filter(col => !excludedAccessors.includes(col.accessor));
    };




    const baseColumns = [
        {
            header: "Nom", accessor: "nom", render: (value, client) => (
                <Link to={`/clients/${client.id}`} className="text-decoration-none">{value}</Link>
            )
        },
        {header: "Prénom", accessor: "prenom"},
        {header: "Telephone", accessor: "telephone"},
        {header: "Email", accessor: "email"},
        {header: "Date de creation", accessor: "createdAt", render: (value, client) => (<> {formatDate(value)} </>)},
        {
            header: "Sélectionner", accessor: "onSelect",
            render: (value, client) => (
                <Button
                    variant="primary"
                    onClick={() => {
                        let cli = {
                            id: client.id,
                            nom: client.nom,
                            prenom: client.prenom,
                            email: client.email,
                            telephone: client.telephone
                        };
                        props.onSelect(cli);
                    }}
                >
                    Sélectionner
                </Button>
            )
        },
        {header: "Actif ?", accessor: "actif", render: (value, client) => (<span> {value ? 'Oui' : 'Non'} </span>)},
        {
            header: "Cree une vente", accessor: "creerVente", render: (value) => (
                <span className="fw-bold text-success">
                    <Button variant={"outline-primary"} onClick={() => null}>
                        Cree une vente
                    </Button>
                </span>
            )
        }
    ];

    let columns;


    if (!props.onSelect) {
        columns = removeColumns(baseColumns, ['onSelect']);
    } else {
        columns = removeColumns(baseColumns, ['actif', 'creerVente']);
    }

    let cols = [
        <Form.Select className="mb-3" key={filters.actif}
                     name="actif"
                     value={filters.actif}
                     onChange={handleInputChange}
                     placeholder="Actif">
            <option>Clients actifs uniquement ?</option>
            <option value={"true"}>Oui</option>
            <option value={"false"}>Non</option>

        </Form.Select>,
        <Form.Control key={filters.nom}
            type="text"
            value={filters.nom}
            onChange={handleInputChange}
            placeholder="Nom"
            name='nom'
            className="my-1"
        />,
        <Form.Control key={filters.prenom}
            type="text"
            value={filters.prenom}
            onChange={handleInputChange}
            placeholder="Prénom"
            name='prenom'
            className="my-1"
        />
        ,
        <Form.Control key={filters.description}
            type="text"
            value={filters.description}
            onChange={handleInputChange}
            placeholder="Description"
            name='description'
            className="my-1 "
        />
    ]


    const handleSubmitSearch = async (e) => {
        e.preventDefault();
        fetchClientByMotCle(searchBar).then();
    }


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    const handleSearchInput = (e) => {
        setSearchBar(e.target.value);
    }


    const entetes = [
        {title: "Nombre de ligne", value: totalElements},
    ];


    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        return <ErrorAlert error={error}/>;
    }
    return (
        <div>
            {showAlertSupprClient && (
                <AlertComp
                    message="Opération réussie le client a été suprimé !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertSupprClient(false)}
                />
            )}

            <h1><strong>Clients</strong></h1>


            <HeaderBtnElementComp titreFil='creer-client' variant='outline-primary'
                                  valueBtn='Créer client'/>


            <SearchCritereComp cols={cols}
                               handleSubmitSearch={handleSubmitSearch}
                               searchInput={searchBar}
                               handleSearchInput={handleSearchInput}
                               handleSubmitFilter={handleSubmitFilter}
            />

            {clients.length > 0 ? (
                <DataTableComp data={clients} columns={columns} entetes={entetes}/>
            ) : (
                <div className="text-center text-muted">Aucun client trouvé.</div>
            )}
            {/* Pagination controls */}

            <PaginationComp className={"mb-5"}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            handlePageSizeChange={handlePageSizeChange}
                            nombreElt={totalElements}

            />

            <span className={"mb-5"}></span>


        </div>
    );
};

export default ClientList;
