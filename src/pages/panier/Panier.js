import React from 'react';

import {Button, Table} from 'react-bootstrap';
import {usePanier} from "../../context/PanierContext";
// import produitService from "../../services/produitService";

const Panier = () => {
    const { panier, retirerDuPanier, calculerTotal } = usePanier();



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
                            <td>{item.quantite}</td>
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


        </div>
    );
};


export default Panier;