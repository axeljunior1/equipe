import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import {Button, Col, Form} from "react-bootstrap";
import {usePanier} from "../../context/PanierContext";
import PaginationComp from "../../components/PaginationComp";
import apiCrudService from "../../services/ApiCrudService";
import ErrorAlert from "../../exceptions/ErrorAlert";
import AlertComp from "../../components/AlertComp";
import DataTableComp from "../../components/DataTableComp";
import SearchCritereComp from "../../components/SearchCritereComp";


const ProduitListe = (props) => {
    const [produits, setProduits] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertSupprProduit = queryParams.get("showAlertSupprProduit");
    const [showAlertSupprProduit, setShowAlertSupprProduit] = useState(!!pShowAlertSupprProduit);


    const [searchInput, SetSearchInput] = useState('');
    const [filters, setFilters] = useState({
        actif: true,
        nom: "",
        description: "",
        stockInitialMin: "",
        stockInitialMax: "",
        prixUnitaireMin: "",
        prixUnitaireMax: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const [nombreTotalDeLigne, setNombreTotalDeLigne] = useState(0); // Nombre total de pages
    const navigate = useNavigate();
    const {ajouterAuPanier, nombreProduitDansPanier} = usePanier();

    // Fonction pour récupérer les produits avec pagination
    /*  const fetchProduits = async () => {
          setLoading(true);
          try {
              // let data = await ProduitService.getProduit(currentPage, pageSize); // on peut ajouter des critères de filtre (nom : desc, description : asc)
              let data = await apiCrudService.get('produits', currentPage, pageSize);
              setProduits(data.content);  // Assuming 'content' is the array of products
              setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
              setNombreTotalDeLigne(data.totalElements)
          } catch (error) {
              setError(error);
          } finally {
              setLoading(false);
          }

      };*/
    // Fonction pour récupérer les produits depuis l'API
    const fetchProduitByMotCle = async () => {
        setLoading(true);
        try {
            // let data = await ProduitService.getProduitByMotCle(searchInput);
            let data = await apiCrudService.get(`produits/recherche?motCle=${searchInput}`, currentPage, pageSize);
            setProduits(data.content);  // Assuming 'content' is the array of products
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
        fetchProduitByMotCle().then(r => null);

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
        setCurrentPage(0);  // Revenir en première page après un filtre


        try {
            // Filtrer dynamiquement les paramètres non vides
            let params = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value)
            );
            console.log(params)
            const queryString = new URLSearchParams(params).toString();
            // Appel API
            const data = await apiCrudService.get(`produits/recherche-dynamique?${queryString}`);
            setProduits(data.content);  // Assuming 'content' is the array of products
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

    const baseColumns = [
        {
            header: "Nom", accessor: "nom", render: (value, produit) => (
                <Link to={`/produits/${produit.id}`} className="text-decoration-none">{value}</Link>
            )
        },
        {header: "Description", accessor: "description"},
        {header: "Sélectionner", accessor: "onSelect",
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
                    <span className="fw-bold">
                    {nombreProduitDansPanier(produit.id)}
                    </span>
                    {/*
                    Todo: ajouter le prix d'achat ici
                    */}
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


    let columns = removeColumns(baseColumns, []);

    if(!props.onSelect  ){
        columns = removeColumns(baseColumns, ['onSelect']);
    }else{
        columns = removeColumns(baseColumns, ['prixVente', 'stockInitial', 'panier']);
    }



    let cols = [
        <Form.Select className="mb-3"
                     name="actif"
                     value={filters.actif}
                     onChange={handleInputChange}
                     placeholder="Actif">
            <option>Produits actifs uniquement ?</option>
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
        />
        ,
        <Form.Control
            type="text"
            value={filters.description}
            onChange={handleInputChange}
            placeholder="Description"
            name='description'
            className="my-1 "
        />,
        <Form.Control
            type="text"
            value={filters.prixUnitaireMin}
            onChange={handleInputChange}
            placeholder="Prix Unitaire Min"
            name='prixUnitaireMin'
            className="my-1 "
        />,
        <Form.Control
            type="text"
            value={filters.prixUnitaireMax}
            onChange={handleInputChange}
            placeholder="Prix Unitaire Max"
            name='prixUnitaireMax'
            className="my-1 "
        />,
        <Form.Control
            type="text"
            value={filters.stockInitialMin}
            onChange={handleInputChange}
            placeholder="Stock Initial Min"
            name='stockInitialMin'
            className="my-1 "
        />,
        <Form.Control
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
        fetchProduitByMotCle(searchInput).then();
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

            <h1><strong>Produit</strong></h1>


            <HeaderBtnElementComp titreFil='creer-produit' variant='outline-primary'
                                  valueBtn='Créer produit'/>


            {/*<SearchProduitCritereComp*/}
            {/*    handleSubmitSearch={handleSubmitSearch}*/}
            {/*    searchInput={searchInput}*/}
            {/*    handleSearchInput={handleSearchInput}*/}
            {/*    handleSubmitFilter={handleSubmitFilter}*/}
            {/*    filters={filters}*/}
            {/*    handleInputChange={handleInputChange}*/}

            {/*/>*/}

            <SearchCritereComp cols={cols}
                               handleSubmitSearch={handleSubmitSearch}
                               searchInput={searchInput}
                               handleSearchInput={handleSearchInput}
                               handleSubmitFilter={handleSubmitFilter}
            />

            {produits.length > 0 ? (
                <DataTableComp data={produits} columns={columns} entetes={entetes} />
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

export default ProduitListe;
