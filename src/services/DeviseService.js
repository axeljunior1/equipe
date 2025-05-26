// noinspection DuplicatedCode
import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/devises';


export const getDevises = async (page = 0, size = DEFAULT_PAGINATION_SIZE ) => {
    return await axiosInstance.get(BASE_URL, {params: {page: page, size: size}});
}

export const getDeviseById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getDeviseByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getDeviseDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}

/**
 * Crée un nouvel devise.
 * @param {Object} devise - Les données du devise à créer.
 * @returns {Promise} Une promesse contenant les données du devise créé.
 */
export const createDevise = async (devise) => {
    return await axiosInstance.post(`${BASE_URL}`, devise);
}

/**
 * Met à jour un devise existant (partiellement) via son ID.
 * @param {String} id - L'ID du devise à mettre à jour.
 * @param {Object} devise - Les données à mettre à jour.
 * @returns {Promise} Une promesse contenant les données mises à jour.
 */
export const updateDevise = async (id, devise) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, devise);
}


/**
 * Supprime un devise via son ID.
 * @param {number} id - L'ID du devise à supprimer.
 * @returns {Promise} Une promesse confirmant la suppression.
 */
export const deleteDevise = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


