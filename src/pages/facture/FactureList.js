import React, {useEffect, useState} from 'react';
import {usePanier} from "../../context/PanierContext";
import apiCrudService from "../../services/ApiCrudService";
import {Button, Form} from "react-bootstrap"
import {Link, useLocation, useNavigate} from "react-router-dom";

import ErrorAlert from "../../exceptions/ErrorAlert";
import AlertComp from "../../components/AlertComp";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import SearchCritereComp from "../../components/SearchCritereComp";
import DataTableComp from "../../components/DataTableComp";
import PaginationComp from "../../components/PaginationComp";
import {formatDate} from "../../utils/dateUtils";


const FactureList = (props) => {
    const [factures, setFactures] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertSupprFacture = queryParams.get("showAlertSupprFacture");
    const [showAlertSupprFacture, setShowAlertSupprFacture] = useState(!!pShowAlertSupprFacture);


    const [searchBar, SetSearchBar] = useState('');
    const [filters, setFilters] = useState({
        actif: true,
        nom: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const [nombreTotalDeLigne, setNombreTotalDeLigne] = useState(0); // Nombre total de pages


    // Fonction pour récupérer les factures depuis l'API
    const fetchFactureByMotCle = async () => {
        setLoading(true);
        try {
            // let data = await FactureService.getFactureByMotCle(searchBar);
            // let data = await apiCrudService.get(`factures/recherche?motCle=${searchBar}`, currentPage, pageSize);
            let data = await apiCrudService.get(`factures?motCle=${searchBar}`, currentPage, pageSize);
            console.log(data)
            setFactures(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
            setNombreTotalDeLigne(data.totalElements)
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     fetchFactureByMotCle(searchBar).then(r => console.log(r));
    // }, [searchBar]);


    useEffect(() => {
        fetchFactureByMotCle().then(r => null);

    }, [currentPage, pageSize]);


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmitFilter = async (e) => {
        e.preventDefault();
        setLoading(true);
        setCurrentPage(0);  // Revenir en première page après un filtre


        try {
            // Filtrer dynamiquement les paramètres non vides
            let params = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value)
            );
            console.log(params)
            const queryString = new URLSearchParams(params).toString();
            // Appel API
            const data = await apiCrudService.get(`factures/recherche-dynamique?${queryString}`);
            setFactures(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
            setNombreTotalDeLigne(data.totalElements)

        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    const removeColumns = (baseColumns, excludedAccessors) => {
        return baseColumns.filter(col => !excludedAccessors.includes(col.accessor));
    };

    const addColumns = (newColumns, baseColumns, includedAccessors) => {
        const columnsToAdd = baseColumns.filter(col => includedAccessors.includes(col.accessor));

        // Ajouter uniquement les colonnes qui ne sont pas déjà dans newColumns
        const updatedColumns = [...newColumns, ...columnsToAdd.filter(col => !newColumns.some(c => c.accessor === col.accessor))];

        return updatedColumns;
    };


    const baseColumns = [
        {
            header: "Numéro", accessor: "numeroFacture", render: (value, facture) => (
                <Link to={`/factures/${facture.idFacture}`} className="text-decoration-none">{value}</Link>
            )
        },
        {
            header: "Vente d'origine", accessor: "venteId", render: (value, facture) => (
                <Link to={`/ventes/${facture.venteId}`} className="text-decoration-none">{value}</Link>
            )
        },
        {header: "Statut", accessor: "etatNom"},
        {header: "Montant total", accessor: "montantTotal"},
        {header: "Mode de paiement", accessor: "modePaiement"},
        {header: "Date de facturation", accessor: "dateFacture", render: (value, facture) => (<> {formatDate(value)} </>)},
        {header: "Date de creation", accessor: "createdAt", render: (value, facture) => (<> {formatDate(value)} </>)},
        {
            header: "Sélectionner", accessor: "onSelect",
            render: (value, facture) => (
                <Button
                    variant="primary"
                    onClick={() => {
                        let cli = {
                            id: facture.id,
                            nom: facture.nom,
                            prenom: facture.prenom,
                            email: facture.email,
                            telephone: facture.telephone
                        };
                        props.onSelect(cli);
                    }}
                >
                    Sélectionner
                </Button>
            )
        },
        {header: "Actif ?", accessor: "actif", render: (value, facture) => (<span> {value ? 'Oui' : 'Non'} </span>)}
    ];

    let columns = removeColumns(baseColumns, []);


    if (!props.onSelect) {
        columns = removeColumns(baseColumns, ['onSelect']);
    } else {
        columns = removeColumns(baseColumns, ['actif', 'creerVente']);
    }

    let searchCriteres = [
        <Form.Select className="mb-3"
                     name="actif"
                     value={filters.actif}
                     onChange={handleInputChange}
                     placeholder="Actif">
            <option>Factures actifs uniquement ?</option>
            <option value={"true"}>Oui</option>
            <option value={"false"}>Non</option>

        </Form.Select>,
        <Form.Control
            type="text"
            value={filters.nom}
            onChange={handleInputChange}
            placeholder="Nom"
            name='nom'
            className="my-1"
        />,
        <Form.Control
            type="text"
            value={filters.prenom}
            onChange={handleInputChange}
            placeholder="Prénom"
            name='prenom'
            className="my-1"
        />
        ,
        <Form.Control
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
        fetchFactureByMotCle(searchBar).then();
    }


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    const handleSearchInput = (e) => {
        SetSearchBar(e.target.value);
    }


    const entetes = [
        {title: "Nombre de ligne", value: nombreTotalDeLigne},
    ];


    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        return <ErrorAlert error={error}/>;
    }
    return (
        <div>
            {showAlertSupprFacture && (
                <AlertComp
                    message="Opération réussie le facture a été suprimé !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertSupprFacture(false)}
                />
            )}

            <h1><strong>Factures</strong></h1>


            <HeaderBtnElementComp titreFil='creer-facture' variant='outline-primary'
                                  valueBtn='Créer facture'/>


            <SearchCritereComp cols={searchCriteres}
                               handleSubmitSearch={handleSubmitSearch}
                               searchInput={searchBar}
                               handleSearchInput={handleSearchInput}
                               handleSubmitFilter={handleSubmitFilter}
            />

            {factures.length > 0 ? (
                <DataTableComp data={factures} columns={columns} entetes={entetes}/>
            ) : (
                <div className="text-center text-muted">Aucun facture trouvé.</div>
            )}
            {/* Pagination controls */}

            <PaginationComp className={"mb-5"}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            handlePageSizeChange={handlePageSizeChange}
                            nombreElt={nombreTotalDeLigne}

            />

            <span className={"mb-5"}></span>


        </div>
    );
};

export default FactureList;
