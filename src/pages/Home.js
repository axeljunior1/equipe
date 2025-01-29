import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
                {/* Section Produits */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Produits en Stock</Card.Title>
                            <Card.Text>
                                Gérez et consultez les produits actuellement en stock.
                            </Card.Text>
                            <Link to="/produits">
                                <Button variant="primary">Voir les produits</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Ajouter un produit */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Ajouter un produit</Card.Title>
                            <Card.Text>
                                Ajoutez de nouveaux produits dans le stock.
                            </Card.Text>
                            <Link to="/ajouter-produit">
                                <Button variant="success">Ajouter un produit</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Entrées en Stock */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Entrées en stock</Card.Title>
                            <Card.Text>
                                Gérez les entrées de produits dans le stock.
                            </Card.Text>
                            <Link to="/entrees-en-stock">
                                <Button variant="warning">Gérer les entrées</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="d-flex align-items-stretch">
                {/* Section Ventes */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Ventes</Card.Title>
                            <Card.Text>
                                Gérez les ventes de produits et suivez les transactions.
                            </Card.Text>
                            <Link to="/ventes">
                                <Button variant="danger">Voir les ventes</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Utilisateurs */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Employés</Card.Title>
                            <Card.Text>
                                Gérez les employés et leur accès à l'application.
                            </Card.Text>
                            <Link to="/employes">
                                <Button variant="info">Voir les employés</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Section Catégories */}
                <Col md={4} className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Catégories</Card.Title>
                            <Card.Text>
                                Organisez les produits par catégories.
                            </Card.Text>
                            <Link to="/categories">
                                <Button variant="secondary">Voir les catégories</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
