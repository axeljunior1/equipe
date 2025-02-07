import React, {useEffect} from "react";
import AppRoutes from "./pages/AppRoutes";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {usePanier} from "./context/PanierContext";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useJwt} from "./context/JwtContext";


const App = () => {
    const {panier} = usePanier()
    const {jwt, setJwt, setLoggedEmployee} = useJwt();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("jwt"); // Supprimer le JWT
        localStorage.removeItem("loggedEmployee"); // Supprimer le JWT
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
            <div className="">
                <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                    <Container>

                        {jwt !== "" && (
                            <Navbar.Brand as={Link} to="/home">Boutique</Navbar.Brand>
                        )}
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                {jwt !== "" && (<>
                                    <Nav.Link as={Link} to="/produits">Produits</Nav.Link>
                                    <Nav.Link as={Link} to="/achats">Achats</Nav.Link>
                                    <Nav.Link as={Link} to="/ventes">Ventes</Nav.Link>
                                    <Nav.Link as={Link} to="/mouvements-stock">Mouvements stocks</Nav.Link>
                                    <Nav.Link as={Link} to="/employes">Employe</Nav.Link>
                                    <Nav.Link as={Link} to="/panier">Panier 🛒 {panier && panier.length > 0 && (
                                        <span className={'text-primary'}> {panier.length} </span>)} </Nav.Link>
                                    <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
                                </>)}
                            </Nav>
                            <Nav>
                                {jwt ? (
                                    <Button
                                        variant="outline-light"
                                        onClick={handleLogout}
                                        className="ms-2"
                                    >
                                        Déconnexion
                                    </Button>
                                ) : (
                                    <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>


                <AppRoutes/>
            </div>
        </div>
    );
};

export default App;
