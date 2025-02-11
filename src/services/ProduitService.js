import axiosInstance from "../context/axiosInstance";


const BASE_URL = '/produits';

class ProduitService {
    /**
     * Récupère la liste des produit.
     * @returns {Promise} Une promesse contenant les données des produit.
     */
    async getProduit(page = 0 ,size = 15, sortCriteria) {
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
            console.error("Erreur lors de la récupération des produit :", error);
            throw error;
        }

    }

    /**
     * Récupère les détails d'un produit spécifique par son ID.
     * @param {string} id - L'ID de l'produit.
     * @returns {Promise} Une promesse contenant les données de l'produit spécifique.
     */
    async getProduitsById(id) {
        try {
            let axiosResponse = await axiosInstance.get(`${BASE_URL}/${id}`);
            return axiosResponse.data;
        }catch(err) {
            throw err;
        }

    }

    async getProduitsByCodeBarre(code) {
        try {
            let axiosResponse = await axiosInstance.get(`${BASE_URL}/code-barre/${code}`);
            return axiosResponse.data;
        }catch(err) {
            throw err;
        }

    }

    getProduitByMotCle = async (motCle) => {
        try {
            let response = await axiosInstance.get(`${BASE_URL}/recherche?motCle=${motCle}`);
            return response.data;
        }catch (error) {
            console.error(`Erreur lors de la récupération de l'produit avec l'ID ${motCle} :`, error);
            throw error;
        }

    }


    getProduitDyn(params) {
        console.log(params.actif);
        console.log(params.actif ===true);
        console.log(params.actif ==='true');
        let str = '?'
        str = str+= 'actif=' + params.actif ;
        if(params.nom) str+= 'nom=' + params.nom;
        if(params.description) str+= '&' + 'description=' + params.description;


        return axiosInstance.get(`${BASE_URL}/recherche-dynamique${str}`)
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
    async createProduit(produit) {
        try {
            let response = await axiosInstance.post(`${BASE_URL}`, produit);
            return response.data;
        }catch (error) {
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
        }catch (error) {
            console.error(`Erreur lors de la suppression de l'produit avec l'ID ${id} :`, error);
            throw error;
        }
    }
}

export default new ProduitService();
