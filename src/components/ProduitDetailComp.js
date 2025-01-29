import React, {useEffect, useState} from 'react';
import {usePanier} from "../context/PanierContext";
import produitService from "../services/ProduitService";

const ProduitDetailComp = (props) => {
    const [produit, setProduit] = useState({});
    const [error, setError] = useState(null);
    const {ajouterAuPanier, dejaPresent, nombreDansPanier} = usePanier();


    const handleAjouterAuPanier = (produit) => {
        // console.log(produit)
        ajouterAuPanier({...produit, quantite: 1});
    };

    // Fonction pour récupérer les données d'un produit
    const fetchProduit = async (id) => {
        console.log(props.id)
        try {
            const data = await produitService.getProduitsById(id)
            console.log(data)
            setProduit(data);
            if (props.scanAndAdd){
                handleAjouterAuPanier(data);
            }

        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchProduit(props.id);
    }, [props.id]);

    return (
        <div className="card p-4 shadow">
            <h3 className="card-title text-center">{produit.nom}</h3>
            <div className="card-body">
                <p><strong>Prix :</strong> {produit.prixUnitaire} €</p>
                <p><strong>Description :</strong> {produit.description}</p>
                <p><strong>Catégorie :</strong> {produit.categorieNom}</p>
                <p><strong>Stock initial :</strong> {produit.stockInitial}</p>
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

                {props.isEditing &&
                    <>
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
                    </>
                }
                <button
                    className="btn btn-outline-primary me-2 fw-bold"
                    onClick={() => handleAjouterAuPanier(produit)}
                >
                    {dejaPresent(produit) ? ( <span> Ajouter (1) au panier 🧺 <span className={'text-danger'}> { nombreDansPanier(produit)} </span> </span> ):( <span>Ajouter au panier 🧺 </span>)}

                </button>

            </div>
        </div>
    );
};

export default ProduitDetailComp;