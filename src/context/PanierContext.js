import React, {createContext, useContext, useEffect, useState} from 'react';

// Création du contexte
const PanierContext = createContext();

// Hook personnalisé pour accéder au panier
export const usePanier = () => useContext(PanierContext);

// Composant Provider qui encapsule l'ensemble de l'application
export const PanierProvider = ({ children }) => {

    const [panier, setPanier] = useState([]);



    const dejaPresent = (produit) =>{
        const index = panier.findIndex(item => item.id === produit.id);
        return index > -1;

    }
    const nombreDansPanier = (produit) =>{
        const index = panier.findIndex(item => item.id === produit.id);
        return panier[index].quantite;

    }

    // Fonction pour ajouter un produit au panier
    const ajouterAuPanier = (produit) => {
        setPanier((prevPanier) => {
            const index = prevPanier.findIndex(item => item.id === produit.id);
            if (index === -1) {
                return [...prevPanier, produit];
            } else {
                const newPanier = [...prevPanier];
                newPanier[index].quantite += produit.quantite;
                return newPanier;
            }
        });
    };

    // Fonction pour retirer un produit du panier
    const retirerDuPanier = (id) => {
        setPanier(panier.filter(item => item.id !== id));
    };

    // Fonction pour calculer le total du panier
    const calculerTotal = () => {
        return panier.reduce((total, item) => Number(total) + Number(item.prixUnitaire) * Number(item.quantite), 0).toFixed(2);
    };

    return (
        <PanierContext.Provider value={{ panier, ajouterAuPanier, retirerDuPanier, calculerTotal, dejaPresent, nombreDansPanier }}>
            {children}
        </PanierContext.Provider>
    );
};
