// hooks/useDevise.js
import {useState} from "react";
import {
    getDeviseByMotCle,
    getDeviseDyn,
    createDevise,
    updateDevise,
    deleteDevise,
    getDevises,
    getDeviseById
} from "../services/DeviseService";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";
import {number} from "sockjs-client/lib/utils/random";

export default function useDevise() {
    const [devises, setDevises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les devises par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDeviseById(id);
            setDevises(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de devise");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchAll = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDevises( page, size);
            setDevises(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des devises");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDeviseByMotCle(motCle, page, size);
            setDevises(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des devises");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique de devises
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDeviseDyn(params, page, size);
            setDevises(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des devises");
        } finally {
            setLoading(false);
        }
    };

    // Créer un devise
    const create = async (deviseData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createDevise(deviseData);
            return {success : true, data : response.data}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la création du devise";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un devise
    const update = async (id, deviseData) => {
        setLoading(true);
        setError(null);
        try {
             await updateDevise(id, deviseData);

            if (Array.isArray(devises)) {
                await fetchByParams();
            } else if (devises && devises.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du devise");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un devise
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteDevise(id);
            setDevises(devises.filter(devise => devise.id !== id)); // Retirer le devise supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du devise");
        } finally {
            setLoading(false);
        }
    };

    return {
        devises, loading, error, fetchAll, fetchById, fetchByMotCle, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
