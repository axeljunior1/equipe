import React, {useEffect, useState} from 'react';
import {usePanier} from "../context/PanierContext";
import produitService from "../services/ProduitService";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import apiCrudService from "../services/ApiCrudService";
import {formatDate} from "../utils/dateUtils";

const ProduitDetailComp = (props) => {
        const [produit, setProduit] = useState({});
        const [error, setError] = useState(null);
        const navigate = useNavigate();

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


        // Fonction pour récupérer les données d'un produit
        const fetchProduit = async (id) => {
            try {
                const data = await produitService.getProduitsById(id)
                setProduit(data);
                // if (props.scanAndAdd) {
                //     ajouterAuPanier({
                //         "prixVente": data.prixVente,
                //         "produitId": data.id,
                //         "quantite": nombreProduitDansPanier(data.id) + 1
                //     });
                // }

            } catch (error) {
                setError(error);
            }
        };
        // Fonction pour récupérer les données d'un produit
        const fetchProduitByCodeBarre = async (codeBarre) => {
            try {
                const data = await produitService.getProduitsByCodeBarre(codeBarre)
                setProduit(data);
                ajouterAuPanier({
                    "prixVente": data.prixVente,
                    "produitId": data.id,
                    "quantite": nombreProduitDansPanier(data.id) + 1
                });
                props.setTexte('')

            } catch (error) {
                setError(error);
            }
        };


        const handleDeleteProduit = async (id) => {
            try {
                await apiCrudService.delete("produits", id);
                navigate("/produits?showAlertSupprProduit=true");
            } catch (err) {
                setError(err);
            }
        }


        useEffect(() => {
            console.log('relance panier ', props.panier)
            if (props.scanAndAdd) {
                fetchProduitByCodeBarre(props.codeBarre).then(r => r);

            } else {
                fetchProduit(props.id).then(r => r);
            }
        }, [props.id, props.codeBarre]);



        return (
            <div className="card p-4 shadow">
                <h3 className="card-title text-center">{produit.nom}</h3>
                <div className="card-body">
                    <p><strong>Prix :</strong> {produit.prixVente} €</p>
                    <p><strong>Description :</strong> {produit.description}</p>
                    <p><strong>Catégorie :</strong> {produit.categorieNom}</p>
                    <p><strong>Stock initial :</strong> {produit.stockInitial}</p>
                    <p><strong>Date de création :</strong> {formatDate(produit.createdAt)}</p>
                    <p><strong>Date de mise à jour :</strong> {formatDate(produit.updatedAt)}</p>
                    <p><strong>Actif : </strong>  {produit.actif ? (<span className="text-success fw-bold"> Oui </span>) : (<span className=" fw-bold text-danger"> Non </span>) }</p>
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
                <div className="d-flex justify-content-center align-items-center">
                    {/*Il n'est plus necessaire car c'est testé dans le parent*/}

                    <button
                        className="btn btn-outline-primary me-2 fw-bold"
                        // onClick={() => props.handleStockProduit(produit.id)}
                    >
                        Imprimer le qr code
                    </button>

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
                    <Button
                        variant="outline-primary" className='fw-bold me-3'
                        onClick={() => ajouterAuPanier({

                            prixVente: produit.prixVente,
                            produitId: produit.id,
                            quantite: nombreProduitDansPanier(produit.id) + 1
                        })}
                    >
                        +
                    </Button>
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
                    {/*<button*/}
                    {/*    className="btn btn-outline-primary me-2 fw-bold"*/}
                    {/*    onClick={()=> props.hanldeAddToCart({*/}
                    {/*        "prixVente": produit.prixVente,*/}
                    {/*        "produitId": produit.id,*/}
                    {/*        "quantite": props.nbrePanier(produit.id) + 1*/}
                    {/*    })}*/}
                    {/*>*/}
                    {/*    {props.nbrePanier(produit.id) > 0 ? (<span> Ajouter (1) au panier 🧺 <span*/}
                    {/*        className={'text-danger'}> {props.nbrePanier(produit.id)} </span> </span>) : (*/}
                    {/*        <span>Ajouter au panier 🧺 </span>)}*/}

                    {/*</button>*/}
                    <Button className="ms-3" variant={"danger"} onClick={() => handleDeleteProduit(props.id)}> Supprimer le produit</Button>

                </div>
            </div>
        );
    }
;

export default ProduitDetailComp;