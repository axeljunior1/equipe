// hooks/useProduct.js
import {useState} from "react";
import {
    createRetour,
    updateRetour,
    deleteRetour,
    getRetourById,
    getRetours,
    getRetoursLignes
} from "../services/RetourService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useRetour() {
    const [retours, setRetours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les retours par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getRetourById(id);
            setRetours(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de retour");
        } finally {
            setLoading(false);
        }
    };



    const fetchAllRetours = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getRetours( page, size);
            setRetours(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des retours");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllRetoursLigne = async (id, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getRetoursLignes(id, page, size);
            setRetours(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des lignes de retours");
        } finally {
            setLoading(false);
        }
    };

    // Créer un retour
    const create = async (retourData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createRetour(retourData);
            return {success : true, data : response.data}
        } catch (err) {

            let message = err.response?.data?.message || "Erreur lors de la création du ligneAchat";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un retour
    const update = async (id, retourData) => {
        setLoading(true);
        setError(null);
        try {
            let response = await updateRetour(id, retourData);

            return {success : true, data : response.data}
        } catch (err) {

            let message = err.response?.data?.message || "Erreur lors de la mise à jour de ligneAchat";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un retour
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteRetour(id);
            setRetours(retours.filter(retour => retour.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du retour");
        } finally {
            setLoading(false);
        }
    };

    return {
        retours, loading, error, fetchAllRetours,fetchAllRetoursLigne , fetchById, create, update, remove, totalElements,
        totalPages
    };
}
