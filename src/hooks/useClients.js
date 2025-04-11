// hooks/useClient.js
import {useState} from "react";
import {
    getClientByMotCle,
    getClientDyn,
    createClient,
    updateClient,
    deleteClient,
    getClients,
    getClientById
} from "../services/ClientService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";

export default function useClient() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);


    // Récupérer tous les clients par id
    const fetchById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClientById(id);
            setClients(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération de client");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchAll = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClients( page, size);
            setClients(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des clients");
        } finally {
            setLoading(false);
        }
    };

    // Recherche par mot clé avec pagination
    const fetchByMotCle = async (motCle, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClientByMotCle(motCle, page, size);
            setClients(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche des clients");
        } finally {
            setLoading(false);
        }
    };

    // Recherche dynamique de clients
    const fetchByParams = async (params, page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClientDyn(params, page, size);
            setClients(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des clients");
        } finally {
            setLoading(false);
        }
    };

    // Créer un client
    const create = async (clientData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createClient(clientData);
            setClients([...clients, response.data]); // Ajoute le client créé à la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du client");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un client
    const update = async (id, clientData) => {
        setLoading(true);
        setError(null);
        try {
             await updateClient(id, clientData);

            if (Array.isArray(clients)) {
                await fetchByParams();
            } else if (clients && clients.id === Number(id)) {
                await fetchById(id)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du client");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un client
    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteClient(id);
            setClients(clients.filter(client => client.id !== id)); // Retirer le client supprimé de la liste
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du client");
        } finally {
            setLoading(false);
        }
    };

    return {
        clients, loading, error, fetchAll, fetchById, fetchByMotCle, fetchByParams, create, update, remove, totalElements,
        totalPages
    };
}
