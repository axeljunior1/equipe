import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "./Home";
import ListProduits from "./ListProduitsPage";
import CreateProductPage from "./CreateProductPage";
import DetailsProduit from "./DetailsProduit";
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
import Roles from "./roles/Roles";
import RoleDetail from "./roles/RoleDetails";
import CreateEmployePage from "./CreateEmployePage";
import QrScanner from "../components/QrScanner";
import PanierComponent from "../components/PanierComponent";
import FactureList from "../components/facture/FactureList";
import FactureDetail from "../components/facture/FactureDetail";
import FactureEdit from "../components/facture/FactureEdit";
import ListClients from "./ListClients";
import DetailsProduitEdit from "./DetailsProduitEdit";
import ClientsDetails from "./ClientsDetails";
import DetailsClientEdit from "./DetailsClientEdit";
import '../App.css'

const AppRoutes = () => {

    return (<>
            <BreadcrumbNav className="p-3 m-3"/>

            <div className="custom-container">
                <Routes className={""}>
                    <Route path="/" element={<Redirect/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/produits" element={<ListProduits/>}/>
                    <Route path="/produits/:id" element={<DetailsProduit/>}/>
                    <Route path="/produits/edit/:id" element={<DetailsProduitEdit/>}/>
                    <Route path="/creer-produit" element={<CreateProductPage/>}/>
                    <Route path="/creer-achat" element={<CreateAchatPage/>}/>
                    <Route path="/achats" element={<Achats/>}/>
                    <Route path="/achats/:id" element={<AchatDetail/>}/>
                    <Route path="/ventes" element={<Ventes/>}/>
                    <Route path="/ventes/:id" element={<VenteDetail/>}/>
                    <Route path="/employes" element={<Employe/>}/>
                    <Route path="/employes/:id" element={<EmployeDetail/>}/>
                    <Route path="/creer-employe" element={<CreateEmployePage/>}/>
                    <Route path="/panier" element={<Panier/>}/>
                    <Route path="/qr-code" element={<QRCodeScanner/>}/>
                    <Route path="/categories" element={<ListCategories/>}/>
                    <Route path="/categories/:id" element={<CategorieDetail/>}/>
                    <Route path="/mouvements-stock" element={<MouvementStock/>}/>
                    <Route path="/mouvements-stock/produit/:id" element={<MouvementStock/>}/>
                    <Route path="/roles" element={<Roles/>}/>
                    <Route path="/roles/:id" element={<RoleDetail/>}/>
                    <Route path="/factures" element={<FactureList/>}/>
                    <Route path="/factures/:id" element={<FactureDetail/>}/>
                    <Route path="/factures/edit/:id" element={<FactureEdit/>}/>
                    <Route path="/clients" element={<ListClients/>}/>
                    <Route path="/clients/:id" element={<ClientsDetails/>}/>
                    <Route path="/clients/edit/:id" element={<DetailsClientEdit/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/qr" element={<QrScanner/>}/>
                    <Route path="/paniertest" element={<PanierComponent/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
        </>
    );
};

export default AppRoutes;
