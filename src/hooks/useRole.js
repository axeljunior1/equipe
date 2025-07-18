// hooks/useProduct.js
import {useState} from "react";
import {createRole, deleteRole, getRoleById, getRoles, updateRole} from "../services/RoleService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useRole() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les roles par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getRoleById(id);
            setRoles(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de role");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllRoles = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getRoles( page, size);
            setRoles(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des roles");
        } finally {
            setLoading(false);
        }
    };

    // Créer un role
    const create = async (roleData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createRole(roleData);
            return {success : true, data : response.data}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la création du role";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un role
    const update = async (id, roleData) => {
        setLoading(true);
        setError(null);
        try {
            await updateRole(id, roleData);

            if (Array.isArray(roles)) {
                await fetchAllRoles();
            } else if (roles && roles.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du role");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un role
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteRole(id);
            setRoles(roles.filter(role => role.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du role");
        } finally {
            setLoading(false);
        }
    };

    return {
        roles, loading, error, fetchAllRoles, fetchById, create, update, remove, totalElements,
        totalPages
    };
}
