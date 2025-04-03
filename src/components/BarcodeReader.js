import React, { useState, useEffect } from "react";
import apiCrudService from "../services/ApiCrudService";
import { usePanier } from "../context/PanierContext";
import AlertComp from "./AlertComp";

const BarcodeScanner = () => {
    const { ajouterAuPanier, nombreProduitDansPanier } = usePanier();

    const [scannedCode, setScannedCode] = useState("");
    const [showAlertAdd, setShowAlertAdd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleKeyD = async (e) => {
            if (e.key === "Enter" && scannedCode.length > 0) {
                await fetchProduit(scannedCode);
                setScannedCode(""); // Réinitialiser après scan
            } else {
                if (e.key !== "Alt" && e.key !== "Shift") {
                    console.log(scannedCode);
                    setScannedCode((prev) => prev + e.key); // Accumuler les caractères scannés
                }
            }
        };

        document.addEventListener("keydown", handleKeyD);
        return () => {
            document.removeEventListener("keydown", handleKeyD);
        };
    }, [scannedCode]); // Dépendance pour suivre les changements de scannedCode

    const fetchProduit = async (code) => {
        setLoading(true);
        try {
            const data = await apiCrudService.get(`produits/code-barre/${code}`);

            let pro = {
                prixVente: data.prixVente,
                produitId: data.id,
                quantite: nombreProduitDansPanier(data.id) + 1,
            };
            ajouterAuPanier(pro);
            setShowAlertAdd(true);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && <p>{error.message}</p>}
            {showAlertAdd && (
                <AlertComp
                    message="Opération réussie, produit ajouté !"
                    type="success"
                    timeout={5000}
                    onClose={() => setShowAlertAdd(false)}
                />
            )}
        </>
    );
};

export default BarcodeScanner;
