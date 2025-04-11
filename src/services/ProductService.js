import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/produits';


export const getProduitByCodeBarre = async (code) => {
    return await axiosInstance.get(`${BASE_URL}/code-barre/${code}`);
}

export const getProduitsById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getProduitByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getProduitDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
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
 * Crée un nouvel produit.
 * @param {Object} produit - Les données de l'produit à créer.
 * @returns {Promise} Une promesse contenant les données de l'produit créé.
 */
export const createProduit = async (produit) => {
    return await axiosInstance.post(`${BASE_URL}`, produit);
}

/**
 * Met à jour un produit existant (partiellement) via son ID.
 * @param {String} id - L'ID de l'produit à mettre à jour.
 * @param {Object} produit - Les données à mettre à jour.
 * @returns {Promise} Une promesse contenant les données mises à jour.
 */
export const updateProduit = async (id, produit) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, produit);
}


/**
 * Supprime un produit via son ID.
 * @param {number} id - L'ID de l'produit à supprimer.
 * @returns {Promise} Une promesse confirmant la suppression.
 */
export const deleteProduit = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


