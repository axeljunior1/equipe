import axios from "axios";

// Créer l'instance axios avec baseURL venant du .env
const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACK_URL}/`,
});

// Intercepteur de requête pour ajouter le token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer les erreurs 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
