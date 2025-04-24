// hooks/useProduct.js
import {useState} from "react";
import {
    getLigneVenteByMotCle,
    getLigneVenteDyn,
    createLigneVente,
    updateLigneVente,
    deleteLigneVente,
    getLigneVenteById,
    getLigneVentes
} from "../services/LigneVenteService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useLigneVente() {
    const [ligneVentes, setLigneVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les ligneVentes par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneVenteById(id);
            setLigneVentes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de ligneVente");
        } finally {
            setLoading(false);
        }
    };


    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneVenteByMotCle(motCle, page, size);
            setLigneVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des ligneVentes");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique des ligneVentes
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneVenteDyn(params, page, size);
            setLigneVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des ligneVentes");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllLigneVentes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneVentes( page, size);
            setLigneVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des ligneVentes");
        } finally {
            setLoading(false);
        }
    };

    // Créer un ligneVente
    const create = async (ligneVenteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createLigneVente(ligneVenteData);
            setLigneVentes([...ligneVentes, response.data]); // Ajoute l'employé créé à la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du ligneVente");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un ligneVente
    const update = async (id, ligneVenteData) => {
        setLoading(true);
        setError(null);
        try {
            await updateLigneVente(id, ligneVenteData);

            if (Array.isArray(ligneVentes)) {
                await fetchAllLigneVentes();
            } else if (ligneVentes && ligneVentes.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du ligneVente");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un ligneVente
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteLigneVente(id);
            setLigneVentes(ligneVentes.filter(ligneVente => ligneVente.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du ligneVente");
        } finally {
            setLoading(false);
        }
    };

    return {
        ligneVentes, loading, error, fetchAllLigneVentes, fetchById, fetchByMotCle, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
