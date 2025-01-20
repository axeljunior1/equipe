import axios from 'axios';

const BASE_URL = 'http://localhost:8089/employe';

class EmployeService {
    /**
     * Récupère la liste des employe.
     * @returns {Promise} Une promesse contenant les données des employe.
     */
    getEmploye() {
        return axios.get(BASE_URL)
            .then(response => response.data)
            .catch(error => {
                console.error("Erreur lors de la récupération des employe :", error);
                throw error;
            });
    }

    /**
     * Récupère les détails d'un employe spécifique par son ID.
     * @param {number} id - L'ID de l'employe.
     * @returns {Promise} Une promesse contenant les données de l'employe spécifique.
     */
    getEmployesById(id) {
        return axios.get(`${BASE_URL}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'employe avec l'ID ${id} :`, error);
                throw error;
            });
    }

    /**
     * Crée un nouvel employe.
     * @param {Object} employe - Les données de l'employe à créer.
     * @returns {Promise} Une promesse contenant les données de l'employe créé.
     */
    createEmploye(employe) {
        return axios.post(BASE_URL, employe)
            .then(response => response.data)
            .catch(error => {
                console.error("Erreur lors de la création de l'employe :", error);
                throw error;
            });
    }

    /**
     * Met à jour un employe existant (partiellement) via son ID.
     * @param {number} id - L'ID de l'employe à mettre à jour.
     * @param {Object} employe - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    updateEmploye(id, employe) {
        return axios.patch(`${BASE_URL}/${id}`, employe)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la mise à jour de l'employe avec l'ID ${id} :`, error);
                throw error;
            });
    }

    /**
     * Supprime un employe via son ID.
     * @param {number} id - L'ID de l'employe à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    deleteEmploye(id) {
        return axios.delete(`${BASE_URL}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la suppression de l'employe avec l'ID ${id} :`, error);
                throw error;
            });
    }
}

export default new EmployeService();
