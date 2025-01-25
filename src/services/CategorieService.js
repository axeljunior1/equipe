import axios from 'axios';

const BASE_URL = 'http://localhost:8089/categories';

class CategorieService {
    /**
     * Récupère la liste des categorie.
     * @returns {Promise} Une promesse contenant les données des categorie.
     */
    async getCategories(page = 0 ,size = 5, sortCriteria) {
        try {
            // Créer une chaîne de tri basée sur `sortCriteria`, qui est un tableau d'objets
            const sortString = sortCriteria ? sortCriteria.map(criterion => `${criterion.field},${criterion.direction}`)
                .join(',') : '';

            const response = await axios.get(BASE_URL, {
                params: {
                    page: page, // Le numéro de la page (indexé à partir de 0)
                    size: size, // Nombre d'éléments par page
                    sort: sortString, // Champ et direction de tri
                }
            });
            return response.data
        }catch (error) {
            console.error("Erreur lors de la récupération des categorie :", error);
            throw error;
        }finally {

        }

    }

    /**
     * Récupère les détails d'un categorie spécifique par son ID.
     * @param {string} id - L'ID de l'categorie.
     * @returns {Promise} Une promesse contenant les données de l'categorie spécifique.
     */
    async getCategoriesById(id) {
        try {
            let axiosResponse = await axios.get(`${BASE_URL}/${id}`);
            return axiosResponse.data;
        }catch(err) {
            throw err;
        }

    }

    getCategorieByMotCle(motCle) {

        return axios.get(`${BASE_URL}/recherche?motCle=${motCle}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'categorie avec l'ID ${motCle} :`, error);
                throw error;
            });
    }


    getCategorieDyn(params) {
        let str = '?'
        if(params.nom) str+= 'nom=' + params.nom;
        if(params.description) str+= '&' + 'description=' + params.description;


        return axios.get(`${BASE_URL}/recherche-dynamique${str}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erreur lors de la récupération de l'categorie avec l'ID ${params.description} - ${params.nom} :`, error);
                throw error;
            });
    }

    /**
     * Crée un nouvel categorie.
     * @param {Object} categorie - Les données de l'categorie à créer.
     * @returns {Promise} Une promesse contenant les données de l'categorie créé.
     */
    async createCategorie(categorie) {
        try {
            let response = await axios.post(`${BASE_URL}`, categorie);
            return response.data;
        }catch (error) {
            console.error("Erreur lors de la création de la categorie :", error);
            throw error;
        }

    }

    /**
     * Met à jour un categorie existant (partiellement) via son ID.
     * @param {String} id - L'ID de l'categorie à mettre à jour.
     * @param {Object} categorie - Les données à mettre à jour.
     * @returns {Promise} Une promesse contenant les données mises à jour.
     */
    async updateCategorie(id, categorie) {
        try {
            // Appel de la requête PATCH
            let updateReponse = await axios.patch(`${BASE_URL}/${id}`, categorie);
            return updateReponse.data; // Retour des données mises à jour
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du categorie avec l'ID ${id} :`, error);

            // Différenciation des erreurs pour une meilleure gestion
            if (error.response && error.response.status === 404) {
                throw new Error(`Categorie avec l'ID ${id} introuvable.`);
            } else if (error.response && error.response.status === 400) {
                throw new Error(`Erreur de validation : ${error.response.data.message || 'Données invalides.'}`);
            } else {
                throw new Error('Erreur réseau ou serveur.');
            }
        }
    }


    /**
     * Supprime un categorie via son ID.
     * @param {number} id - L'ID de l'categorie à supprimer.
     * @returns {Promise} Une promesse confirmant la suppression.
     */
    async deleteCategorie(id) {
        try {
            let response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        }catch (error) {
            console.error(`Erreur lors de la suppression de l'categorie avec l'ID ${id} :`, error);
            throw error;
        }
    }
}

export default new CategorieService();
