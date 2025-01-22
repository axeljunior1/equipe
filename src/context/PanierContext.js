import React, {createContext, useContext, useEffect, useState} from 'react';

// Création du contexte
const PanierContext = createContext();

// Hook personnalisé pour accéder au panier
export const usePanier = () => useContext(PanierContext);

// Composant Provider qui encapsule l'ensemble de l'application
export const PanierProvider = ({ children }) => {

    const [panier, setPanier] = useState(() => {
        // Récupérer les données du panier depuis localStorage si elles existent
        const savedPanier = localStorage.getItem("panier");
        return savedPanier ? JSON.parse(savedPanier) : [];
    });

    useEffect(() => {
        // Sauvegarder le panier dans localStorage à chaque modification
        localStorage.setItem("panier", JSON.stringify(panier));
    }, [panier]);

    // Fonction pour ajouter un produit au panier
    const ajouterAuPanier = (produit) => {
        console.log(produit)
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
        return panier.reduce((total, item) => total + item.prixInitial * item.quantite, 0).toFixed(2);
    };

    return (
        <PanierContext.Provider value={{ panier, ajouterAuPanier, retirerDuPanier, calculerTotal }}>
            {children}
        </PanierContext.Provider>
    );
};
