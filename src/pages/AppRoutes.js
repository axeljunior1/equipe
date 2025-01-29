import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home";
import ListProduits from "./ListProduits";
import CreateProductPage from "./CreateProductPage";
import ProduitDetail from "./DetailsProduit";
import Achats from "./achats/Achats";
import AchatDetail from "./achats/AchatDetail";
import Employe from "./employe/Employe";
import Panier from "./panier/Panier";
import QRCodeScanner from "../components/QRCodeScanner";
import EmployeDetail from "./employe/EmployeDetail";
import NotFound from "./NotFound";
import BreadcrumbNav from "../components/Breadcrumb";
import CreateAchatPage from "./CreateAchatPage";
import ListCategories from "./ListCategories";
import CategorieDetail from "./DetailsCategorie";
import LoginForm from "./LoginForm";
import Redirect from "../components/Redirect";
import Ventes from "./ventes/Ventes";
import VenteDetail from "./ventes/VenteDetail";
import MouvementStock from "./mouvementStock/MouvementStock";

const AppRoutes = () => {
    useEffect(() => {
        console.log("AppRoutes loaded");
    }, []);
    return (<>
            <BreadcrumbNav/>
            <div className="container">

                <Routes className="container">
                    <Route path="/" element={<Redirect/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/produits" element={<ListProduits/>}/>
                    <Route path="/creer-produit" element={<CreateProductPage/>}/>
                    <Route path="/entrees-en-stock" element={<CreateAchatPage/>}/>
                    <Route path="/produits/:id" element={<ProduitDetail/>}/>
                    <Route path="/achats" element={<Achats/>}/>
                    <Route path="/achats/:id" element={<AchatDetail/>}/>
                    <Route path="/ventes" element={<Ventes/>}/>
                    <Route path="/ventes/:id" element={<VenteDetail/>}/>
                    <Route path="/employes" element={<Employe/>}/>
                    <Route path="/panier" element={<Panier/>}/>
                    <Route path="/qr-code" element={<QRCodeScanner/>}/>
                    <Route path="/categories" element={<ListCategories/>}/>
                    <Route path="/employes/:id" element={<EmployeDetail/>}/>
                    <Route path="/categories/:id" element={<CategorieDetail/>}/>
                    <Route path="/mouvements-stock" element={<MouvementStock/>}/>
                    <Route path="/mouvements-stock/produit/:id" element={<MouvementStock/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>

            </div>
        </>
    );
};

export default AppRoutes;
