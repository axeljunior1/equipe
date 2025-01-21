import axios from 'axios';

const BASE_URL = 'http://localhost:8089/produit';

class ProduitService {
    /**
     * Récupère la liste des produit.
     * @returns {Promise} Une promesse contenant les données des produit.
     */
    async getProduit() {
        try {
            let response = await axios.get(BASE_URL);
            return response.data
        }catch (error) {
            console.error("Erreur lors de la récupération des produit :", error);
            throw error;
        }finally {

        }

    }

    /**
     * Récupère les détails d'un produit spécifique par son ID.
     * @param {string} id - L'ID de l'produit.
     * @returns {Promise} Une promesse contenant les données de l'produit spécifique.
     */
    async getProduitsById(id) {
        try {
            let axiosResponse = await axios.get(`${BASE_URL}/${id}`);
            return axiosResponse.data;
        }catch(err) {
            throw err;
        }

    }

    getProduitByMotCle(motCle) {
        return axios.get(`${BASE_URL}/recherche?motCle=${motCle}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'produit avec l'ID ${motCle} :`, error);
                throw error;
            });
    }


    getProduitDyn(params) {
        let str = '?'
        if(params.nom) str+= 'nom=' + params.nom;
        if(params.description) str+= '&' + 'description=' + params.description;


        return axios.get(`${BASE_URL}/recherche-dynamique${str}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'produit avec l'ID ${params.description} - ${params.nom} :`, error);
                throw error;
            });
    }

    /**
     * Crée un nouvel produit.
     * @param {Object} produit - Les données de l'produit à créer.
     * @returns {Promise} Une promesse contenant les données de l'produit créé.
     */
    createProduit(produit) {
        return axios.post(BASE_URL, produit)
            .then(response => response.data)
            .catch(error => {
                console.error("Erreur lors de la création de l'produit :", error);
                throw error;
            });
    }

    /**
     * Met à jour un produit existant (partiellement) via son ID.
     * @param {String} id - L'ID de l'produit à mettre à jour.
     * @param {Object} produit - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    updateProduit(id, produit) {
        return axios.patch(`${BASE_URL}/${id}`, produit)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la mise à jour de l'produit avec l'ID ${id} :`, error);
                throw error;
            });
    }

    /**
     * Supprime un produit via son ID.
     * @param {number} id - L'ID de l'produit à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    deleteProduit(id) {
        return axios.delete(`${BASE_URL}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la suppression de l'produit avec l'ID ${id} :`, error);
                throw error;
            });
    }
}

export default new ProduitService();
