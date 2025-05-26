// noinspection DuplicatedCode
import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/formats-vente';


export const getFormatVentes = async (page = 0, size = DEFAULT_PAGINATION_SIZE ) => {
    return await axiosInstance.get(BASE_URL, {params: {page: page, size: size}});
}

export const getFormatVenteById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getFormatVenteByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getFormatVenteDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}

/**
 * Crée un nouvel formatVente.
 * @param {Object} formatVente - Les données du formatVente à créer.
 * @returns {Promise} Une promesse contenant les données du formatVente créé.
 */
export const createFormatVente = async (formatVente) => {
    return await axiosInstance.post(`${BASE_URL}`, formatVente);
}

/**
 * Met à jour un formatVente existant (partiellement) via son ID.
 * @param {String} id - L'ID du formatVente à mettre à jour.
 * @param {Object} formatVente - Les données à mettre à jour.
 * @returns {Promise} Une promesse contenant les données mises à jour.
 */
export const updateFormatVente = async (id, formatVente) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, formatVente);
}


/**
 * Supprime un formatVente via son ID.
 * @param {number} id - L'ID du formatVente à supprimer.
 * @returns {Promise} Une promesse confirmant la suppression.
 */
export const deleteFormatVente = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


