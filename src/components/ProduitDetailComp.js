import React, {useEffect, useState} from 'react';
import {usePanier} from "../context/PanierContext";
import produitService from "../services/ProduitService";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import apiCrudService from "../services/ApiCrudService";

const ProduitDetailComp = (props) => {
    const [produit, setProduit] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {ajouterAuPanier, dejaPresent, nombreDansPanier} = usePanier();


    const handleAjouterAuPanier = (produit) => {
        // console.log(produit)
        ajouterAuPanier({...produit, quantite: 1});
    };

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async (id) => {
        try {
            const data = await produitService.getProduitsById(id)
            console.log(data)
            setProduit(data);
            if (props.scanAndAdd) {
                handleAjouterAuPanier(data);
            }

        } catch (error) {
            setError(error);
        }
    };
    // Fonction pour récupérer les données d'un produit
    const fetchProduitByCodeBarre = async (codeBarre) => {
        try {
            const data = await produitService.getProduitsByCodeBarre(codeBarre)
            console.log(data)
            setProduit(data);
            handleAjouterAuPanier(data);
            props.setTexte('')

        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        if (props.scanAndAdd) {
            fetchProduitByCodeBarre(props.codeBarre).then(r => r);

        } else {
            fetchProduit(props.id).then(r => r);
        }
    }, [props.id, props.codeBarre]);

    const handleDeleteProduit = async (id) => {
        try {
            await apiCrudService.delete("produits",id);
            navigate("/produits?showAlertSupprProduit=true");
        }catch(err) {
            setError(err);
        }
    }

    return (
        <div className="card p-4 shadow">
            <h3 className="card-title text-center">{produit.nom}</h3>
            <div className="card-body">
                <p><strong>Prix :</strong> {produit.prixUnitaire} €</p>
                <p><strong>Description :</strong> {produit.description}</p>
                <p><strong>Catégorie :</strong> {produit.categorieNom}</p>
                <p><strong>Stock initial :</strong> {produit.stockInitial}</p>
                <p><strong>Date de création :</strong> {(produit.created_at)?.substring(0, 10)}</p>
                {produit.qrCode && (
                    <div>
                        <p><strong>QR Code :</strong></p>
                        <img
                            src={`data:image/png;base64,${produit.qrCode}`}
                            alt="QR Code"
                            style={{width: "150px", height: "150px", objectFit: "cover"}}
                        />
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-center">
                {/*Il n'est plus necessaire car c'est testé dans le parent*/}

                <button
                    className="btn btn-outline-primary me-2 fw-bold"
                    onClick={() => props.handleStockProduit(produit.id)}
                >
                    Stock du produit
                </button>
                <button
                    className="btn btn-outline-primary me-2 fw-bold"
                    onClick={() => props.isEditing()}
                >
                    Modifier
                </button>
                <button
                    className="btn btn-outline-primary me-2 fw-bold"
                    onClick={() => handleAjouterAuPanier(produit)}
                >
                    {dejaPresent(produit) ? (<span> Ajouter (1) au panier 🧺 <span
                        className={'text-danger'}> {nombreDansPanier(produit)} </span> </span>) : (
                        <span>Ajouter au panier 🧺 </span>)}

                </button>
                <Button variant={"danger"} onClick={() => handleDeleteProduit(props.id) }> Supprimer le produit</Button>

            </div>
        </div>
    );
};

export default ProduitDetailComp;