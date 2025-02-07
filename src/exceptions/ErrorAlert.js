import { Alert } from "react-bootstrap";
import { XCircle, RefreshCcw, ShieldOff, WifiOff, ServerCrash } from "lucide-react";

const getErrorMessage = (error) => {
    if (!error) return { title: "Erreur inconnue", message: "Une erreur est survenue." };

    const errorMap = {
        400: { title: "Requête invalide", message: "Vérifiez les données envoyées.", icon: <XCircle size={24} /> },
        401: { title: "Accès non autorisé", message: "Veuillez vous connecter.", icon: <ShieldOff size={24} /> },
        403: { title: "Accès interdit", message: "Vous n'avez pas les permissions nécessaires.", icon: <ShieldOff size={24} /> },
        404: { title: "Ressource introuvable", message: "Vérifiez l'ID ou l'URL.", icon: <XCircle size={24} /> },
        408: { title: "Délai dépassé", message: "Le serveur a mis trop de temps à répondre.", icon: <RefreshCcw size={24} /> },
        429: { title: "Trop de requêtes", message: "Veuillez réessayer plus tard.", icon: <RefreshCcw size={24} /> },
        500: { title: "Erreur interne du serveur", message: "Veuillez réessayer plus tard.", icon: <ServerCrash size={24} /> },
        502: { title: "Mauvaise passerelle", message: "Le serveur intermédiaire est en panne.", icon: <ServerCrash size={24} /> },
        503: { title: "Service indisponible", message: "L'API est en maintenance.", icon: <ServerCrash size={24} /> },
        504: { title: "Délai d'attente dépassé", message: "Le serveur est trop lent.", icon: <ServerCrash size={24} /> },
    };

    if (error.response) {
        const { status } = error.response;
        return errorMap[status] || { title: `Erreur ${status}`, message: "Veuillez réessayer plus tard.", icon: <XCircle size={24} /> };
    } else if (error.request) {
        return { title: "Problème de connexion", message: "Le serveur ne répond pas. Vérifiez votre connexion Internet.", icon: <WifiOff size={24} /> };
    } else {
        return { title: "Erreur inconnue", message: "Vérifiez la configuration de l'API.", icon: <XCircle size={24} /> };
    }
};

const ErrorAlert = ({ error }) => {
    if (!error) return null; // Ne rien afficher si aucune erreur

    const { title, message, icon } = getErrorMessage(error);

    return (
        <Alert variant="danger" className="d-flex align-items-center gap-2 mt-3">
            {icon}
            <div>
                <Alert.Heading>{title}</Alert.Heading>
                <p>{message}</p>
            </div>
        </Alert>
    );
};

export default ErrorAlert;
