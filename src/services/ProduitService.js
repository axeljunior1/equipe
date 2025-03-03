import axiosInstance from "../context/axiosInstance";
import apiCrudService from "./ApiCrudService";


const BASE_URL = '/produits';

class ProduitService {
    /**
     * Récupère la liste des produit.
     * @returns {Promise} Une promesse contenant les données des produit.
     */




    async getProduitsByCodeBarre(code) {
        try {
            let axiosResponse = await axiosInstance.get(`${BASE_URL}/code-barre/${code}`);
            return axiosResponse.data;
        } catch (err) {
            throw err;
        }

    }

    getProduitByMotCle = async (motCle) => {
        try {
            let response = await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'produit avec l'ID ${motCle} :`, error);
            throw error;
        }

    }


    getProduitDyn = async (params) => {
        // Générer proprement la query string
        const queryString = new URLSearchParams(params).toString();

        try {
            return await apiCrudService.get(`${BASE_URL}/recherche-dynamique?${queryString}`);
        } catch (error) {
            console.error("Erreur lors de la récupération des produits:", error);
            throw error;
        }

    }

    /**
     * Crée un nouvel produit.
     * @param {Object} produit - Les données de l'produit à créer.
     * @returns {Promise} Une promesse contenant les données de l'produit créé.
     */
    async createProduit(produit) {
        try {
            let response = await axiosInstance.post(`${BASE_URL}`, produit);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de l'produit :", error);
            throw error;
        }

    }

    /**
     * Met à jour un produit existant (partiellement) via son ID.
     * @param {String} id - L'ID de l'produit à mettre à jour.
     * @param {Object} produit - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    async updateProduit(id, produit) {
        try {
            // Appel de la requête PATCH
            let updateReponse = await axiosInstance.patch(`${BASE_URL}/${id}`, produit);
            return updateReponse.data; // Retour des données mises à jour
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du produit avec l'ID ${id} :`, error);

            // Différenciation des erreurs pour une meilleure gestion
            if (error.response && error.response.status === 404) {
                throw new Error(`Produit avec l'ID ${id} introuvable.`);
            } else if (error.response && error.response.status === 400) {
                throw new Error(`Erreur de validation : ${error.response.data.message || 'Données invalides.'}`);
            } else {
                throw new Error('Erreur réseau ou serveur.');
            }
        }
    }


    /**
     * Supprime un produit via son ID.
     * @param {number} id - L'ID de l'produit à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    async deleteProduit(id) {
        try {
            let response = await axiosInstance.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'produit avec l'ID ${id} :`, error);
            throw error;
        }
    }
}

export default new ProduitService();
