// noinspection DuplicatedCode
import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/modes-paiement';


export const getModePaiements = async (page = 0, size = DEFAULT_PAGINATION_SIZE ) => {
    return await axiosInstance.get(BASE_URL, {params: {page: page, size: size}});
}

export const getModePaiementById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const createModePaiement = async (modePaiement) => {
    return await axiosInstance.post(`${BASE_URL}`, modePaiement);
}

export const updateModePaiement = async (id, modePaiement) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, modePaiement);
}

export const deleteModePaiement = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


