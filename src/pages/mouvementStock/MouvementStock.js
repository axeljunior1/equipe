import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import MouvementStockService from "../../services/MouvementStockService";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import SearchMouvementStockCritere from "../../components/SearchMouvementStockCritere";
import apiCrudService from "../../services/ApiCrudService";
import PaginationComp from "../../components/PaginationComp";
import {formatDate} from "../../utils/dateUtils";


const MouvementStock = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const [mouvementStocks, setMouvementStocks] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [produit, setProduit] = useState({});
    const [filters, setFilters] = useState({
        nom: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(99); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const [nombreTotalDeLigne, setNombreTotalDeLigne] = useState(0); // Nombre total de pages
    const navigate = useNavigate();

    // Fonction pour récupérer les mouvementStocks avec pagination
    const fetchMouvementStocks = async () => {
        setLoading(true);
        try {
            let data = {}
            if (!id) {
                data = await MouvementStockService.getMouvementStock(currentPage, pageSize);

            } else {
                data = await MouvementStockService.getMouvementStocksByProduitId(id, currentPage, pageSize);
                let produit = await apiCrudService.getById("produits", id);
                setProduit(produit);
            }
            setNombreTotalDeLigne(data.totalElements)
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
        fetchMouvementStocks().then(r => r);
    }, [currentPage, pageSize]);

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


    const onHandlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const onHandlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    }

    const chooseTypeEveOrigine = (typeMouvementCode) => {
        if (typeMouvementCode === "ACHAT_MARCHANDISE") return "achats"
        if (typeMouvementCode === "VENTE_PRODUIT") return "ventes"
    };
    return (
        <div>
            <h1><strong>Mouvement de Stock {id && <> du produit : <span
                className={"text-danger fw-bold"}>{mouvementStocks[0].produitNom}  </span> </>} </strong></h1>


            <HeaderBtnElementComp titreFil='' variant='outline-primary' onClick={() => navigate('/creer-mouvementStock')}
                                  valueBtn='Créer mouvementStock'/>


            <SearchMouvementStockCritere
                handleSubmitSearch={handleSubmitSearch}
                searchInput={searchInput}
                handleSearchInput={handleSearchInput}
                handleSubmitFilter={handleSubmitFilter}
                filters={filters}
                handleInputChange={handleInputChange}

            />


            <div className="my-2 fw-bold">
                <Row>
                    <Col xs={12}> Nombre total :<span
                        className="fw-bold text-danger"> {nombreTotalDeLigne} </span></Col>
                    {id &&
                        <>
                            <Col xs={12}> Stock initial :<span
                                className="fw-bold text-danger">{produit.stockInitial} </span></Col>
                            <Col xs={12}> Stock courant à la date du jour :<span
                                className="fw-bold text-danger"> {produit.stockCourant} </span></Col>
                        </>
                    }
                </Row>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Réference</th>
                    <th>Événement d'origine</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    {/*<th>Type de Mouvement</th>*/}
                    <th>Date du Mouvement</th>
                    <th>Commentaire</th>
                </tr>
                </thead>
                <tbody>
                {mouvementStocks.map((mouvementStock) => (
                    <tr key={mouvementStock.id}>
                        <td className='text-decoration-none'>{mouvementStock.reference}
                        </td>
                        <td>
                            <Link
                                to={`/${chooseTypeEveOrigine(mouvementStock.typeMouvementCode)}/${mouvementStock.sourceId}`}
                                className='text-decoration-none'>{mouvementStock.sourceType} - {mouvementStock.sourceId}</Link>
                        </td>
                        <td>
                            <Link to={`/produits/${mouvementStock.produitId}`}
                                  className='text-decoration-none'>{mouvementStock.produitId} - {mouvementStock.produitNom}</Link>
                        </td>

                        <td className={mouvementStock.typeMouvement !== 'ENTREE' ? 'text-danger fw-bold' : 'text-success fw-bold'}>{mouvementStock.quantite}</td>
                        {/*<td>{mouvementStock.typeMouvementCode}</td>*/}
                        <td>{ formatDate(mouvementStock.dateMouvement)}</td>
                        <td>{mouvementStock.commentaire}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Pagination controls */}

            <PaginationComp
                currentPage={currentPage}
                handlePageChange={onHandlePageChange}
                totalPages={totalPages}
                pageSize={pageSize}
                handlePageSizeChange={onHandlePageSizeChange}

            />
        </div>
    );
};

export default MouvementStock;
