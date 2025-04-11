import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import {Button, Col, Form} from "react-bootstrap";
import {usePanier} from "../../context/PanierContext";
import PaginationComp from "../../components/PaginationComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import AlertComp from "../../components/AlertComp";
import DataTableComp from "../../components/DataTableComp";
import SearchCritereComp from "../../components/SearchCritereComp";
import useProduct from "../../hooks/useProduct";
import {DEFAULT_PAGINATION_SIZE} from "../../utils/constants";
import {ToastContainer} from "react-toastify";
import PropTypes from "prop-types";


const ProduitListe = (props) => {


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertSupprProduit = queryParams.get("showAlertSupprProduit");
    const [showAlertSupprProduit, setShowAlertSupprProduit] = useState(!!pShowAlertSupprProduit);


    const [searchInput,setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        actif: true,
        nom: "",
        description: "",
        stockInitialMin: "",
        stockInitialMax: "",
        prixUnitaireMin: "",
        prixUnitaireMax: "",
    });
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE); // Taille de la page
    const {panier, ajouterAuPanier, nombreProduitDansPanier} = usePanier();
    const [quantites, setQuantites] = useState({});
    const {produits, loading, error, totalElements, totalPages, fetchByMotCle, fetchByParams} = useProduct();


    // Fonction pour récupérer les produits depuis l'API
    const fetchProduitByMotCle = async () => {

        await fetchByMotCle(searchInput, currentPage, pageSize);
    };


    useEffect(() => {
        const quantites = produits.reduce((acc, element) => {
            acc[element.id] = nombreProduitDansPanier(element.id);
            return acc;
        }, {});
        setQuantites(quantites);
    }, [produits]);


    useEffect(() => {
        fetchProduitByMotCle().then();

    }, [currentPage, pageSize, panier]);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };

    const handleSubmitFilter = async (e) => {
        e.preventDefault();
        setCurrentPage(0);  // Revenir en première page après un filtre

        // Filtrer dynamiquement les paramètres non vides
        let params = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value)
        );
        console.log(params)
        // const queryString = new URLSearchParams(params).toString();
        // Appel API
        await fetchByParams(params);

    };


    const removeColumns = (baseColumns, excludedAccessors) => {
        return baseColumns.filter(col => !excludedAccessors.includes(col.accessor));
    };

    const baseColumns = [
        {
            header: "Nom", accessor: "nom", render: (value, produit) => (
                <Link to={`/produits/${produit.id}`} className="text-decoration-none">{value}</Link>
            )
        },
        {header: "Description", accessor: "description"},
        {
            header: "Sélectionner", accessor: "onSelect",
            render: (value, produit) => (
                <Button
                    variant="primary"
                    onClick={() => {
                        let pro = {
                            id: produit.id,
                            nom: produit.nom,
                            prixAchat: produit.prixAchat
                        };
                        props.onSelect(pro);
                    }}
                >
                    Sélectionner
                </Button>
            )
        },

        {header: "Prix Unitaire", accessor: "prixVente"},
        {header: "Stock Initial", accessor: "stockInitial"},
        {
            header: "Stock Courant", accessor: "stockCourant", render: (value) => (
                <span className="fw-bold text-success">{value}</span>
            )
        },
        {
            header: "Panier 🛒", accessor: "panier", render: (_, produit) => (
                <Col sm={12}>
                    <Button
                        variant="outline-primary" className='fw-bold me-3'
                        onClick={() => ajouterAuPanier({

                            prixVente: produit.prixVente,
                            produitId: produit.id,
                            quantite: nombreProduitDansPanier(produit.id) + 1
                        })}
                    >
                        +
                    </Button>

                    <Form.Control
                        type="number"
                        value={quantites[produit.id]}
                        onChange={(e) => handleChangeNbProPanier(produit.id, e.target.value)}
                        onBlur={() => handleBlur({

                            prixVente: produit.prixVente,
                            produitId: produit.id,
                            quantite: quantites[produit.id]
                        })}
                        className="d-inline-block text-center"
                        style={{width: "80px"}}
                    />

                    <Button
                        variant="outline-info" className=' fw-bold ms-3'
                        onClick={() => ajouterAuPanier({
                            prixVente: produit.prixVente,
                            produitId: produit.id,
                            quantite: nombreProduitDansPanier(produit.id) - 1
                        })}
                    >
                        -
                    </Button>
                </Col>
            )
        }
    ];

    const handleChangeNbProPanier = (id, val) => {
        setQuantites({...quantites, [id]: val});
    }
    const handleBlur = (item) => {
        ajouterAuPanier(item)
    }


    let columns = removeColumns(baseColumns, []);

    if (props.onSelect) {
        columns = removeColumns(baseColumns, ['prixVente', 'stockInitial', 'panier']);
    }


    if (!props.onSelect){
        columns = removeColumns(baseColumns, ['onSelect']);
    }


    let cols = [
        <Form.Select className="mb-3" key={"actif"}
                     name="actif"
                     value={filters.actif}
                     onChange={handleInputChange}
                     placeholder="Actif">
            <option>Produits actifs uniquement ?</option>
            <option value={"true"}>Oui</option>
            <option value={"false"}>Non</option>

        </Form.Select>,
        <Form.Control
            type="text" key={"nom"}
            value={filters.nom}
            onChange={handleInputChange}
            placeholder="Nom"
            name='nom'
            className="my-1"
        />
        ,
        <Form.Control key={"description"}
            type="text"
            value={filters.description}
            onChange={handleInputChange}
            placeholder="Description"
            name='description'
            className="my-1 "
        />,
        <Form.Control key={"prixUnitaireMin"}
            type="text"
            value={filters.prixUnitaireMin}
            onChange={handleInputChange}
            placeholder="Prix Unitaire Min"
            name='prixUnitaireMin'
            className="my-1 "
        />,
        <Form.Control key={"prixUnitaireMax"}
            type="text"
            value={filters.prixUnitaireMax}
            onChange={handleInputChange}
            placeholder="Prix Unitaire Max"
            name='prixUnitaireMax'
            className="my-1 "
        />,
        <Form.Control key={"stockInitialMin"}
            type="text"
            value={filters.stockInitialMin}
            onChange={handleInputChange}
            placeholder="Stock Initial Min"
            name='stockInitialMin'
            className="my-1 "
        />,
        <Form.Control key={"stockInitialMax"}
            type="text"
            value={filters.stockInitialMax}
            onChange={handleInputChange}
            placeholder="Stock Initial Max"
            name='stockInitialMax'
            className="my-1 "
        />
    ]


    const handleSubmitSearch = async (e) => {
        e.preventDefault();
        fetchProduitByMotCle().then();
    }


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    }


    const entetes = [
        {title: "Nombre de ligne", value: totalElements},
    ];


    if (error) {
        return <ErrorAlert error={error}/>;
    }
    return (
        <div>


            {showAlertSupprProduit && (
                <AlertComp
                    message="Opération réussie le produit a été suprimé !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertSupprProduit(false)}
                />
            )}

            <h1><strong>Produits</strong></h1>

            <ToastContainer />


            <HeaderBtnElementComp titreFil='creer-produit' variant='outline-primary'
                                  valueBtn='Créer produit'/>


            <SearchCritereComp cols={cols}
                               handleSubmitSearch={handleSubmitSearch}
                               searchInput={searchInput}
                               handleSearchInput={handleSearchInput}
                               handleSubmitFilter={handleSubmitFilter}
            />

            {produits.length > 0 ? (
                <DataTableComp data={produits} columns={columns} entetes={entetes}/>
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
                            nombreElt={totalElements}

            />

            <span className={"mb-5"}></span>


        </div>
    );
};

ProduitListe.propTypes = {
    onSelect: PropTypes.func,
};


export default ProduitListe;
