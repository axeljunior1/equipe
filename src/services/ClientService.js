import axiosInstance from "../context/axiosInstance";


const BASE_URL = '/clients';

class ClientService {
    /**
     * Récupère la liste des client.
     * @returns {Promise} Une promesse contenant les données des client.
     */
    async getClient(page = 0 ,size = 5, sortCriteria) {
        try {
            // Créer une chaîne de tri basée sur `sortCriteria`, qui est un tableau d'objets
            const sortString = sortCriteria ? sortCriteria.map(criterion => `${criterion.field},${criterion.direction}`)
                .join(',') : '';


            const response = await axiosInstance.get(BASE_URL, {
                params: {
                    page: page, // Le numéro de la page (indexé à partir de 0)
                    size: size, // Nombre d'éléments par page
                    sort: sortString, // Champ et direction de tri

                }
            });
            return response.data
        }catch (error) {
            console.error("Erreur lors de la récupération des clients :", error);
            throw error;
        }

    }

    /**
     * Récupère les détails d'un client spécifique par son ID.
     * @param {string} id - L'ID de l'client.
     * @returns {Promise} Une promesse contenant les données de l'client spécifique.
     */
    async getClientsById(id) {
        try {
            let axiosResponse = await axiosInstance.get(`${BASE_URL}/${id}`);
            return axiosResponse.data;
        }catch(err) {
            throw err;
        }

    }

    getClientByMotCle(motCle) {

        return axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'client avec l'ID ${motCle} :`, error);
                throw error;
            });
    }


    getClientDyn(params) {
        let str = '?'
        if(params.nom) str+= 'nom=' + params.nom;
        if(params.description) str+= '&' + 'description=' + params.description;


        return axiosInstance.get(`${BASE_URL}/recherche-dynamique${str}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'client avec l'ID ${params.description} - ${params.nom} :`, error);
                throw error;
            });
    }

    /**
     * Crée un nouvel client.
     * @param {Object} client - Les données de l'client à créer.
     * @returns {Promise} Une promesse contenant les données de l'client créé.
     */
    async createClient(client) {
        try {
            let response = await axiosInstance.post(`${BASE_URL}`, client);
            return response.data;
        }catch (error) {
            console.error("Erreur lors de la création de l'client :", error);
            throw error;
        }

    }

    /**
     * Met à jour un client existant (partiellement) via son ID.
     * @param {String} id - L'ID de l'client à mettre à jour.
     * @param {Object} client - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    async updateClient(id, client) {
        try {
            // Appel de la requête PATCH
            let updateReponse = await axiosInstance.patch(`${BASE_URL}/${id}`, client);
            return updateReponse.data; // Retour des données mises à jour
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du client avec l'ID ${id} :`, error);

            // Différenciation des erreurs pour une meilleure gestion
            if (error.response && error.response.status === 404) {
                throw new Error(`Client avec l'ID ${id} introuvable.`);
            } else if (error.response && error.response.status === 400) {
                throw new Error(`Erreur de validation : ${error.response.data.message || 'Données invalides.'}`);
            } else {
                throw new Error('Erreur réseau ou serveur.');
            }
        }
    }


    /**
     * Supprime un client via son ID.
     * @param {number} id - L'ID de l'client à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    async deleteClient(id) {
        try {
            let response = await axiosInstance.delete(`${BASE_URL}/${id}`);
            return response.data;
        }catch (error) {
            console.error(`Erreur lors de la suppression de l'client avec l'ID ${id} :`, error);
            throw error;
        }
    }
}

export default new ClientService();
