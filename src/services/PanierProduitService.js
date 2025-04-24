import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/panier-produit';



export const getPanierProduitById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/panier/${id}`);
}



export const getPanierProduits = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const createPanierProduit = async (panier) => {
    return await axiosInstance.post(`${BASE_URL}`, panier);
}


export const updatePanierProduit = async (id, panier) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, panier);
}



export const deletePanierProduit = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


