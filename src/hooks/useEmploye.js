// hooks/useProduct.js
import {useState} from "react";
import {
    getEmployeByMotCle,
    getEmployeDyn,
    createEmploye,
    updateEmploye,
    deleteEmploye,
    getEmployeById,
    getEmployes
} from "../services/EmployeService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useEmploye() {
    const [employes, setEmployes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les employes par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEmployeById(id);
            setEmployes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de employe");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEmployeByMotCle(motCle, page, size);
            setEmployes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des employes");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique des employes
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEmployeDyn(params, page, size);
            setEmployes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des employes");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllEmployes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEmployes( page, size);
            setEmployes(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des employes");
        } finally {
            setLoading(false);
        }
    };

    // Créer un employe
    const create = async (employeData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createEmploye(employeData);
            setEmployes([...employes, response.data]); // Ajoute l'employé créé à la liste
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du employe");
        } finally {
            setLoading(false);
        }
        return null;
    };

    // Mettre à jour un employe
    const update = async (id, employeData) => {
        setLoading(true);
        setError(null);
        try {
            await updateEmploye(id, employeData);

            if (Array.isArray(employes)) {
                await fetchAllEmployes();
            } else if (employes && employes.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du employe");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un employe
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteEmploye(id);
            setEmployes(employes.filter(employe => employe.id !== id)); // Retirer l'employé supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du employe");
        } finally {
            setLoading(false);
        }
    };

    return {
        employes, loading, error, fetchAllEmployes, fetchById, fetchByMotCle, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
