// hooks/useFormatVente.js
import {useState} from "react";
import {
    getFormatVenteByMotCle,
    getFormatVenteDyn,
    createFormatVente,
    updateFormatVente,
    deleteFormatVente,
    getFormatVentes,
    getFormatVenteById,
    getFormatVenteByProduitId
} from "../services/FormatVenteService";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";
import {number} from "sockjs-client/lib/utils/random";

export default function useFormatVente() {
    const [formatVentes, setFormatVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les formatVentes par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFormatVenteById(id);
            setFormatVentes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de formatVente");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchAll = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFormatVentes( page, size);
            setFormatVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des formatVentes");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFormatVenteByMotCle(motCle, page, size);
            setFormatVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des formatVentes");
        } finally {
            setLoading(false);
        }
    };

    const fetchByProduitId = async (id, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFormatVenteByProduitId(id, page, size);
            setFormatVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des formatVentes");
        }
    }

    // Recherche dynamique de formatVentes
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFormatVenteDyn(params, page, size);
            setFormatVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des formatVentes");
        } finally {
            setLoading(false);
        }
    };

    // Créer un formatVente
    const create = async (formatVenteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createFormatVente(formatVenteData);
            return {success : true, data : response.data}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la création du formatVente";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un formatVente
    const update = async (id, formatVenteData) => {
        setLoading(true);
        setError(null);
        try {
             await updateFormatVente(id, formatVenteData);

            if (Array.isArray(formatVentes)) {
                await fetchByParams();
            } else if (formatVentes && formatVentes.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du formatVente");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un formatVente
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteFormatVente(id);
            setFormatVentes(formatVentes.filter(formatVente => formatVente.id !== id)); // Retirer le formatVente supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du formatVente");
        } finally {
            setLoading(false);
        }
    };

    return {
        formatVentes, loading, error, fetchAll, fetchById, fetchByMotCle, fetchByProduitId, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
