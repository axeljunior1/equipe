import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {usePanier} from "../../context/PanierContext";
import AlertComp from "../../components/AlertComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import {Button, Col, Row} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import DetailsComp from "../../components/DetailsComp";
import BarcodeDisplayComponent from "../../components/BarcodeDisplayComponent";
import useProduct from "../../hooks/useProduct";
import PropTypes from "prop-types";
import FormatVente from "../formatVente/FormatVente";


const ProduitDetail = (props) => {
    const id = useParams().id ?? props.id; // id de l'url ou id dans props, ils'agit ici de l'id du produit
    const {
        ajouterAuPanier,
        nombreProduitDansPanier,
    } = usePanier();


    ProduitDetail.propTypes = {
        id: PropTypes.number,
    };

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    const {produits, loading, error, fetchById, remove} = useProduct();

    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async () => {

             await fetchById( id)

    };



    useEffect(() => {
        fetchProduit().then(r => r)// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!produits) {
        return <h1>Produit introuvable</h1>;
    }

    const lines = [
        <p key={produits.id}><strong>Prix Vente :</strong> {produits.prixVente} {produits.deviseSymbole} ({produits.deviseCode})</p>,
        <p key={produits.id}><strong>Prix Achat:</strong> {produits.prixAchat} {produits.deviseSymbole} ({produits.deviseCode})</p>,
        <p key={produits.id}><strong>Description :</strong> {produits.description}</p>,
        <p key={produits.id}><strong>Catégorie :</strong> {produits.categorieNom}</p>,
        <p key={produits.id}><strong>Stock initial :</strong> {produits.stockInitial}</p>,
        <p key={produits.id}><strong>Date de création :</strong> {formatDate(produits.createdAt)}</p>,
        <p key={produits.id}><strong>Date de mise à jour :</strong> {formatDate(produits.updatedAt)}</p>,
        <p key={produits.id}><strong>Actif : </strong> {produits.actif ? (<span className="text-success fw-bold"> Oui </span>) : (
            <span className=" fw-bold text-danger"> Non </span>)}</p>,
        <span key={produits.id}>
            <BarcodeDisplayComponent text={produits.ean13 || '1234567890129'} />
        </span>
    ]

    const handleDeleteProduit = async (id) => {
            await remove( id);
            navigate("/produits?showAlertSupprProduit=true");
    }


    const footerList = [
        <button key={produits.id}
            className="btn btn-outline-primary me-2 fw-bold"
            // onClick={() => props.handleStockProduit(produits.id)}
        >
            Imprimer le qr code
        </button>,

        <button key={produits.id}
            className="btn btn-outline-primary me-2 fw-bold"
            onClick={() => handleStockProduit(produits.id)}
        >
            Stock du produit
        </button>,
        <button key={produits.id}
            className="btn btn-outline-primary me-2 fw-bold"
            onClick={() => navigate(`/produits/edit/${produits.id}`)}
        >
            Modifier
        </button>,
        <Row key={produits.id}>
            <Col xm={12}>
                <Button
                    variant="outline-primary" className='fw-bold me-3'
                    onClick={() => ajouterAuPanier({

                        prixVente: produits.prixVente,
                        produitId: produits.id,
                        quantite: nombreProduitDansPanier(produits.id) + 1,
                        formatVenteId : produits.formatVenteId,
                    })}
                >
                    +
                </Button>,
                <span className="fw-bold">
                    {nombreProduitDansPanier(produits.id)}
                    </span>
                <Button
                    variant="outline-info" className=' fw-bold ms-3'
                    onClick={() => ajouterAuPanier({
                        prixVente: produits.prixVente,
                        produitId: produits.id,
                        quantite: nombreProduitDansPanier(produits.id) - 1,
                        formatVenteId : produits.formatVenteId,
                    })}
                >
                    -
                </Button>
            </Col>
        </Row>,
        <Button key={produits.id} className="ms-3" variant={"danger"} onClick={() => handleDeleteProduit(id)}> Supprimer le
            produit
        </Button>
    ]


    const handleStockProduit = (id) => {
        navigate(`/mouvements-stock/produit/${id}`);
    }
    if (error) {
        return <ErrorAlert error={error}/>
    }

    return (

        <div className="">
            {showAlertCreation && (
                <AlertComp
                    message="Opération réussie le produit a été crée !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertCreation(false)}
                />
            )}

            <h1><strong>Détail du Produit</strong></h1>

            <DetailsComp
                lines={lines}
                footerList={footerList}
                title={<span
                    className={produits.actif ? 'text-success' : 'text-danger'}> {produits.id} - {produits.nom} </span>}
            />
            
            <hr className="my-4" />
            

            <FormatVente produitId={id} />

        </div>


    );
};

export default ProduitDetail;
