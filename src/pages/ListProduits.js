import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import ProduitService from "../services/produitService";
import HeaderBtnElement from "../components/HeaderBtnElement";
import {useNavigate} from "react-router-dom";
import {Button, Col, Form, Row} from "react-bootstrap";

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
       ProduitService.getProduit().then(data => {
           setProduits(data);

       }).catch(error => {
           setError(error);
       }).finally(
           () => setLoading(false),
       )
    };
    // Fonction pour récupérer les produits depuis l'API
    const fetchProduitByMotCle = async (motCle) => {
       ProduitService.getProduitByMotCle(motCle).then(data => {
           setProduits(data);
           setLoading( true);
       }).catch(error => {
           setError(error);
       }).finally(
           () => setLoading(false),
       )
    };

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
        setLoading(true);
        fetchProduitByMotCle(searchInput);
    }

    return (
        <div>
            <h1> <strong> Produit </strong></h1>
            <HeaderBtnElement titreFil='' variant='outline-primary' onClick={()=>navigate('/creer-produit')} valueBtn='Creer produit'/>

            <Form inline className='my-3' onSubmit={handleSubmitSearch}>
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
                        <Button type="submit">Submit</Button>
                    </Col>
                </Row>
            </Form>
<hr/>
            <Form onSubmit={handleSubmitFilter} className='my-3'>
                <Row>
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            value={filters.nom}
                            onChange={handleInputChange}
                            placeholder="Nom"
                            name='nom'
                            className=" mr-sm-2"
                        />
                    </Col>
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            value={filters.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            name='description'
                            className=" mr-sm-2"
                        />
                    </Col>
                </Row>
                {/*<input*/}
                {/*    type="text"*/}
                {/*    name="description"*/}
                {/*    placeholder="Description"*/}
                {/*    value={filters.description}*/}
                {/*    onChange={handleInputChange}*/}
                {/*/>*/}
                {/*<input*/}
                {/*    type="number"*/}
                {/*    name="stockInitialMin"*/}
                {/*    placeholder="Stock min"*/}
                {/*    value={filters.stockInitialMin}*/}
                {/*    onChange={handleInputChange}*/}
                {/*/>*/}
                {/*<input*/}
                {/*    type="number"*/}
                {/*    name="stockInitialMax"*/}
                {/*    placeholder="Stock max"*/}
                {/*    value={filters.stockInitialMax}*/}
                {/*    onChange={handleInputChange}*/}
                {/*/>*/}
                {/*<input*/}
                {/*    type="number"*/}
                {/*    name="prixUnitaireMin"*/}
                {/*    placeholder="Prix min"*/}
                {/*    value={filters.prixUnitaireMin}*/}
                {/*    onChange={handleInputChange}*/}
                {/*/>*/}
                {/*<input*/}
                {/*    type="number"*/}
                {/*    name="prixUnitaireMax"*/}
                {/*    placeholder="Prix max"*/}
                {/*    value={filters.prixUnitaireMax}*/}
                {/*    onChange={handleInputChange}*/}
                {/*/>*/}

                <Col xs="auto">
                    <Button type="submit" className={'my-2'}>Submit</Button>
                </Col>
            </Form>


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