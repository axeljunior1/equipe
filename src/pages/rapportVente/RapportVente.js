import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Button, Col, Form, FormLabel, Row} from "react-bootstrap";
import PaginationComp from "../../components/PaginationComp";
import apiCrudService from "../../services/ApiCrudService";
import ErrorAlert from "../../exceptions/ErrorAlert";
import DataTableComp from "../../components/DataTableComp";
import SearchCritereComp from "../../components/SearchCritereComp";
import {formatDate} from "../../utils/dateUtils";


const RapportVente = (props) => {
    const [rapportVentes, setRapportVentes] = useState([]);



    const [searchInput, SetSearchInput] = useState('');
    const [filters, setFilters] = useState({
        start: undefined,
        end: undefined,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const [nombreTotalDeLigne, setNombreTotalDeLigne] = useState(0); // Nombre total de pages


    // Fonction pour récupérer les rapportVentes depuis l'API
    const fetchRapportVentes = async (period) => {
        console.log('period', period);
        setLoading(true);
        try {
            let elt = period
            if (!period){
                elt = setPeriod('day', elt);
                setFilters(elt)
            }
            // let data = await ProduitService.getProduitByMotCle(searchInput);
            let data = await apiCrudService.post(`rapport-ventes`, elt);
            setRapportVentes(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
            setNombreTotalDeLigne(data.totalElements)
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
        fetchRapportVentes().then(r => null);

    }, [currentPage, pageSize]);

    function setPeriod(period) {
        const now = new Date();
        let start, end;

        if (period === 'day') {
            // Utilisation de Date.UTC pour créer la date en UTC
            start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
            end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));

        } else if (period === 'week') {
            // Calculez le lundi de la semaine en heure locale
            const dayOfWeek = now.getDay(); // 0 (dimanche) à 6 (samedi)
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            start = new Date(now);
            start.setDate(now.getDate() + diffToMonday);
            start.setHours(0, 0, 0, 0);
            // Convertir le début en UTC
            start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0));

            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            // On reconvertit en UTC
            end = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999));

        } else if (period === 'month') {
            // Début et fin du mois en heure locale, puis conversion en UTC
            start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0));
            end = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999));

        } else if (period === 'year') {
            // Début et fin de l'année en heure locale, puis conversion en UTC
            start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0));
            end = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999));

        } else {
            throw new Error("Période non reconnue. Utilisez 'jour', 'semaine', 'mois' ou 'année'.");
        }

        let obj = {}
        // Affecter les dates en format ISO
        obj.start = start.toISOString();
        obj.end = end.toISOString();
        return obj;
    }


    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


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

            if (filters.start === undefined || filters.end === undefined) {
                throw new Error("Please enter a start date");
            }
            // Appel API
            const data = await apiCrudService.post(`rapport-ventes`, filters);
            setRapportVentes(data.content);  // Assuming 'content' is the array of products
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

/*    {
        "prixAchat": 223,
        "prixVente": 179.99,
        "nombreVentes": 1,
        "premiereVente": "2025-03-18T07:18:50.187475",
        "margeTotale": -86.02,
        "quantiteTotale": 2,
        "derniereVente": "2025-03-18T07:18:50.187475",
        "idProduit": 1,
        "nomProduit": "Aspirateur sans fil",
        "montantVenteTotal": 359.98
    }*/

    const baseColumns = [
        {
            header: "Id du produit", accessor: "idProduit", render: (value, produit) => (
                <Link to={`/produits/${value}`} className="text-decoration-none">{value}-{produit.nomProduit}</Link>
            )
        },
        {header: "Prix Achat", accessor: "prixAchat"},

        {header: "Prix Vente", accessor: "prixVente"},
        {header: "Quantité", accessor: "quantiteTotale"},
        {header: "Montant Vente Total", accessor: "montantVenteTotal"},
        {header: "Marge realisé", accessor: "margeTotale"},
        {header: "Nombre Ventes", accessor: "nombreVentes"}
    ];


    let columns = removeColumns(baseColumns, []);

    if(!props.onSelect  ){
        columns = removeColumns(baseColumns, ['onSelect']);
    }else{
        columns = removeColumns(baseColumns, ['prixVente', 'stockInitial', 'panier']);
    }



    let cols = [
        <>

            <FormLabel > Début </FormLabel>
            <Form.Control
                type="datetime-local"
                value={filters.start}
                onChange={handleInputChange}
                placeholder="Début"
                name='start' required={true}
                className="my-1 "
            />
        </>,
        <>
            <FormLabel > Fin </FormLabel>

            <Form.Control
                type="datetime-local"
                value={filters.end}
                onChange={handleInputChange}
                placeholder="Fin"
                name='end' required={true}
                className="my-1 "
            />
        </>
    ]


    const handleSubmitSearch = async (e) => {
        e.preventDefault();
        fetchRapportVentes().then();
    }


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    const handleSearchInput = (e) => {
        SetSearchInput(e.target.value);
    }


    const entetes = [
        {title: "Nombre de ligne", value: nombreTotalDeLigne},
        {title: "Marge total réalisé", value: rapportVentes.reduce((total, item) => total + (item.margeTotale || 0), 0)},
    ];

    const handleRapport = async (period) => {
        let elt = {}
        elt = setPeriod(period);
        setFilters({...filters, start: elt.start, end: elt.end});
        await fetchRapportVentes(elt)
    }


    if (error) {
        return <ErrorAlert error={error}/>;
    }
    return (
        <div>

            <h1><strong>Rapport des ventes </strong></h1>

            {/*<HeaderBtnElementComp titreFil='creer-produit' variant='outline-primary'*/}
            {/*                      valueBtn='Créer produit'/>*/}




            <SearchCritereComp cols={cols}
                               searchInput={searchInput}
                               handleSearchInput={handleSearchInput}
                               handleSubmitFilter={handleSubmitFilter}
            />

            <Row className="my-3">
                <Col xs={3}> <Button variant="outline-primary" onClick={() => handleRapport('day')}> Jour </Button> </Col>
                <Col xs={3}> <Button variant="outline-primary" onClick={() => handleRapport('week')}> Semaine  </Button> </Col>
                <Col xs={3}> <Button variant="outline-primary" onClick={() => handleRapport('month')}> Mois </Button> </Col>
                <Col xs={3}> <Button variant="outline-primary" onClick={() => handleRapport('year')}> Année </Button> </Col>
            </Row>

            {rapportVentes.length > 0 ? (
                <DataTableComp data={rapportVentes} columns={columns} entetes={entetes} />
            ) : (
                <div className="text-center text-muted">Aucun produit trouvé.</div>
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

export default RapportVente;
