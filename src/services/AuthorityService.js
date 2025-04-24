import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/autorisations';



export const getAuthorityById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}




export const getAuthorities = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const createAuthority = async (authority) => {
    return await axiosInstance.post(`${BASE_URL}`, authority);
}


export const updateAuthority = async (id, authority) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, authority);
}



export const deleteAuthority = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


