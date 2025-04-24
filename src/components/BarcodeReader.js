import React, {useEffect, useState} from "react";
import {usePanier} from "../context/PanierContext";
import AlertComp from "./AlertComp";
import useProduct from "../hooks/useProduct";
import {Alert} from "react-bootstrap";

const BarcodeScanner = () => {
    const {ajouterAuPanier, nombreProduitDansPanier} = usePanier();

    const [scannedCode, setScannedCode] = useState("");
    const [showAlertAdd, setShowAlertAdd] = useState(false);
    const {produits, error, loading, fetchByCodeBarre} = useProduct()

    useEffect(() => {
        const handleKeyD = async (e) => {
            if (e.key === "Enter" && scannedCode.length > 0) {
                await fetchProduit(scannedCode);
                setScannedCode(""); // Réinitialiser après scan
            } else if (e.key !== "Alt" && e.key !== "Shift") {
                console.log(scannedCode);
                setScannedCode((prev) => prev + e.key); // Accumuler les caractères scannés
            }
        };

        document.addEventListener("keydown", handleKeyD);
        return () => {
            document.removeEventListener("keydown", handleKeyD);
        };
    }, [scannedCode]); // Dépendance pour suivre les changements de scannedCode

    const fetchProduit = async (code) => {
        fetchByCodeBarre(code);
    };


    useEffect(() => {
        if (produits) {

            let pro = {
                prixVente: produits.prixVente,
                produitId: produits.id,
                quantite: nombreProduitDansPanier(produits.id) + 1,
            };
            ajouterAuPanier(pro);
            setShowAlertAdd(true);
        }
    }, [produits])

    if (loading) {
        return "Loading...";
    }
    if (typeof error === "string") {
        return <Alert key="danger" variant="danger">
            {error}
        </Alert>;
    }

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
