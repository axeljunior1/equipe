import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScannerList = () => {
    const videoRef = useRef(null);
    const [codes, setCodes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let isMounted = true;

        // Lance la lecture vidéo sur la première caméra disponible
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoInputDevices = devices.filter(d => d.kind === "videoinput");
                if (videoInputDevices.length === 0) {
                    setError("Aucune caméra détectée");
                    return;
                }
                const firstDeviceId = videoInputDevices[0].deviceId;

                codeReader.decodeFromVideoDevice(
                    firstDeviceId,
                    videoRef.current,
                    (result, err) => {
                        if (result && isMounted) {
                            setCodes(prev => {
                                if (!prev.includes(result.getText())) {
                                    return [...prev, result.getText()];
                                }
                                return prev;
                            });
                        }
                        if (err && !err.message.includes("No MultiFormat Readers were able to detect the code")) {
                            console.error(err);
                        }
                    }
                );
            })
            .catch(err => {
                console.error(err);
                setError("Erreur accès caméra");
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <h2>Scanner Codes (QR + Barres)</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <video
                ref={videoRef}
                style={{ width: 620, height: 480, border: "1px solid #ccc" }}
                muted
                autoPlay
            />
            <h3>Liste des codes scannés :</h3>
            <ul>
                {codes.map((code, i) => (
                    <li key={i}>{code}</li>
                ))}
            </ul>
        </div>
    );
};

export default BarcodeScannerList;
