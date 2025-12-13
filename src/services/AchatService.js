import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/achats';



export const getAchatById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const validAchatById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/valider`);
}

export const getAchatLines = async (id, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/lignes`);
}

export const getAchatByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getAchatDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}



export const getAchats = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}



export const createAchat = async (achat) => {
    return await axiosInstance.post(`${BASE_URL}`, achat);
}


export const updateAchat = async (id, achat) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, achat);
}



export const deleteAchat = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


