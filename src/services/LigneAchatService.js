import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/ligneAchats';



export const getLigneAchatById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}


export const getLigneAchatByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getLigneAchatDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const getLigneAchats = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}



export const createLigneAchat = async (ligneLigneAchat) => {
    return await axiosInstance.post(`${BASE_URL}`, ligneLigneAchat);
}


export const updateLigneAchat = async (id, ligneLigneAchat) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, ligneLigneAchat);
}



export const deleteLigneAchat = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


