import React from 'react';

import {Button, Col, Row, Table} from 'react-bootstrap';
import {usePanier} from "../../context/PanierContext";
import QRCodeScanner from "../../components/QRCodeScanner";
// import produitService from "../../services/produitService";

const Panier = () => {
    const {panier, ajouterAuPanier ,  retirerDuPanier, calculerTotal} = usePanier();

    //Todo => lors de la modification d'un article, il faut peut-etre mettre a jour les produit dans le panier

    const handleAjouterAuPanier = (produit) => {
        ajouterAuPanier({ ...produit, quantite: 1 });
    };

    return (
        <div>
            <h2>Panier</h2>
            {panier.length === 0 ? (
                <p>Votre panier est vide.</p>

            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {panier.map((item) => (
                        <tr key={item.id || `${item.nom}-${item.prixUnitaire}`}>
                            <td>{item.nom}</td>
                            <td>{item.prixUnitaire}€</td>
                            <td>
                                <Row>
                                    <Col xs={"2"}>{item.quantite}</Col>
                                    <Col xs={"10"}>
                                        <Button
                                            variant="outline-secondary" className='w-100 text-primary fw-bold '
                                            onClick={() => handleAjouterAuPanier(item)}
                                        >
                                            ➕
                                        </Button>
                                    </Col>
                                </Row>
                                 </td>
                            <td>{(item.prixUnitaire * item.quantite).toFixed(2)}€</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => retirerDuPanier(item.id)}
                                >
                                    Retirer
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>


                </Table>
            )}
            <h3>Total: {calculerTotal()}€</h3>

            <div className={'mt-3'}>
                <QRCodeScanner scanAndAdd={true}/>
            </div>
        </div>
    );
};


export default Panier;