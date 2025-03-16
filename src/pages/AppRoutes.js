import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./Home";
import ListProduits from "./produit/ProduitsListe";
import ProduitCreer from "./produit/ProduitCreer";
import ProduitDetail from "./produit/ProduitDetail";
import Achats from "./achat/Achats";
import AchatDetail from "./achat/AchatDetail";
import Employe from "./employe/Employe";
import Panier from "./panier/Panier";
import QRCodeScanner from "../components/QRCodeScanner";
import EmployeDetail from "./employe/EmployeDetail";
import NotFound from "./NotFound";
import BreadcrumbNav from "../components/Breadcrumb";
import CreateAchatPage from "./achat/CreateAchatPage";
import ListCategories from "./categorie/ListCategories";
import CategorieDetail from "./categorie/DetailsCategorie";
import LoginForm from "./LoginForm";
import Ventes from "./vente/Ventes";
import VenteDetail from "./vente/VenteDetail";
import MouvementStock from "./mouvementStock/MouvementStock";
import Roles from "./role/Roles";
import RoleDetail from "./role/RoleDetails";
import CreateEmployePage from "./employe/CreateEmployePage";
import QrScanner from "../components/QrScanner";
import PanierComponent from "../components/PanierComponent";
import FactureList from "./facture/FactureList";
import FactureDetail from "./facture/FactureDetail";
import FactureEdit from "./facture/FactureEdit";
import ListClients from "./client/ClientList";
import DetailsProduitEdit from "./produit/ProduitDetailEditer";
import ClientsDetails from "./client/ClientDetail";
import DetailsClientEdit from "./client/ClientEdit";
import '../App.css'
import ClientCreer from "./client/ClientCreer";
import POSPaymentScreen from "./paiement/POSPaymentScreen";

const AppRoutes = () => {

    return (<>
            <BreadcrumbNav className="p-3 m-3"/>

            <div className="custom-container">
                <Routes className={""}>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/produits" element={<ListProduits/>}/>
                    <Route path="/produits/:id" element={<ProduitDetail/>}/>
                    <Route path="/produits/edit/:id" element={<DetailsProduitEdit/>}/>
                    <Route path="/creer-produit" element={<ProduitCreer/>}/>
                    <Route path="/creer-achat" element={<CreateAchatPage/>}/>
                    <Route path="/achats" element={<Achats/>}/>
                    <Route path="/achats/:id" element={<AchatDetail/>}/>
                    <Route path="/ventes" element={<Ventes/>}/>
                    <Route path="/ventes/:id" element={<VenteDetail/>}/>
                    <Route path="/paiement/vente/:id" element={<POSPaymentScreen/>}/>
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
                    <Route path="/creer-client" element={<ClientCreer/>}/>
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
