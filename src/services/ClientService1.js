import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/clients';


export const getClients = async (page = 0, size = DEFAULT_PAGINATION_SIZE ) => {
    return await axiosInstance.get(BASE_URL, {params: {page: page, size: size}});
}

export const getClientById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getClientsByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getClientsDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}

/**
 * Crée un nouvel client.
 * @param {Object} client - Les données du client à créer.
 * @returns {Promise} Une promesse contenant les données du client créé.
 */
export const createClient = async (client) => {
    return await axiosInstance.post(`${BASE_URL}`, client);
}

/**
 * Met à jour un client existant (partiellement) via son ID.
 * @param {String} id - L'ID du client à mettre à jour.
 * @param {Object} client - Les données à mettre à jour.
 * @returns {Promise} Une promesse contenant les données mises à jour.
 */
export const updateClient = async (id, client) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, client);
}


/**
 * Supprime un client via son ID.
 * @param {number} id - L'ID du client à supprimer.
 * @returns {Promise} Une promesse confirmant la suppression.
 */
export const deleteClient = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


