import React, {useState} from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const QRCodeScanner = () => {
    const [produits, setProduits] = useState([]);
    const [texte, setTexte] = useState('');

    const handleScan = (result) => {
        if (result) {
            setTexte(result[0].rawValue);
            console.log('QR Code Data:', result);
        }
    };

    const handleError = (error) => {
        console.error('QR Scanner Error:', error);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '300px', height: '300px', overflow: 'hidden', border: '1px solid #ccc', borderRadius: '10px' }}>
                <Scanner onScan={(result) => handleScan(result)}
                    style={{ width: '100%', height: '100%' }} // Adapter le scanner à la taille du conteneur
                   />
            </div>
            {texte && (
                <h1>
                    Texte : {texte}
                </h1>
            )}
        </div>
    );
};

export default QRCodeScanner;
