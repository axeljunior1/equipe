import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/ventes';



export const getVenteById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}

export const payerVenteById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/payer`);
}

export const fermerVenteById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/fermer`);
}

export const annulerVente = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/annuler`);
}
export const rembourserVente = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/rembourser`);
}

export const getVenteLines = async (id, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
    return await axiosInstance.get(`${BASE_URL}/${id}/lignes`);
}

export const getVenteByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    return await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`, {params: {page: page, size: size}});

}


export const getVenteDyn = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {

    const queryString = new URLSearchParams(params).toString();

    return await axiosInstance.get(`${BASE_URL}/recherche-dynamique?${queryString}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const getVentes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}



export const createVente = async (vente) => {
    return await axiosInstance.post(`${BASE_URL}`, vente);
}

export const validerVente = async (caisse) => {
    return await axiosInstance.post(`${BASE_URL}/valide-panier`, caisse);
}


export const updateVente = async (id, vente) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, vente);
}



export const deleteVente = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


