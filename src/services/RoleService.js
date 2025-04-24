import axiosInstance from "../context/axiosInstance";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";


const BASE_URL = '/roles';



export const getRoleById = async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
}




export const getRoles = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {


    return await axiosInstance.get(`${BASE_URL}`, {
        params: {
            page: page,
            size: size
        }
    });

}


export const createRole = async (role) => {
    return await axiosInstance.post(`${BASE_URL}`, role);
}


export const updateRole = async (id, role) => {
    // Appel de la requête PATCH
    return await axiosInstance.patch(`${BASE_URL}/${id}`, role);
}



export const deleteRole = async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
}


