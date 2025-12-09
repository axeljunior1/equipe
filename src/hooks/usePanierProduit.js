// hooks/usePanierProduit.js
import {useState} from "react";
import {
    createPanierProduit,
    deletePanierProduit,
    getPanierProduitById,
    updatePanierProduit
} from "../services/PanierProduitService";
import {useJwt} from "../context/JwtContext";

export default function usePanierProduit() {
    const [panierProduits, setPanierProduits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {panierId} = useJwt();
 
    // Récupérer tous les paniers par id
    const fetchById = async (id) => {
        if (!id) throw new Error("No cart id");
        setLoading(true);
        setError(null);
        try {
            const response = await getPanierProduitById(id);
            setPanierProduits(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de panier");
        } finally {
            setLoading(false);
        }
    };



    // Créer un panier
    const create = async (panierData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createPanierProduit(panierData);
            // setPanierProduits([...panierProduits, response.data]); // Ajoute le panier créé à la liste
            await fetchById(panierId);

        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du panier");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un panier
    const update = async (id, panierData) => {
        setLoading(true);
        setError(null);
        try {
            await updatePanierProduit(id, panierData);

            if (Array.isArray(panierProduits)) {
                /* empty */
            } else if (panierProduits && panierProduits.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du panier");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un panier
    const remove = async (id) => {
        if (!id) throw new Error("No cart id");
        setLoading(true);
        setError(null);
        try {
            await deletePanierProduit(id);
            // setPanierProduits(panierProduits.filter(panier => panier.id !== id)); // Retirer le panier supprimé de la liste
            await fetchById(panierId);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du panier");
        } finally {
            setLoading(false);
        }
    };

    return {
        panierProduits, loading, error, fetchById,  create, update, remove
    };
}
