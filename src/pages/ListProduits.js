import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import ProduitService from "../services/produitService";
import HeaderBtnElement from "../components/HeaderBtnElement";
import {Accordion, Button, Col, Container, Form, Row} from "react-bootstrap";
import {usePanier} from "../context/PanierContext";

const ListProduit = () => {
    const [produits, setProduits] = useState([]);
    const [searchInput, SetSearchInput] = useState('');
    const [filters, setFilters] = useState({
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
    const [pageSize, setPageSize] = useState(5); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
    const navigate = useNavigate();
    const {  ajouterAuPanier, dejaPresent, nombreDansPanier } = usePanier();

    // Fonction pour récupérer les produits avec pagination
    const fetchProduits = async () => {
        setLoading(true);
        try {
            let data = await ProduitService.getProduit(currentPage, pageSize);
            setProduits(data.content);  // Assuming 'content' is the array of products
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    };
    // Fonction pour récupérer les produits depuis l'API
    const fetchProduitByMotCle = async () => {
        setLoading(true);
        try {
            let data = await ProduitService.getProduitByMotCle(searchInput);
            setProduits(data);
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
        fetchProduits();
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
        setLoading(true);

        // Construire dynamiquement les paramètres de la requête
        const params = {};
        if (filters.nom) params.nom = filters.nom;
        if (filters.description) params.description = filters.description;
        if (filters.stockInitialMin) params.stockInitialMin = filters.stockInitialMin;
        if (filters.stockInitialMax) params.stockInitialMax = filters.stockInitialMax;
        if (filters.prixUnitaireMin) params.prixUnitaireMin = filters.prixUnitaireMin;
        if (filters.prixUnitaireMax) params.prixUnitaireMax = filters.prixUnitaireMax;

        ProduitService.getProduitDyn(params).then(data => {
            setProduits(data);
        }).catch(error => {
            setError(error);
        }).finally(
            () => setLoading(false),
        )
    };


    function handleSubmitSearch(e) {
        e.preventDefault();
        fetchProduitByMotCle(searchInput).then(r => console.log(r));
    }

    const handleAjouterAuPanier = (produit) => {
        ajouterAuPanier({ ...produit, quantite: 1 });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    return (
        <div>
            <h1><strong>Produit</strong></h1>


            <HeaderBtnElement titreFil='' variant='outline-primary' onClick={() => navigate('/creer-produit')}
                              valueBtn='Creer produit' />

            <form className='my-3' onSubmit={handleSubmitSearch}>
                <Row>
                    <Col xs="auto">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => SetSearchInput(e.target.value)}
                            placeholder="Recherche"
                            className="form-control mr-sm-2"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit">Recherche</Button>
                    </Col>
                </Row>
            </form>

            <Accordion className='my-3'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header> Filtre de recherche</Accordion.Header>
                    <Accordion.Body>
                        {/*<QRCodeScanner />*/}


                        <Form onSubmit={handleSubmitFilter} className='my-3'>

                            <Container>
                                <Row className="">
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.nom}
                                            onChange={handleInputChange}
                                            placeholder="Nom"
                                            name='nom'
                                            className="my-1"
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.description}
                                            onChange={handleInputChange}
                                            placeholder="Description"
                                            name='description'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.prixUnitaireMin}
                                            onChange={handleInputChange}
                                            placeholder="Prix Unitaire Min"
                                            name='prixUnitaireMin'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.prixUnitaireMax}
                                            onChange={handleInputChange}
                                            placeholder="Prix Unitaire Max"
                                            name='prixUnitaireMax'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.stockInitialMin}
                                            onChange={handleInputChange}
                                            placeholder="Stock Initial Min"
                                            name='stockInitialMin'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.stockInitialMax}
                                            onChange={handleInputChange}
                                            placeholder="Stock Initial Max"
                                            name='stockInitialMax'
                                            className="my-1 "
                                        />
                                    </Col>
                                </Row>


                                <Row className="justify-content-end">
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3} >
                                        <Button type="submit" variant='secondary' className={'my-2 w-100'}>Filtrer</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Stock initial</th>
                    <th>Prix Unitaire</th>
                    <th>Add to Cart 🛒</th>
                </tr>
                </thead>
                <tbody>
                {produits.map((produit, index) => (
                    <tr key={produit.id}>
                        <td>
                            <Link to={`/produits/${produit.id}`} className='text-decoration-none'>{produit.nom}</Link>
                        </td>
                        <td>{produit.description}</td>
                        <td>{produit.stockInitial}</td>
                        <td>{produit.prixUnitaire}</td>
                        <td><Button
                            variant="" className={'w-100 text-primary fw-bold'}
                            onClick={() => handleAjouterAuPanier(produit)} >
                            {dejaPresent(produit) ? ( <span> Ajouter (1) au panier 🧺 <span className={'text-danger'}> { nombreDansPanier(produit)} </span> </span> ):( <span>Ajouter au panier 🧺 </span>)}
                        </Button> </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Pagination controls */}
            <div className="d-flex justify-content-between">
                <Button
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}>
                    Précédent
                </Button>

                <div>
                    Page {currentPage + 1} sur {totalPages}
                </div>

                <Button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}>
                    Suivant
                </Button>
            </div>

            {/* Page size selection */}
            <div className="my-3">
                <Row>
                    <Col xs="auto">
                        <label htmlFor="pageSize">Produits par page:</label>
                        <select
                            id="pageSize"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="ml-2 form-control">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ListProduit;
