import axiosInstance from "../context/axiosInstance";

const BASE_URL = '/ventes';

class VenteService {
    /**
     * Récupère la liste des ventes.
     * @returns {Promise} Une promesse contenant les données des ventes.
     */
    async getVentes() {
        try {
            let response = await axiosInstance.get(BASE_URL)
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des ventes :", error);
            throw error;
        }
    }

    /**
     *
     * @param id
     * @returns {Promise<any>}
     */
    async getVenteById(id) {
        try {
            let response = await axiosInstance.get(`${BASE_URL}/${id}`)
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'vente avec l'ID ${id} :`, error);
            throw error;
        }

    }


    async getVenteLines(id) {
        try {
            let response = await axiosInstance.get(`${BASE_URL}/${id}/lignes`)
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des lignes de l'vente avec l'ID ${id} :`, error);
            throw error;
        }

    }

    /**
     * Crée une nouvelle vente.
     * @param {Object} vente - Les données de la vente à créer.
     * @returns {Promise} Une promesse contenant les données de la vente créée.
     */
    async createVente(vente) {
        try {
            let response = await axiosInstance.post(`${BASE_URL}`, vente);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de l'vente :", error);
            throw error;
        }
    }

    /**
     * Met à jour un vente existant (partiellement) via son ID.
     * @param {number} id - L'ID de l'vente à mettre à jour.
     * @param {Object} vente - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    updateVente(id, vente) {
        return axiosInstance.patch(`${BASE_URL}/${id}`, vente)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la mise à jour de l'vente avec l'ID ${id} :`, error);
                throw error;
            });
    }

    /**
     * Supprime un vente via son ID.
     * @param {number} id - L'ID de l'vente à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    async deleteVente(id) {
        try {
            let response = await axiosInstance.delete(`${BASE_URL}/${id}`)
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'vente avec l'ID ${id} :`, error);
            throw error;
        }

    }
}

export default new VenteService();
