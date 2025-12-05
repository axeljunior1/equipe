import React, {useEffect, useRef, useState} from "react";
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
        const listener = (e) => {
            if (e.key === "Enter" && scannedCode.length > 0) {
                fetchProduit(scannedCode);
                setScannedCode("");
            } else if (e.key.length === 1) {
                // évite Alt, Shift, etc.
                setScannedCode(prev => prev + e.key);
            }
        };

        document.addEventListener("keydown", listener);

        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [scannedCode]);

    const fetchProduit = async (code) => {
        fetchByCodeBarre(code);
    };


    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return; // ⛔ ne pas exécuter au montage
        }

        if (!produits || !produits.id) return;

        let pro = {
            prixVente: produits.prixVente,
            produitId: produits.id,
            quantite: nombreProduitDansPanier(produits.id) + 1,
        };

        ajouterAuPanier(pro);
        setShowAlertAdd(true);

    }, [produits]);


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
