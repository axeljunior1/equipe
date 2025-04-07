import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance from "./axiosInstance";
import {useJwt} from "./JwtContext";
import apiCrudService from "../services/ApiCrudService";
import {Bounce, toast} from 'react-toastify';
import useProduct from "../hooks/useProduct";

// Création du contexte
const PanierContext = createContext();



// Hook personnalisé pour accéder au panier
export const usePanier = () => useContext(PanierContext);

// Composant Provider qui encapsule l'ensemble de l'application
export const PanierProvider = ({children}) => {
    const {panierId} = useJwt();

    const [panier, setPanier] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    //todo
    // const {panier : panierUse, loading:load, error: err, totalElements, totalPages, fetchByMotCle, fetchByParams} = useProduct();


    useEffect(() => {

            fetchCart();
        },
        [panierId]);


    const fetchCart = async () => {
        setLoading(true);
        try {
            if(!panierId) throw new Error("No panier");
            const response = await axiosInstance.get(`panier-produit/panier/${panierId}`);
            setPanier(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const ajouterAuPanier = async (lignePanier) => {
        try {
            const postData = {
                prixVente: lignePanier.prixVente,
                panierId: panierId,
                produitId: lignePanier.produitId,
                quantite: lignePanier.quantite
            };
            if (!panierId) throw new Error("No panierId existe");
            await axiosInstance.post("panier-produit", postData);

           await fetchCart()


        } catch (err) {
            toast.error('🦄 Une erreur pendant l\'ajout dans le panier !', {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                progress: 1,
                theme: "colored",
                transition: Bounce,
            });
            console.error("Error adding product:", err);
        }
    };


    // Mettre à jour un produit dans le panier
    const updatePanier = async (param) => {

        const updateData = {
            "prixVente": param.prixVente,
            "quantite": param.quantite
        };

        try {
            await apiCrudService.patch(`panier-produit`, param.id, updateData);

            await fetchCart()

        } catch (error) {
            console.error("Erreur lors de la mise à jour du panier:", error);
        }
    };

    // Supprimer un produit du panier
    const retirerDuPanier = async (id) => {
        try {
            await apiCrudService.delete('panier-produit', id);
            await fetchCart()
        } catch (error) {
            console.error("Erreur lors de la suppression du produit:", error);
        }
    };


    const presentDansPanier = (productId) => {
        return panier.some((item) => item.produit.id === productId);
    };


    const nombreProduitDansPanier = (produitId) => {
        if (presentDansPanier(produitId)) {
            for (const panierElement of panier) {
                if (panierElement.produit.id === produitId) {
                    return panierElement.quantite;
                }
            }
        }
        return 0;
    }

    const idPanierProduit = (produitId) => {
        if (presentDansPanier(produitId)) {
            for (const panierElement of panier) {
                if (panierElement.produit.id === produitId) {
                    return panierElement.id;
                }
            }
        }
        return null ;
    }

    // Fonction pour calculer le total du panier
    const calculerTotal = () => {

        return panier.reduce((total, item) => Number(total) + Number(item.prixVente) * Number(item.quantite), 0).toFixed(2);
    };

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
