import axiosInstance from "../context/axiosInstance";

const BASE_URL = '/achat';

class AchatService {
    /**
     * Récupère la liste des achats.
     * @returns {Promise} Une promesse contenant les données des achats.
     */
    async getAchats() {
        try {
            let response = await axiosInstance.get(BASE_URL)
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des achats :", error);
            throw error;
        }
    }

    /**
     * Récupère les détails d'un achat spécifique par son ID.
     * @param {number} id - L'ID de l'achat.
     * @returns {Promise} Une promesse contenant les données de l'achat spécifique.
     */
    async getAchatById(id) {
        try {
            let response = await axiosInstance.get(`${BASE_URL}/${id}`)
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'achat avec l'ID ${id} :`, error);
            throw error;
        }

    }


    async getAchatLines(id) {
        try {
            let response = await axiosInstance.get(`${BASE_URL}/${id}/lignes`)
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des lignes de l'achat avec l'ID ${id} :`, error);
            throw error;
        }

    }

    /**
     * Crée un nouvel achat.
     * @param {Object} achat - Les données de l'achat à créer.
     * @returns {Promise} Une promesse contenant les données de l'achat créé.
     */
    async createAchat(achat) {
        try {
            let response = await axiosInstance.post(`${BASE_URL}`, achat);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de l'achat :", error);
            throw error;
        }
    }

    /**
     * Met à jour un achat existant (partiellement) via son ID.
     * @param {number} id - L'ID de l'achat à mettre à jour.
     * @param {Object} achat - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    updateAchat(id, achat) {
        return axiosInstance.patch(`${BASE_URL}/${id}`, achat)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la mise à jour de l'achat avec l'ID ${id} :`, error);
                throw error;
            });
    }

    /**
     * Supprime un achat via son ID.
     * @param {number} id - L'ID de l'achat à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    async deleteAchat(id) {
        try {
            let response = await axiosInstance.delete(`${BASE_URL}/${id}`)
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'achat avec l'ID ${id} :`, error);
            throw error;
        }

    }
}

export default new AchatService();
