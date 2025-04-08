import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/categories';


export const getCategories = async (page = 0, size = DEFAULT_PAGINATION_SIZE ) => {
    return await axiosInstance.get(BASE_URL, {params: {page: page, size: size}});
}

export const getCategorieById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getCategorieByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getCategorieDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
    // Générer proprement la query string
    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}

/**
 * Crée un nouvel categorie.
 * @param {Object} categorie - Les données du categorie à créer.
 * @returns {Promise} Une promesse contenant les données du categorie créé.
 */
export const createCategorie = async (categorie) => {
    return await axiosInstance.post(`${BASE_URL}`, categorie);
}

/**
 * Met à jour un categorie existant (partiellement) via son ID.
 * @param {String} id - L'ID du categorie à mettre à jour.
 * @param {Object} categorie - Les données à mettre à jour.
 * @returns {Promise} Une promesse contenant les données mises à jour.
 */
export const updateCategorie = async (id, categorie) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, categorie);
}


/**
 * Supprime un categorie via son ID.
 * @param {number} id - L'ID du categorie à supprimer.
 * @returns {Promise} Une promesse confirmant la suppression.
 */
export const deleteCategorie = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


