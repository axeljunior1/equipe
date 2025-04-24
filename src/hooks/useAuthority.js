// hooks/useProduct.js
import {useState} from "react";
import {createAuthority, deleteAuthority, getAuthorityById, getAuthorities, updateAuthority} from "../services/AuthorityService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useAuthority() {
    const [authorities, setAuthorities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les authoritys par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAuthorityById(id);
            setAuthorities(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de authority");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllAuthorities = async (page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAuthorities( page, size);
            setAuthorities(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des authoritys");
        } finally {
            setLoading(false);
        }
    };

    // Créer un authority
    const create = async (authorityData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAuthority(authorityData);
            setAuthorities([...authorities, response.data]); // Ajoute l'employé créé à la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du authority");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un authority
    const update = async (id, authorityData) => {
        setLoading(true);
        setError(null);
        try {
            await updateAuthority(id, authorityData);

            if (Array.isArray(authorities)) {
                await fetchAllAuthorities();
            } else if (authorities && authorities.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du authority");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un authority
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteAuthority(id);
            setAuthorities(authorities.filter(authority => authority.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du authority");
        } finally {
            setLoading(false);
        }
    };

    return {
        authorities, loading, error, fetchAllAuthorities, fetchById, create, update, remove, totalElements,
        totalPages
    };
}
