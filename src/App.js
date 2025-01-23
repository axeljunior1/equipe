import React, {useEffect} from "react";
import AppRoutes from "./pages/AppRoutes";
import {Container, Nav, Navbar} from "react-bootstrap";
import {usePanier} from "./context/PanierContext";


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
                        <Navbar.Brand href="/">STORE</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/produits">Produits</Nav.Link>
                                {/*<Nav.Link href="/creer-produit">Creer Produits</Nav.Link>*/}
                                <Nav.Link href="/achats">Achats</Nav.Link>
                                <Nav.Link href="/employe">Employe</Nav.Link>
                                <Nav.Link href="/panier">Panier 🛒 {panier && panier.length > 0 && (
                                    <span className={'text-primary'}> {panier.length} </span>)} </Nav.Link>
                                <Nav.Link href="/qr-code">Code</Nav.Link>
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
