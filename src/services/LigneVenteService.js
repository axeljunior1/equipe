import axiosInstance from "../context/axiosInstance";

const BASE_URL = '/ligneVentes';

class LigneVenteService {
    /**
     * Récupère la liste des ligneVentes.
     * @returns {Promise} Une promesse contenant les données des ligneVentes.
     */
    getLigneVentes = async () => {
            try {
                let res = await axiosInstance.get(BASE_URL)
                return res.data;
                return res.data;
            }catch(error) {
                console.error("Erreur lors de la récupération des ligneVentes :", error);
                throw error;
            }
    }

    /**
     * Récupère les détails d'un ligneVente spécifique par son ID.
     * @param {number} id - L'ID de l'ligneVente.
     * @returns {Promise} Une promesse contenant les données de l'ligneVente spécifique.
     */
    getLigneVenteById = async (id) => {
        try{
            let res = await axiosInstance.get(`${BASE_URL}/${id}`)
            return res.data
        }catch (error) {
            console.error(`Erreur lors de la récupération de l'ligneVente avec l'ID ${id} :`, error);
            throw error;
        }
    }

    /**
     * Crée un nouvel ligneVente.
     * @param {Object} ligneVente - Les données de l'ligneVente à créer.
     * @returns {Promise} Une promesse contenant les données de l'ligneVente créé.
     */
     createLigneVente = async (ligneVente) => {
        try {
            let res =  await axiosInstance.post(BASE_URL, ligneVente)
            return res.data
        }catch (error) {

            console.error("Erreur lors de la création de l'ligneVente :", error);
            throw error;
        }

    }

    /**
     * Met à jour un ligneVente existant (partiellement) via son ID.
     * @param {number} id - L'ID de l'ligneVente à mettre à jour.
     * @param {Object} ligneVente - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    updateLigneVente(id, ligneVente) {
        return axiosInstance.patch(`${BASE_URL}/${id}`, ligneVente)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la mise à jour de l'ligneVente avec l'ID ${id} :`, error);
                throw error;
            });
    }

    /**
     * Supprime un ligneVente via son ID.
     * @param {number} id - L'ID de l'ligneVente à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    deleteLigneVente = async (id) => {
       try {
           let res = await axiosInstance.delete(`${BASE_URL}/${id}`)
           return res.data
       }catch(error) {
           console.error(`Erreur lors de la supp de l'ligneVente avec l'ID ${id} :`, error);
           throw error;
       }
    }
}

export default new LigneVenteService();
