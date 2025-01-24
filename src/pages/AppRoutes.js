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

const AppRoutes = () => {
    useEffect(() => {
        console.log("AppRoutes loaded");
    }, []);
    return (
        <BrowserRouter>
            <BreadcrumbNav/>
            <div className="container">
                <Routes className="">
                    <Route path="/" element={<Home/>}/>
                    <Route path="/produits" element={<ListProduits/>}/>
                    <Route path="/creer-produit" element={<CreateProductPage/>}/>
                    <Route path="/entree-en-stock" element={<CreateAchatPage/>}/>
                    <Route path="/produits/:id" element={<ProduitDetail/>}/>
                    <Route path="/achats" element={<Achats/>}/>
                    <Route path="/achats/:id" element={<AchatDetail/>}/>
                    <Route path="/employe" element={<Employe/>}/>
                    <Route path="/panier" element={<Panier/>}/>
                    <Route path="/qr-code" element={<QRCodeScanner/>}/>
                    <Route path="/employe/:id" element={<EmployeDetail/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>

            </div>
        </BrowserRouter>

    );
};

export default AppRoutes;
