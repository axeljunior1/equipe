// hooks/useProduct.js
import {useState} from "react";
import {
    getProduitsByCodeBarre,
    getProduitByMotCle,
    getProduitDyn,
    createProduit,
    updateProduit,
    deleteProduit, getProduitsById
} from "../services/ProductService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useProduct() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);

    // Récupérer tous les produits par code-barre
    const fetchByCodeBarre = async (code) => {
        setLoading(true);
        setError(null);
        console.log("Enter fetchByCodeBarre", code);
        try {
            const response = await getProduitsByCodeBarre(code);
            setProduits(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération des produits");
        } finally {
            setLoading(false);
        }
    };
    // Récupérer tous les produits par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProduitsById(id);
            setProduits(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de produit");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProduitByMotCle(motCle, page, size);
            setProduits(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des produits");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique de produits
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProduitDyn(params, page, size);
            setProduits(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des produits");
        } finally {
            setLoading(false);
        }
    };

    // Créer un produit
    const create = async (produitData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createProduit(produitData);
            setProduits([...produits, response.data]); // Ajoute le produit créé à la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du produit");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un produit
    const update = async (id, produitData) => {
        setLoading(true);
        setError(null);
        try {
            await updateProduit(id, produitData);

            if (Array.isArray(produits)) {
                await fetchByParams();
            } else if (produits && produits.id === id) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du produit");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un produit
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteProduit(id);
            setProduits(produits.filter(produit => produit.id !== id)); // Retirer le produit supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du produit");
        } finally {
            setLoading(false);
        }
    };

    return {
        produits, loading, error, fetchByCodeBarre, fetchById, fetchByMotCle, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
