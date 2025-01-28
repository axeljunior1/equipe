import axiosInstance from "../context/axiosInstance";

const BASE_URL = '/ligneAchat';

class LigneAchatService {
    /**
     * Récupère la liste des ligneAchats.
     * @returns {Promise} Une promesse contenant les données des ligneAchats.
     */
    getLigneAchats = async () => {
            try {
                let res = await axiosInstance.get(BASE_URL)
                return res.data;
                return res.data;
            }catch(error) {
                console.error("Erreur lors de la récupération des ligneAchats :", error);
                throw error;
            }
    }

    /**
     * Récupère les détails d'un ligneAchat spécifique par son ID.
     * @param {number} id - L'ID de l'ligneAchat.
     * @returns {Promise} Une promesse contenant les données de l'ligneAchat spécifique.
     */
    getLigneAchatById = async (id) => {
        try{
            let res = await axiosInstance.get(`${BASE_URL}/${id}`)
            return res.data
        }catch (error) {
            console.error(`Erreur lors de la récupération de l'ligneAchat avec l'ID ${id} :`, error);
            throw error;
        }
    }

    /**
     * Crée un nouvel ligneAchat.
     * @param {Object} ligneAchat - Les données de l'ligneAchat à créer.
     * @returns {Promise} Une promesse contenant les données de l'ligneAchat créé.
     */
     createLigneAchat = async (ligneAchat) => {
        try {
            let res =  await axiosInstance.post(BASE_URL, ligneAchat)
            return res.data
        }catch (error) {

            console.error("Erreur lors de la création de l'ligneAchat :", error);
            throw error;
        }

    }

    /**
     * Met à jour un ligneAchat existant (partiellement) via son ID.
     * @param {number} id - L'ID de l'ligneAchat à mettre à jour.
     * @param {Object} ligneAchat - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    updateLigneAchat(id, ligneAchat) {
        return axiosInstance.patch(`${BASE_URL}/${id}`, ligneAchat)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la mise à jour de l'ligneAchat avec l'ID ${id} :`, error);
                throw error;
            });
    }

    /**
     * Supprime un ligneAchat via son ID.
     * @param {number} id - L'ID de l'ligneAchat à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    deleteLigneAchat = async (id) => {
       try {
           let res = await axiosInstance.delete(`${BASE_URL}/${id}`)
           return res.data
       }catch(error) {
           console.error(`Erreur lors de la supp de l'ligneAchat avec l'ID ${id} :`, error);
           throw error;
       }
    }
}

export default new LigneAchatService();
