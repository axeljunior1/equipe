// hooks/useProduct.js
import {useState} from "react";
import {createEtatVente, deleteEtatVente, getEtatVenteById, getEtatVentes, updateEtatVente} from "../services/EtatVenteService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useEtatVente() {
    const [etatVentes, setEtatVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les etatVentes par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEtatVenteById(id);
            setEtatVentes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de etatVente");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllEtatVentes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEtatVentes( page, size);
            setEtatVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des etatVentes");
        } finally {
            setLoading(false);
        }
    };

    // Créer un etatVente
    const create = async (etatVenteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createEtatVente(etatVenteData);
            return {success : true, data : response.data}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la création du etatVente";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un etatVente
    const update = async (id, etatVenteData) => {
        setLoading(true);
        setError(null);
        try {
            await updateEtatVente(id, etatVenteData);

            if (Array.isArray(etatVentes)) {
                await fetchAllEtatVentes();
            } else if (etatVentes && etatVentes.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du etatVente");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un etatVente
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteEtatVente(id);
            setEtatVentes(etatVentes.filter(etatVente => etatVente.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du etatVente");
        } finally {
            setLoading(false);
        }
    };

    return {
        etatVentes, loading, error, fetchAllEtatVentes, fetchById, create, update, remove, totalElements,
        totalPages
    };
}
