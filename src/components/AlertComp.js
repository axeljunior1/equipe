import { useState, useEffect } from "react";
import { Alert, Button, Fade } from "react-bootstrap";
import { X } from "lucide-react"; // Icône de fermeture

const AlertComp = ({ message, type = "info", timeout = 10000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (timeout) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose && onClose(); // Appel de la fonction de fermeture si fournie
            }, timeout);

            return () => clearTimeout(timer); // Nettoyage du timer
        }
    }, [timeout, onClose]);

    return (
        <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 1050 }} // pour être au-dessus de tout autre contenu
        >
            <Fade in={visible}>
                <Alert
                    variant={type}
                    onClose={() => setVisible(false)}
                    dismissible
                    transition="fade"
                    className="d-flex justify-content-between align-items-center"
                >
                    <span>{message}</span>
                    <Button
                        variant="link"
                        onClick={() => setVisible(false)}
                        className="ml-2 p-0"
                    >
                        <X size={20} />
                    </Button>
                </Alert>
            </Fade>
        </div>
    );
};

export default AlertComp;
