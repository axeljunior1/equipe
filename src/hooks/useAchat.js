// hooks/useProduct.js
import {useState} from "react";
import {
    getAchatByMotCle,
    getAchatDyn,
    createAchat,
    updateAchat,
    deleteAchat,
    getAchatById,
    getAchats, getAchatLines, validAchatById
} from "../services/AchatService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useAchat() {
    const [achats, setAchats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les achats par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAchatById(id);
            setAchats(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de achat");
        } finally {
            setLoading(false);
        }
    };

    // Récupérer tous les achats par id
    const validById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await validAchatById(id);
            fetchById(id)
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de achat");
        } finally {
            setLoading(false);
        }
    };


    // Récupérer tous les achats par id
    const fetchAchatLines = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAchatLines(id);
            setAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération des lignes de l'achat");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAchatByMotCle(motCle, page, size);
            setAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des achats");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique des achats
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAchatDyn(params, page, size);
            setAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des achats");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllAchats = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAchats( page, size);
            setAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des achats");
        } finally {
            setLoading(false);
        }
    };

    // Créer un achat
    const create = async (achatData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAchat(achatData);
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || "Erreur lors de la création du achat";
            setError(message);
            return { success: false, error: message };

        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un achat
    const update = async (id, achatData) => {
        setLoading(true);
        setError(null);
        try {
            await updateAchat(id, achatData);

            if (Array.isArray(achats)) {
                await fetchAllAchats();
            } else if (achats && achats.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du achat");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un achat
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteAchat(id);
            setAchats(achats.filter(achat => achat.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du achat");
        } finally {
            setLoading(false);
        }
    };

    return {
        achats,
        loading,
        error,
        fetchAllAchats,
        fetchAchatLines,
        fetchById,
        fetchByMotCle,
        fetchByParams,
        create,
        update,
        remove,
        totalElements,
        totalPages,
        validById
    };
}
