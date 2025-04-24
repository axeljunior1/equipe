import React, {createContext, useContext, useEffect} from 'react';
import {useJwt} from "./JwtContext";
import PropTypes from "prop-types";
import usePanierProduit from "../hooks/usePanierProduit";

// Création du contexte
const PanierContext = createContext();


// Hook personnalisé pour accéder au panier
export const usePanier = () => useContext(PanierContext);

// Composant Provider qui encapsule l'ensemble de l'application
export const PanierProvider = ({children}) => {
    const {panierId} = useJwt();

    const {panierProduits: panier, loading, error, fetchById, create, update, remove} = usePanierProduit();


    useEffect(() => {

            if (panierId) {
                fetchCart();
            }
        },
        [panierId]);


    const fetchCart = async () => {
        fetchById(panierId);
    };

    useEffect(() => {
        console.log('fetch panier', panierId, panier);

    }, [panier])


    const ajouterAuPanier = async (lignePanier) => {

        const postData = {
            prixVente: lignePanier.prixVente,
            panierId: panierId,
            produitId: lignePanier.produitId,
            quantite: lignePanier.quantite
        };
        await create(postData);
        await fetchCart();

    };


    // Mettre à jour un produit dans le panier
    const updatePanier = async (param) => {

        const updateData = {
            "prixVente": param.prixVente,
            "quantite": param.quantite
        };
        update(param.id, updateData);

        await fetchCart();
    };

    // Supprimer un produit du panier
    const retirerDuPanier = async (id) => {
        remove(id)
    };


    const presentDansPanier = (productId) => {
        return panier.some((item) => item['produit'].id === productId);
    };


    const nombreProduitDansPanier = (produitId) => {
        if (presentDansPanier(produitId)) {
            for (const panierElement of panier) {
                if (panierElement['produit'].id === produitId) {
                    return panierElement.quantite;
                }
            }
        }
        return 0;
    }

    const idPanierProduit = (produitId) => {
        if (presentDansPanier(produitId)) {
            for (const panierElement of panier) {
                if (panierElement['produit']['id'] === produitId) {
                    return panierElement.id;
                }
            }
        }
        return null;
    }

    // Fonction pour calculer le total du panier
    const calculerTotal = () => {

        return panier && panier.reduce((total, item) => Number(total) + Number(item.prixVente) * Number(item.quantite), 0).toFixed(2);
    };

    // const obj = useMemo(()=>(), [])

    return (
        <PanierContext.Provider value={{
            panier,
            ajouterAuPanier,
            retirerDuPanier,
            calculerTotal,
            idPanierProduit,
            nombreProduitDansPanier,
            presentDansPanier, loading, error,
            updatePanier
        }}>
            {children}
        </PanierContext.Provider>
    );
};

PanierProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
