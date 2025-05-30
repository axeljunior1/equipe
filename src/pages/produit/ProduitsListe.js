import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import {Button, Col, Form} from "react-bootstrap";
import {usePanier} from "../../context/PanierContext";
import PaginationComp from "../../components/PaginationComp";
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
    const {panier, ajouterAuPanier, nombreProduitDansPanier,loadingPanier, errorPanier } = usePanier();
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

    const increaseCart = async (produit) => {
        await ajouterAuPanier({
            prixVente: produit.prixVente,
            produitId: produit.id,
            quantite: nombreProduitDansPanier(produit.id) + 1,
            formatVenteId : produit.formatVenteId,
        })
    }
    const decreaseCart = async (produit) => {
        if (nombreProduitDansPanier(produit.id) === 1) {
            // nothing
        }else{
            await ajouterAuPanier({
                prixVente: produit.prixVente,
                produitId: produit.id,
                quantite: nombreProduitDansPanier(produit.id) - 1,
                formatVenteId : produit.formatVenteId,
            })
        }
    }


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
                            prixAchat: produit.prixAchat,
                            prixVente: produit.prixVente
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
                        onClick={() => increaseCart(produit)}
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
                            quantite: quantites[produit.id],
                            formatVenteId : produit.formatVenteId,
                        })}
                        className="d-inline-block text-center"
                        style={{width: "80px"}}
                    />

                    <Button
                        variant="outline-info" className=' fw-bold ms-3'
                        onClick={() => decreaseCart(produit)}
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
        {
            type: "select",
            name: "actif",
            placeholder: "Produits actifs uniquement ?",
            options: [
                { value: "true", label: "Oui" },
                { value: "false", label: "Non" }
            ]
        },
        {
            type: "text",
            name: "nom",
            placeholder: "Nom"
        },
        {
            type: "text",
            name: "description",
            placeholder: "Description"
        },
        {
            type: "text",
            name: "prixUnitaireMin",
            placeholder: "Prix Unitaire Min"
        },
        {
            type: "text",
            name: "prixUnitaireMax",
            placeholder: "Prix Unitaire Max"
        },
        {
            type: "text",
            name: "stockInitialMin",
            placeholder: "Stock Initial Min"
        },
        {
            type: "text",
            name: "stockInitialMax",
            placeholder: "Stock Initial Max"
        }
    ];



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

    if (loadingPanier || loading) {
        return <h1>Chargement en cours...</h1>;
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

            <h1><strong>Produits : </strong></h1>

            {error && (<p className={"text-danger"}> {error} </p>)}
            {errorPanier && (<p className={"text-danger"}> {errorPanier} </p>)}

            <ToastContainer />


            <HeaderBtnElementComp titreFil='creer-produit' variant='outline-primary'
                                  valueBtn='Créer produit'/>


            <SearchCritereComp cols={cols}
                               handleSubmitSearch={handleSubmitSearch}
                               searchInput={searchInput}
                               handleSearchInput={handleSearchInput}
                               handleSubmitFilter={handleSubmitFilter}
                               filters={filters} setFilters={setFilters} handleInputChange={handleInputChange}
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
