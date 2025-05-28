// hooks/useUniteVente.js
import {useState} from "react";
import {createUnite, deleteUnite, getUniteById, getUnites, updateUnite} from "../services/UniteVenteService";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";
import {number} from "sockjs-client/lib/utils/random";

export default function useUniteVente() {
    const [uniteVentes, setUniteVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les unites par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUniteById(id);
            setUniteVentes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de uniteVente");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchAll = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUnites( page, size);
            setUniteVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des unites");
        } finally {
            setLoading(false);
        }
    };





    // Créer un uniteVente
    const create = async (uniteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createUnite(uniteData);
            return {success : true, data : response.data}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la création du uniteVente";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un uniteVente
    const update = async (id, uniteData) => {
        setLoading(true);
        setError(null);
        try {
             await updateUnite(id, uniteData);

        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du uniteVente");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un uniteVente
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteUnite(id);
            setUniteVentes(uniteVentes.filter(unite => unite.id !== id)); // Retirer le uniteVente supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du uniteVente");
        } finally {
            setLoading(false);
        }
    };

    return {
        uniteVentes, loading, error, fetchAll, fetchById, create, update, remove, totalElements,
        totalPages
    };
}
