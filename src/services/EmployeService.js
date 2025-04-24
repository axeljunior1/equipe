import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/employes';



export const getEmployeById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getEmployeByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getEmployeDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const getEmployes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}

/**
 * Crée un nouvel employe.
 * @param {Object} employe - Les données de l'employé à créer.
 * @returns {Promise} Une promesse contenant les données de l'employé créé.
 */
export const createEmploye = async (employe) => {
    return await axiosInstance.post(`${BASE_URL}`, employe);
}

/**
 * Met à jour un employe existant (partiellement) via son ID.
 * @param {String} id - L'ID de l'employé à mettre à jour.
 * @param {Object} employe - Les données à mettre à jour.
 * @returns {Promise} Une promesse contenant les données mises à jour.
 */
export const updateEmploye = async (id, employe) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, employe);
}


/**
 * Supprime un employe via son ID.
 * @param {number} id - L'ID de l'employé à supprimer.
 * @returns {Promise} Une promesse confirmant la suppression.
 */
export const deleteEmploye = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


