import axios from "axios";
import {useLocation} from "react-router-dom";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8089", // URL de votre backend
});

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

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 )) {

            // Récupérer l'URL demandée depuis localStorage
            const requestedUrl = localStorage.getItem("requestedUrl") || "/"; // Valeur par défaut si non trouvée
            console.log("URL demandée :", requestedUrl);

            localStorage.removeItem("jwt"); // Supprimer le JWT
            window.location.href = "/login"; // Rediriger vers la connexion
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
