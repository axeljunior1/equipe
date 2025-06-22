// hooks/useProduct.js
import {useState} from "react";
import {
    createLigneRetour,
    updateLigneRetour,
    deleteLigneRetour,
    getLigneRetourById,
    getLigneRetours, createAllLigneRetour
} from "../services/LigneRetourService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useLigneRetour() {
    const [ligneRetours, setLigneRetours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les ligneLigneRetours par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneRetourById(id);
            setLigneRetours(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de ligneLigneRetour");
        } finally {
            setLoading(false);
        }
    };



    const fetchAllLigneRetours = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLigneRetours( page, size);
            setLigneRetours(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des ligneLigneRetours");
        } finally {
            setLoading(false);
        }
    };

    // Créer un ligneLigneRetour
    const create = async (ligneLigneRetourData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createLigneRetour(ligneLigneRetourData);
            return {success : true, data : response.data}
        } catch (err) {

            let message = err.response?.data?.message || "Erreur lors de la création du ligneAchat";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    const createAll = async (ligneLigneRetourData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAllLigneRetour(ligneLigneRetourData);

            return {success : true, data : response?.data}
        } catch (err) {

            let message = err.response?.data?.message || "Erreur lors de la création du ligneAchat";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un ligneLigneRetour
    const update = async (id, ligneLigneRetourData) => {
        setLoading(true);
        setError(null);
        try {
            let response = await updateLigneRetour(id, ligneLigneRetourData);

            return {success : true, data : response.data}
        } catch (err) {

            let message = err.response?.data?.message || "Erreur lors de la mise à jour de ligneAchat";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un ligneLigneRetour
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteLigneRetour(id);
            return {success : true}
        } catch (err) {
            let message = err.response?.data?.message || "Erreur lors de la suppression de la LigneRetour";
            setError(message);
            return {success : false, error : message};
        } finally {
            setLoading(false);
        }
    };

    return {
        ligneRetours, loading, error, fetchAllLigneRetours, fetchById, create, createAll, update, remove, totalElements,
        totalPages
    };
}
