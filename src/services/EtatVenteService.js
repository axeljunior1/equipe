import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/etat-vente';



export const getEtatVenteById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}




export const getEtatVentes = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const createEtatVente = async (etatVente) => {
    return await axiosInstance.post(`${BASE_URL}`, etatVente);
}


export const updateEtatVente = async (id, etatVente) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, etatVente);
}



export const deleteEtatVente = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


