import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/ligneVentes';



export const getLigneVenteById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}


export const getLigneVenteByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getLigneVenteDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const getLigneVentes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}



export const createLigneVente = async (ligneLigneVente) => {
    return await axiosInstance.post(`${BASE_URL}`, ligneLigneVente);
}


export const updateLigneVente = async (id, ligneLigneVente) => {
    return await axiosInstance.patch(`${BASE_URL}/${id}`, ligneLigneVente);
}



export const deleteLigneVente = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


