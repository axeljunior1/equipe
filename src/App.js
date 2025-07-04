import React, {useEffect, useState} from "react";
import AppRoutes from "./pages/AppRoutes";
import {Button, Col, Container, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useJwt} from "./context/JwtContext";
import useMobile from "./context/useMobile";
import Footer from "./pages/footer/Footer";
import LoginForm from "./pages/LoginForm";
import {usePanier} from "./context/PanierContext";


const App = () => {
    const {panier} = usePanier()
    const {jwt, loggedEmployee, tenantId, employeName,
        employePrenom, restore} = useJwt();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMobile();
    const [logout, setLogout] = useState(false);

    const handleLogout = async () => {

        localStorage.clear()


        setLogout(!logout)

        restore();

        navigate("/home")
    };

    useEffect(() => {
        // Mettre à jour localStorage avec l'URL courante
        if (location.pathname !== "/login") {
            localStorage.setItem("requestedUrl", location.pathname);
        }
    }, [location])

    useEffect(() => {
        console.log(JSON.parse(loggedEmployee))
    },[loggedEmployee])

    return (
        <div>

            {jwt && jwt !== "" && (
                <div className="d-flex flex-column  min-vh-100">
                    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark" fixed="top">
                        <Container>


                            <Navbar.Brand as={Link} to="/home">Boutique</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">

                                    <Nav.Link as={Link} to="/produits">Produits</Nav.Link>
                                    <Nav.Link as={Link} to="/retours">Retours</Nav.Link>
                                    {!isMobile && <>
                                        {/* Achats Dropdown */}

                                        <NavDropdown title="Achats" id="nav-dropdown-achats">
                                            <NavDropdown.Item as={Link} to="/achats">Achats</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/tarif-achat">Tarif
                                                Achats</NavDropdown.Item>
                                        </NavDropdown>

                                        {/* Ventes Dropdown */}
                                        <NavDropdown title="Ventes" id="nav-dropdown-ventes">
                                            <NavDropdown.Item as={Link} to="/ventes">Ventes</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/rapport-ventes">Rapport de
                                                Ventes</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/format-vente">Format Vente</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/paiement-momo">Paiement Momo Monney</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/factures">Factures</NavDropdown.Item>
                                        </NavDropdown>

                                        {/* Stock Dropdown */}
                                        <NavDropdown title="Stock" id="nav-dropdown-stock">
                                            <NavDropdown.Item as={Link} to="/mouvements-stock">Mouvements
                                                stocks</NavDropdown.Item>
                                        </NavDropdown>

                                        {/* Gestion Dropdown */}
                                        <NavDropdown title="Gestion" id="nav-dropdown-gestion">
                                            <NavDropdown.Item as={Link}
                                                              to="/categories">Catégories</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/clients">Clients</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/unite-vente">Unités de ventes</NavDropdown.Item>
                                        </NavDropdown>

                                        {/* Employés Dropdown */}
                                        <NavDropdown title="Employés" id="nav-dropdown-employes">
                                            <NavDropdown.Item as={Link} to="/employes">Employés</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/roles">Rôles</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/autorisations">Autorisations</NavDropdown.Item>
                                        </NavDropdown>
                                    </>}

                                    <Nav.Link as={Link} to="/panier">Caisse 🛒 {panier && panier.length > 0 && (
                                        <span className={'text-primary'}> {panier.length} </span>)} </Nav.Link>
                                </Nav>
                                <Nav>

                                        <Row className={'text-white'}>
                                            <Col xs={12} sm={12} md={4} >
                                                Bonjour : {employeName.toUpperCase()} {employePrenom}
                                            </Col>
                                            <Col xs={12} sm={12} md={4} >
                                                Entreprise : {tenantId}
                                            </Col>
                                            <Col xs={12} sm={12} md={4} >
                                                <Button
                                                    variant="outline-light"
                                                    onClick={handleLogout}
                                                    className="ms-2"
                                                >
                                                    Déconnexion
                                                </Button>
                                            </Col>
                                        </Row>

                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    {/*<WebSocketClient/>*/}


                    <AppRoutes/>

                    <br/>
                    <br/>
                    <Footer/>


                </div>
            )}

            {jwt === "" && (
                <LoginForm/>
            )}

        </div>
    );
};

export default App;
