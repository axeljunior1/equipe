import axiosInstance from "../context/axiosInstance";


const BASE_URL = '/mouvements-stock';

class MouvementStockService {
    /**
     * Récupère la liste des mouvementStock.
     * @returns {Promise} Une promesse contenant les données des mouvementStock.
     */
    async getMouvementStock(page = 0 ,size = 5, sortCriteria) {
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
            console.error("Erreur lors de la récupération des mouvementStock :", error);
            throw error;
        }

    }

    /**
     * Récupère les détails d'un mouvementStock spécifique par son ID.
     * @param {string} id - L'ID de l'mouvementStock.
     * @returns {Promise} Une promesse contenant les données de l'mouvementStock spécifique.
     */
    async getMouvementStocksById(id) {
        try {
            let axiosResponse = await axiosInstance.get(`${BASE_URL}/${id}`);
            return axiosResponse.data;
        }catch(err) {
            throw err;
        }

    }

    getMouvementStockByMotCle(motCle) {

        return axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'mouvementStock avec l'ID ${motCle} :`, error);
                throw error;
            });
    }


    getMouvementStockDyn(params) {
        let str = '?'
        if(params.nom) str+= 'nom=' + params.nom;
        if(params.description) str+= '&' + 'description=' + params.description;


        return axiosInstance.get(`${BASE_URL}/recherche-dynamique${str}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'mouvementStock avec l'ID ${params.description} - ${params.nom} :`, error);
                throw error;
            });
    }

    /**
     * Crée un nouvel mouvementStock.
     * @param {Object} mouvementStock - Les données de l'mouvementStock à créer.
     * @returns {Promise} Une promesse contenant les données de l'mouvementStock créé.
     */
    async createMouvementStock(mouvementStock) {
        try {
            let response = await axiosInstance.post(`${BASE_URL}`, mouvementStock);
            return response.data;
        }catch (error) {
            console.error("Erreur lors de la création de l'mouvementStock :", error);
            throw error;
        }

    }

    /**
     * Met à jour un mouvementStock existant (partiellement) via son ID.
     * @param {String} id - L'ID de l'mouvementStock à mettre à jour.
     * @param {Object} mouvementStock - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    async updateMouvementStock(id, mouvementStock) {
        try {
            // Appel de la requête PATCH
            let updateReponse = await axiosInstance.patch(`${BASE_URL}/${id}`, mouvementStock);
            return updateReponse.data; // Retour des données mises à jour
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du mouvementStock avec l'ID ${id} :`, error);

            // Différenciation des erreurs pour une meilleure gestion
            if (error.response && error.response.status === 404) {
                throw new Error(`MouvementStock avec l'ID ${id} introuvable.`);
            } else if (error.response && error.response.status === 400) {
                throw new Error(`Erreur de validation : ${error.response.data.message || 'Données invalides.'}`);
            } else {
                throw new Error('Erreur réseau ou serveur.');
            }
        }
    }


    /**
     * Supprime un mouvementStock via son ID.
     * @param {number} id - L'ID de l'mouvementStock à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    async deleteMouvementStock(id) {
        try {
            let response = await axiosInstance.delete(`${BASE_URL}/${id}`);
            return response.data;
        }catch (error) {
            console.error(`Erreur lors de la suppression de l'mouvementStock avec l'ID ${id} :`, error);
            throw error;
        }
    }
}

export default new MouvementStockService();
