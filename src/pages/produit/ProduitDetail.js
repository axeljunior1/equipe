import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {usePanier} from "../../context/PanierContext";
import AlertComp from "../../components/AlertComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import apiCrudService from "../../services/ApiCrudService";
import {Button, Col, Row} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import DetailsComp from "../../components/DetailsComp";
import BarcodeDisplayComponent from "../../components/BarcodeDisplayComponent";

const ProduitDetail = (props) => {
    const id = useParams().id ?? props.id; // id de l'url ou id dans props, ils'agit ici de l'id du produit
    const {
        panier,
        ajouterAuPanier,
        retirerDuPanier,
        calculerTotal,
        refreshPanier,
        nombreProduitDansPanier,
        presentDansPanier,
        updatePanier
    } = usePanier();


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    const [produit, setProduit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.getById('produits', id)
            // console.log(data)
            setProduit(data);
            // Important pour ne retourner que les champs utiles pour la mise a jour

        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchProduit().then(r => r)// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }



    if (!produit) {
        return <h1>Produit introuvable</h1>;
    }

    const lines = [
        <p><strong>Prix :</strong> {produit.prixVente} €</p>,
        <p><strong>Description :</strong> {produit.description}</p>,
        <p><strong>Catégorie :</strong> {produit.categorieNom}</p>,
        <p><strong>Stock initial :</strong> {produit.stockInitial}</p>,
        <p><strong>Date de création :</strong> {formatDate(produit.createdAt)}</p>,
        <p><strong>Date de mise à jour :</strong> {formatDate(produit.updatedAt)}</p>,
        <p><strong>Actif : </strong> {produit.actif ? (<span className="text-success fw-bold"> Oui </span>) : (
            <span className=" fw-bold text-danger"> Non </span>)}</p>,
        <>
            <BarcodeDisplayComponent ean13={produit.ean13 || '1234567890129'} />
        </>
    ]

    const handleDeleteProduit = async (id) => {
        try {
            await apiCrudService.delete("produits", id);
            navigate("/produits?showAlertSupprProduit=true");
        } catch (err) {
            setError(err);
        }
    }


    const footerList = [
        <button
            className="btn btn-outline-primary me-2 fw-bold"
            // onClick={() => props.handleStockProduit(produit.id)}
        >
            Imprimer le qr code
        </button>,

        <button
            className="btn btn-outline-primary me-2 fw-bold"
            onClick={() => handleStockProduit(produit.id)}
        >
            Stock du produit
        </button>,
        <button
            className="btn btn-outline-primary me-2 fw-bold"
            onClick={() => navigate(`/produits/edit/${produit.id}`)}
        >
            Modifier
        </button>,
        <Row>
            <Col xm={12}>
                <Button
                    variant="outline-primary" className='fw-bold me-3'
                    onClick={() => ajouterAuPanier({

                        prixVente: produit.prixVente,
                        produitId: produit.id,
                        quantite: nombreProduitDansPanier(produit.id) + 1
                    })}
                >
                    +
                </Button>,
                <span className="fw-bold">
                    {nombreProduitDansPanier(produit.id)}
                    </span>
                <Button
                    variant="outline-info" className=' fw-bold ms-3'
                    onClick={() => ajouterAuPanier({
                        prixVente: produit.prixVente,
                        produitId: produit.id,
                        quantite: nombreProduitDansPanier(produit.id) - 1
                    })}
                >
                    -
                </Button>
            </Col>
        </Row>,
        <Button className="ms-3" variant={"danger"} onClick={() => handleDeleteProduit(id)}> Supprimer le
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
                    className={produit.actif ? 'text-success' : 'text-danger'}> {produit.id} - {produit.nom} </span>}
            />

        </div>


    );
};

export default ProduitDetail;
