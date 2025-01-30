import axiosInstance from "../context/axiosInstance";


const BASE_URL = '/employes';

class EmployeService {
    /**
     * Récupère la liste des employe.
     * @returns {Promise} Une promesse contenant les données des employe.
     */
    getEmploye() {
        return axiosInstance.get(BASE_URL)
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
        return axiosInstance.get(`${BASE_URL}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'employe avec l'ID ${id} :`, error);
                throw error;
            });
    }

    getEmployesByUsername = async (username) => {
        try {
            let response =  await axiosInstance.get(`${BASE_URL}/user/${username}`)
            return response.data
        }catch(err){
            console.error(`Erreur lors de la récupération de l'employe avec l'ID ${username} :`, err);
            throw err;
        }
    }

    /**
     * Crée un nouvel employe.
     * @param {Object} employe - Les données de l'employe à créer.
     * @returns {Promise} Une promesse contenant les données de l'employe créé.
     */
    createEmploye(employe) {
        return axiosInstance.post(BASE_URL, employe)
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
        return axiosInstance.patch(`${BASE_URL}/${id}`, employe)
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
        return axiosInstance.delete(`${BASE_URL}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la suppression de l'employe avec l'ID ${id} :`, error);
                throw error;
            });
    }
}

export default new EmployeService();
