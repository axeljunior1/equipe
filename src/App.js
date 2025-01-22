import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProduitDetail from "./pages/DetailsProduit";
import {Container, Nav, Navbar} from "react-bootstrap";
import BreadcrumbNav from "./components/Breadcrumb";
import ListProduits from "./pages/ListProduits";
import Achats from "./pages/achats/Achats";
import Employe from "./pages/employe/Employe";
import AchatDetail from "./pages/achats/AchatDetail";
import EmployeDetail from "./pages/employe/EmployeDetail";
import CreateProductPage from "./pages/CreateProductPage";
import QRCodeScanner from "./components/QRCodeScanner";
import Panier from "./pages/panier/Panier";
import {usePanier} from "./context/PanierContext";


const App = () => {
    const {panier} = usePanier()

    useEffect(() => {

    }, []);
    return (
        <div  className="">
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">STORE</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/produits">Produits</Nav.Link>
                            {/*<Nav.Link href="/creer-produit">Creer Produits</Nav.Link>*/}
                            <Nav.Link href="/achats">Achats</Nav.Link>
                            <Nav.Link href="/employe">Employe</Nav.Link>
                            <Nav.Link href="/panier">Panier 🛒 {panier && panier.length > 0 && (<span className={'text-primary'}> {panier.length} </span>)} </Nav.Link>
                            <Nav.Link href="/qr-code">Code</Nav.Link>
                            {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                            {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item href="#action/3.2">*/}
                            {/*        Another action*/}
                            {/*    </NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Divider />*/}
                            {/*    <NavDropdown.Item href="#action/3.4">*/}
                            {/*        Separated link*/}
                            {/*    </NavDropdown.Item>*/}
                            {/*</NavDropdown>*/}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <BreadcrumbNav  />


            <div className="container">

                <Routes className="">
                    <Route path="/" element={<Home />} />
                    <Route path="/produits" element={<ListProduits />} />
                    <Route path="/creer-produit" element={<CreateProductPage />} />
                    <Route path="/produits/:id" element={<ProduitDetail />} />
                    <Route path="/achats" element={<Achats/>} />
                    <Route path="/achats/:id" element={<AchatDetail />} />
                    <Route path="/employe" element={<Employe/>} />
                    <Route path="/panier" element={<Panier/>} />
                    <Route path="/qr-code" element={<QRCodeScanner/>} />
                    <Route path="/employe/:id" element={<EmployeDetail />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
