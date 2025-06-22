import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/retours';


export const getRetourById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getRetours = async (page = 0, size = DEFAULT_PAGINATION_SIZE) => {
    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });
}

export const getRetoursLignes = async (id, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/lignes`, {
        params: {
            page: page,
            size: size
        }
    });
}

export const createRetour = async (Retour) => {
    return await axiosInstance.post(`${BASE_URL}`, Retour);
}

export const updateRetour = async (id, Retour) => {
    return await axiosInstance.patch(`${BASE_URL}/${id}`, Retour);
}

export const deleteRetour = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


