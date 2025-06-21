// hooks/useModePaiement.js
import {useState} from "react";
import {
    createModePaiement,
    updateModePaiement,
    deleteModePaiement,
    getModePaiements,
    getModePaiementById
} from "../services/ModePaiementService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useModePaiement() {
    const [modePaiements, setModePaiements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les modePaiements par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getModePaiementById(id);
            setModePaiements(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de modePaiement");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchAll = async (page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getModePaiements(page, size);
            setModePaiements(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des modePaiements");
        } finally {
            setLoading(false);
        }
    };



    // Créer un modePaiement
    const create = async (modePaiementData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createModePaiement(modePaiementData);
            return {success: true, data: response.data}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la création du modePaiement";
            setError(message);
            return {success: false, error: message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un modePaiement
    const update = async (id, modePaiementData) => {
        setLoading(true);
        setError(null);
        try {
           let response = await updateModePaiement(id, modePaiementData);

            return {success : true, data : response.data}
        } catch (err) {

            let message = err.response?.data?.message || "Erreur lors de la création du mode de paiement";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un modePaiement
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteModePaiement(id);
            setModePaiements(modePaiements.filter(modePaiement => modePaiement.id !== id)); // Retirer le modePaiement supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du modePaiement");
        } finally {
            setLoading(false);
        }
    };

    return {
        modePaiements,
        loading,
        error,
        fetchAll,
        fetchById,
        create,
        update,
        remove,
        totalElements,
        totalPages
    };
}
