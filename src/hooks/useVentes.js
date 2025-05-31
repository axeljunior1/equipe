// hooks/useProduct.js
import {useState} from "react";
import {
    createVente,
    deleteVente,
    fermerVenteById,
    getVenteById,
    getVenteByMotCle,
    getVenteDyn,
    getVenteLines,
    getVentes,
    updateVente, validerVente
} from "../services/VenteService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useVente() {
    const [ventes, setVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les ventes par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getVenteById(id);
            setVentes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de vente");
        } finally {
            setLoading(false);
        }
    };


    const fermerVente = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await fermerVenteById(id);
            await fetchById(id)
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de vente");
        } finally {
            setLoading(false);
        }
    };

    // Récupérer tous les ventes par id
    const fetchVenteLines = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getVenteLines(id);
            setVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération des lignes de l'vente");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getVenteByMotCle(motCle, page, size);
            setVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des ventes");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique des ventes
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getVenteDyn(params, page, size);
            setVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des ventes");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllVentes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getVentes( page, size);
            setVentes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des ventes");
        } finally {
            setLoading(false);
        }
    };

    // Créer un vente
    const create = async (venteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createVente(venteData);
            setVentes([...ventes, response.data]); // Ajoute l'employé créé à la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du vente");
        } finally {
            setLoading(false);
        }
    };



    const validerPanier = async (caisse) => {
        setLoading(true);
        setError(null);
        try {
            const response = await validerVente(caisse);
            return {success : true, data : response.data}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la validation de la vente";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un vente
    const update = async (id, venteData) => {
        setLoading(true);
        setError(null);
        try {
            await updateVente(id, venteData);

            if (Array.isArray(ventes)) {
                await fetchAllVentes();
            } else if (ventes && ventes.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du vente");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un vente
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteVente(id);
            await fetchAllVentes()
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du vente");
        } finally {
            setLoading(false);
        }
    };

    return {
        ventes, loading, error, fetchAllVentes,fetchVenteLines, fetchById, fetchByMotCle, fetchByParams, validerPanier, create, update, remove, totalElements,
        totalPages,fermerVente
    };
}
