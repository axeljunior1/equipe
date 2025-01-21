import React, {useCallback, useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import ProduitService from "../services/produitService";
import HeaderBtnElement from "../components/HeaderBtnElement";
import {useNavigate} from "react-router-dom";
import {Accordion, Button, Col, Container, Form, Row} from "react-bootstrap";
import QRCodeScanner from "../components/QRCodeScanner";

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
    const navigate = useNavigate();

    // Fonction pour récupérer les produits depuis l'API
    const fetchProduits = async () => {
        setLoading(true);
        try {
            let data = await ProduitService.getProduit();
            setProduits(data);
            setLoading(false);

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
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
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

    return (
        <div>
            <h1><strong> Produit </strong></h1>
            <HeaderBtnElement titreFil='' variant='outline-primary' onClick={() => navigate('/creer-produit')}
                              valueBtn='Creer produit'/>


            <Form className='my-3' onSubmit={handleSubmitSearch}>
                <Row>
                    <Col xs="auto">
                        <Form.Control
                            type="text" value={searchInput} onChange={(e) => {
                            SetSearchInput(e.target.value)
                        }}
                            placeholder="Recherche"
                            className=" mr-sm-2"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit">Recherche</Button>
                    </Col>
                </Row>

            </Form>

            <Accordion className='my-3'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header> Filtre de recherche</Accordion.Header>
                    <Accordion.Body>
                        <QRCodeScanner />


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
                                    </Col>N
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
                    <th></th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Stock initial</th>
                    <th>prix Unitaire</th>
                </tr>
                </thead>
                <tbody>
                {produits.map((produit, index) => (
                    <tr key={produit.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/produits/${produit.id}`} className='text-decoration-none'>{produit.nom}</Link>
                        </td>
                        <td>{produit.description}</td>
                        <td>{produit.stockInitial}</td>
                        <td>{produit.prixUnitaire}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ListProduit;