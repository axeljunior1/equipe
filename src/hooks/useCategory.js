// hooks/useCategory.js

import {useState} from "react";
import {
    getCategoryByMotCle,
    getCategoryDyn,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategories
} from "../services/CategoryService";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(undefined);
    const [totalPages, setTotalPages] = useState(undefined);


    
    // Récupérer tous les categorie par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoryById(id);
            setCategories(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de categorie");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoryByMotCle(motCle, page, size);
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des categorie");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchCategories = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategories( page, size);
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des categorie");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique de categorie
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoryDyn(params, page, size);
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des categorie");
        } finally {
            setLoading(false);
        }
    };

    // Créer un categorie
    const create = async (categorieData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createCategory(categorieData);
            setCategories([...categories, response.data]); // Ajoute le categorie créé à la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du categorie");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un categorie
    const update = async (id, categorieData) => {
        setLoading(true);
        setError(null);
        try {
              await updateCategory(id, categorieData);

            if (Array.isArray(categories)) {
                await fetchCategories()
            } else if (categories && categories.id === Number(id)) {
                await fetchById(id);
            }

        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du categorie");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un categorie
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteCategory(id);
            setCategories(categories.filter(categorie => categorie.id !== id)); // Retirer le categorie supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du categorie");
        } finally {
            setLoading(false);
        }
    };

    return {
        categories, loading, error, fetchCategories, fetchById, fetchByMotCle, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
