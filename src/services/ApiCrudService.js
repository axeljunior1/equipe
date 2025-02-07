import axiosInstance from "../context/axiosInstance";


// Service API générique
const apiService = {
    // Méthode GET : Récupérer une ressource par ID
    get: async (endpoint , page = 0, size = 50, sortCriteria) => {
        try {
            // Créer une chaîne de tri basée sur `sortCriteria`, qui est un tableau d'objets
            const sortString = sortCriteria ? sortCriteria.map(criterion => `${criterion.field},${criterion.direction}`)
                .join(',') : '';

            const response = await axiosInstance.get(`/${endpoint}`, {
                params: {
                    page: page, // Le numéro de la page (indexé à partir de 0)
                    size: size, // Nombre d'éléments par page
                    sort: sortString, // Champ et direction de tri

                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Méthode GET : Récupérer une ressource par ID
    getById: async (endpoint, id = "") => {
        try {
            const response = await axiosInstance.get(`/${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Méthode POST : Ajouter une nouvelle ressource
    post: async (endpoint, data) => {
        try {
            const response = await axiosInstance.post(`/${endpoint}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Méthode PUT : Mettre à jour une ressource par ID
    put: async (endpoint, id, data) => {
        try {
            const response = await axiosInstance.put(`/${endpoint}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Méthode DELETE : Supprimer une ressource par ID
    delete: async (endpoint, id) => {
        try {
            await axiosInstance.delete(`/${endpoint}/${id}`);
            return { success: true, message: "Ressource supprimée avec succès" };
        } catch (error) {
            throw error;
        }
    }
};

export default apiService;
