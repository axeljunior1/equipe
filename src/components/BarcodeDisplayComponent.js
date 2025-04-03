import { useEffect, useRef } from "react";
import bwipjs from "bwip-js";

const BarcodeComponent = ({ text, type = "code128", scale = 3, height = 10 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (text) {
            try {
                bwipjs.toCanvas(canvasRef.current, {
                    bcid: type, // Type de code-barres (code128, ean13, ean8, qrcode, etc.)
                    text: text, // Texte à encoder
                    scale: scale, // Échelle
                    height: height, // Hauteur des barres
                    includetext: true, // Inclure le texte sous le code-barres
                    textxalign: "center", // Alignement du texte
                });
            } catch (err) {
                console.error("Erreur génération code-barres:", err);
            }
        }
    }, [text, type, scale, height]);

    return (
        <div style={{ textAlign: "center", padding: "10px" }}>
            <strong>Code-Barres :</strong>
            <br />
            {text ? (
                <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
            ) : (
                <p style={{ color: "red" }}>Aucun code à afficher</p>
            )}
        </div>
    );
};

export default BarcodeComponent;
