import React, {useEffect, useState} from "react";
import AppRoutes from "./pages/AppRoutes";
import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useJwt} from "./context/JwtContext";
import useMobile from "./context/useMobile";
import Footer from "./pages/footer/Footer";
import usePanierProduit from "./hooks/usePanierProduit";
import LoginForm from "./pages/LoginForm";
import {usePanier} from "./context/PanierContext";


const App = () => {
    const {panier} = usePanier()
    const {jwt, setJwt, setPanierId, setLoggedEmployee, loggedEmployee} = useJwt();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMobile(); // Utilisation du hook
    const [logout, setLogout] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("jwt"); // Supprimer le JWT
        localStorage.removeItem("loggedEmployee"); // Supprimer le JWT
        localStorage.removeItem("requestedUrl"); // Supprimer le JWT
        localStorage.removeItem("panierId");
        setJwt("")// Supprimer le JWT
        setLoggedEmployee(null); // Réinitialiser l'utilisateur
        setPanierId(null);  // Réinitialiser le panier

        setLogout(!logout)
        navigate("/login"); // Rediriger vers la page de connexion
    };
    useEffect(() => {
        // Mettre à jour localStorage avec l'URL courante
        if (location.pathname !== "/login") {
            localStorage.setItem("requestedUrl", location.pathname);
        }
    }, [location])


    return (
        <div>


            {jwt && jwt !== "" && (
                <div className="d-flex flex-column  min-vh-100">
                    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                        <Container>


                            <Navbar.Brand as={Link} to="/home">Boutique</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">

                                    <Nav.Link as={Link} to="/produits">Produits</Nav.Link>
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
                                        </NavDropdown>

                                        {/* Employés Dropdown */}
                                        <NavDropdown title="Employés" id="nav-dropdown-employes">
                                            <NavDropdown.Item as={Link} to="/employes">Employés</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/roles">Rôles</NavDropdown.Item>
                                        </NavDropdown>
                                    </>}

                                    <Nav.Link as={Link} to="/panier">Caisse 🛒 {panier && panier.length > 0 && (
                                        <span className={'text-primary'}> {panier.length} </span>)} </Nav.Link>
                                </Nav>
                                <Nav>

                                        <span className={'text-white'}>
                                            Bonjour : {JSON.parse(loggedEmployee).nom.toUpperCase()}
                                        </span>
                                    <Button
                                        variant="outline-light"
                                        onClick={handleLogout}
                                        className="ms-2"
                                    >
                                        Déconnexion
                                    </Button>
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
