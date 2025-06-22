import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/ligne-retours';


export const getLigneRetourById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const getLigneRetours = async (page = 0, size = DEFAULT_PAGINATION_SIZE) => {
    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });
}

export const createLigneRetour = async (ligneLigneRetour) => {
    return await axiosInstance.post(`${BASE_URL}`, ligneLigneRetour);
}

export const createAllLigneRetour = async (ligneLigneRetour) => {
    return await axiosInstance.post(`${BASE_URL}/all`, ligneLigneRetour);
}

export const updateLigneRetour = async (id, ligneLigneRetour) => {
    return await axiosInstance.patch(`${BASE_URL}/${id}`, ligneLigneRetour);
}

export const deleteLigneRetour = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


