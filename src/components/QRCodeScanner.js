import React, {useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';
import {Card} from "react-bootstrap";
import produitService from "../services/produitService";

const QRCodeScanner = () => {
    const [produit, setProduit] = useState(null);
    const [texte, setTexte] = useState('');
    const [error, setError] = useState('');

    const handleScan = (result) => {
        if (result) {
            let textValue = result[0].rawValue?.slice(3);
            setTexte(textValue?.trim() );
            fetchProduit(textValue)

            console.log('QR Code Data:', textValue);
        }
    };
    // Fonction pour récupérer les données d'un produit
    const fetchProduit =  async (id) => {
        console.log(id)
        try {
            const data =  await produitService.getProduitsById(id)
            console.log(data)
            setProduit(data);
        } catch (error) {
            setError(error);
        }
    };





    return (
        <div >
            <Card style={{ width: '15rem' }}>
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                            <Scanner onScan={(result) => handleScan(result)}
                                     style={{ width: '100%', height: '100%' }} // Adapter le scanner à la taille du conteneur
                            />
                        {texte && (
                            <span>
                                Texte : {texte}
                            </span>
                        )}

                    </Card.Text>
                </Card.Body>
            </Card>

            <hr/>

            {produit && (
                <div className="card p-4 shadow">
                    <h3 className="card-title text-center">{produit.nom}</h3>
                    <div className="card-body">
                        <p><strong>Prix :</strong> {produit.prixUnitaire} €</p>
                        <p><strong>Description :</strong> {produit.description}</p>
                        <p><strong>Catégorie :</strong> {produit.categorie}</p>
                        <p><strong>Stock initial :</strong> {produit.stockInitial}</p>
                        {produit.qrCode && (
                            <div>
                                <p><strong>QR Code :</strong></p>
                                <img
                                    src={`data:image/png;base64,${produit.qrCode}`}
                                    alt="QR Code"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default QRCodeScanner;
