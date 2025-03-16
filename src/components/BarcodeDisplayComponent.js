import { useEffect, useState } from "react";
import bwipjs from "bwip-js";

const BarcodeComponent = ({ ean13 }) => {
    const [barcode, setBarcode] = useState("");

    useEffect(() => {
        if (ean13) {
            try {
                const canvas = document.createElement("canvas");
                bwipjs.toCanvas(canvas, {
                    bcid: "ean13", // Type de code-barres
                    text: ean13, // Le texte à encoder
                    scale: 3, // Échelle
                    height: 10, // Hauteur des barres
                    includetext: true, // Afficher le texte sous le code-barres
                    textxalign: "center", // Alignement du texte
                });

                setBarcode(canvas.toDataURL("image/png"));
            } catch (err) {
                console.error("Erreur génération code-barres:", err);
            }
        }
    }, [ean13]);

    return (
        <>
            {barcode && (
                <>
                    <span><strong>Code-Barres :   </strong></span>
                    <img
                        src={barcode}
                        alt="Code-Barres"
                        style={{ height: "100px", objectFit: "cover" }}
                    />
                </>
            )}
        </>
    );
};

export default BarcodeComponent;
