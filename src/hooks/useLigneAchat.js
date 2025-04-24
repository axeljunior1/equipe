// hooks/useProduct.js
import {useState} from "react";
import {
    getLigneAchatByMotCle,
    getLigneAchatDyn,
    createLigneAchat,
    updateLigneAchat,
    deleteLigneAchat,
    getLigneAchatById,
    getLigneAchats
} from "../services/LigneAchatService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useLigneAchat() {
    const [ligneAchats, setLigneAchats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les ligneAchats par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneAchatById(id);
            setLigneAchats(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de ligneAchat");
        } finally {
            setLoading(false);
        }
    };


    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneAchatByMotCle(motCle, page, size);
            setLigneAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des ligneAchats");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique des ligneAchats
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneAchatDyn(params, page, size);
            setLigneAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des ligneAchats");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllLigneAchats = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneAchats( page, size);
            setLigneAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des ligneAchats");
        } finally {
            setLoading(false);
        }
    };

    // Créer un ligneAchat
    const create = async (ligneAchatData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createLigneAchat(ligneAchatData);
            setLigneAchats([...ligneAchats, response.data]); // Ajoute l'employé créé à la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du ligneAchat");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un ligneAchat
    const update = async (id, ligneAchatData) => {
        setLoading(true);
        setError(null);
        try {
            await updateLigneAchat(id, ligneAchatData);

            if (Array.isArray(ligneAchats)) {
                await fetchAllLigneAchats();
            } else if (ligneAchats && ligneAchats.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du ligneAchat");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un ligneAchat
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteLigneAchat(id);
            setLigneAchats(ligneAchats.filter(ligneAchat => ligneAchat.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du ligneAchat");
        } finally {
            setLoading(false);
        }
    };

    return {
        ligneAchats, loading, error, fetchAllLigneAchats, fetchById, fetchByMotCle, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
