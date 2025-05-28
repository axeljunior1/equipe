// noinspection DuplicatedCode
import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/unites-vente';


export const getUnites = async (page = 0, size = DEFAULT_PAGINATION_SIZE ) => {
    return await axiosInstance.get(BASE_URL, {params: {page: page, size: size}});
}

export const getUniteById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}



/**
 * Crée un nouvel unite.
 * @param {Object} unite - Les données du unite à créer.
 * @returns {Promise} Une promesse contenant les données du unite créé.
 */
export const createUnite = async (unite) => {
    return await axiosInstance.post(`${BASE_URL}`, unite);
}

/**
 * Met à jour un unite existant (partiellement) via son ID.
 * @param {String} id - L'ID du unite à mettre à jour.
 * @param {Object} unite - Les données à mettre à jour.
 * @returns {Promise} Une promesse contenant les données mises à jour.
 */
export const updateUnite = async (id, unite) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, unite);
}


/**
 * Supprime un unite via son ID.
 * @param {number} id - L'ID du unite à supprimer.
 * @returns {Promise} Une promesse confirmant la suppression.
 */
export const deleteUnite = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


