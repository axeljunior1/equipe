import React from 'react';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const HomePage = () => {
    return (
        <Container className="mt-5">
            {/* Section d'introduction sans Jumbotron */}
            <Row className="mb-5 text-center">
                <Col>
                    <h1>Bienvenue sur l'application de gestion des stocks</h1>
                    <p>Suivi des produits, gestion des ventes et entrées en stock.</p>
                </Col>
            </Row>

            <Row className="d-flex align-items-stretch">


                {/* Section Caisse */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Passer à la caisse</Card.Title>
                            <Card.Text>
                                Sélectionnez et vendez les produits actuellement en stock.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/panier">
                                    <Button className="w-100" variant="primary">Vendre les produits</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Produits */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Produits en Stock</Card.Title>
                            <Card.Text>
                                Gérez et consultez les produits actuellement en stock.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/produits">
                                    <Button className="w-100" variant="primary">Voir les produits</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Ajouter un produit */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Ajouter un produit</Card.Title>
                            <Card.Text>
                                Ajoutez de nouveaux produits dans le stock.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/ajouter-produit">
                                    <Button className="w-100" variant="success">Ajouter un produit</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Entrées en Stock */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Mouvements de stock</Card.Title>
                            <Card.Text>
                                Consultez les movements de produits dans le stock.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/mouvements-stock">
                                    <Button className="w-100" variant="warning">Gérer les mouvement de Stocks</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Ventes */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Ventes</Card.Title>
                            <Card.Text>
                                Gérez les ventes de produits et suivez les transactions.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/ventes">
                                    <Button className="w-100" variant="danger">Voir les ventes</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Ventes */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Achats</Card.Title>
                            <Card.Text>
                                Gérez les achats de produits et suivez les transactions.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/achats">
                                    <Button className="w-100" variant="danger">Voir les Achats</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Utilisateurs */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Employés</Card.Title>
                            <Card.Text>
                                Gérez les employés et leur accès à l'application.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/employes">
                                    <Button className="w-100" variant="info">Voir les employés</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Catégories */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Catégories</Card.Title>
                            <Card.Text>
                                Organisez les produits par catégories.
                            </Card.Text>
                            <div className="mt-auto">
                                <Link to="/categories">
                                    <Button className="w-100" variant="secondary">Voir les catégories</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
