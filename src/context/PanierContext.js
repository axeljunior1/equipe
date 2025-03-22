import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance from "./axiosInstance";
import {useJwt} from "./JwtContext";
import apiCrudService from "../services/ApiCrudService";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";

// Création du contexte
const PanierContext = createContext();

// Hook personnalisé pour accéder au panier
export const usePanier = () => useContext(PanierContext);

// Composant Provider qui encapsule l'ensemble de l'application
export const PanierProvider = ({children}) => {
    const {panierId} = useJwt();


    const [client, setClient] = useState(null);

    const [panier, setPanier] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

            console.log("panier id a changé", panierId);
            fetchCart();
        },
        [panierId]);




    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connecté");
                stompClient.subscribe("/topic/messages", (message) => {
                    fetchCart().then()
                });
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const sendMessage = (message) => {
        if (client) {
            client.publish({destination: "/app/send", body: message});
        }
        fetchCart()
    };


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
            sendMessage('ajout')
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };


    // Rafraîchir le panier
    const refreshPanier = async () => {
        sendMessage('refresh')
    };


    // Mettre à jour un produit dans le panier
    const updatePanier = async (param) => {

        const updateData = {
            "prixVente": param.prixVente,
            "quantite": param.quantite
        };

        try {
            await apiCrudService.patch(`panier-produit`, param.id, updateData);
            sendMessage('update')

        } catch (error) {
            console.error("Erreur lors de la mise à jour du panier:", error);
        }
    };

    // Supprimer un produit du panier
    const retirerDuPanier = async (id) => {
        try {
            await apiCrudService.delete('panier-produit', id);
            sendMessage('remove')
        } catch (error) {
            console.error("Erreur lors de la suppression du produit:", error);
        }
    };


    const presentDansPanier = (productId) => {
        return panier.some((item) => item.produit.id === productId);
    };

    const nombreLigneDansPanier = panier.length;

    const nombreProduitDansPanier = (produitId) => {
        if (presentDansPanier(produitId)) {
            for (const panierElement of panier) {
                if (panierElement.produit.id === produitId) {
                    return panierElement.quantite;
                }
            }
        }
        console.log("produit non present dans le panier (erreur )")
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
        console.log("produit non present dans le panier (erreur )")
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
            refreshPanier,
            idPanierProduit,
            nombreProduitDansPanier,
            presentDansPanier, loading, error,
            updatePanier
        }}>
            {children}
        </PanierContext.Provider>
    );
};
