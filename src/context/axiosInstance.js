import axios from "axios";

const loadConfig = async () => {
    try {
        const response = await fetch("/config.json");
        const config = await response.json();
        return config.BACK_URL;
    } catch (error) {
        console.error("Erreur de chargement de la config:", error);
        return ""; // Valeur par défaut
    }
};

// On initialise directement l'instance Axios avec une URL temporaire
const axiosInstance = axios.create({
    baseURL: "", // Temporaire le temps de charger la config
});

// Charge la config et met à jour l'instance
loadConfig().then((baseUrl) => {
    axiosInstance.defaults.baseURL = `${baseUrl}/`;
    console.log("🚀 Axios configuré sur :", baseUrl);
});

// Intercepteurs
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => new Error(error),
);

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
