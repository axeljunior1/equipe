import React, {useEffect} from "react";
import AppRoutes from "./pages/AppRoutes";
import {Container, Nav, Navbar} from "react-bootstrap";
import {usePanier} from "./context/PanierContext";
import {Link} from "react-router-dom";


const App = () => {
const {panier} = usePanier()

    useEffect(() => {
        console.log('rendu de app.js')
    }, []);

    return (
        <div>
            <div className="">
                <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                    <Container>
                        <Navbar.Brand as={Link} to="/">STORE</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/produits">Produits</Nav.Link>
                                {/*<Nav.Link to="/creer-produit">Creer Produits</Nav.Link>*/}
                                <Nav.Link as={Link} to="/achats">Achats</Nav.Link>
                                <Nav.Link as={Link} to="/entree-en-stock">Entree en stock</Nav.Link>
                                <Nav.Link as={Link} to="/employes">Employe</Nav.Link>
                                <Nav.Link as={Link} to="/panier">Panier 🛒 {panier && panier.length > 0 && (
                                    <span className={'text-primary'}> {panier.length} </span>)} </Nav.Link>
                                <Nav.Link as={Link} to="/qr-code">Code</Nav.Link>
                                <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
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
