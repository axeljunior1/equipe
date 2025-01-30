import React, {useEffect, useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';
import {Card, Col, Row} from "react-bootstrap";
import ProduitDetailComp from "./ProduitDetailComp";
import {usePanier} from "../context/PanierContext";
import produitService from "../services/ProduitService";

const QRCodeScanner = (props) => {
    const [texte, setTexte] = useState('');
    const {ajouterAuPanier, dejaPresent, nombreDansPanier} = usePanier();
    const [error, setError] = useState(null);


    const handleScan = (result) => {
        if (result) {
            let textValue = result[0].rawValue;
            setTexte(textValue);
            fetchProduitByCodeBarre(textValue).then(r => r)

            console.log('QR Code Data:', textValue);
        }
    };
    const handleAjouterAuPanier = (produit) => {
        // console.log(produit)
        ajouterAuPanier({...produit, quantite: 1});
    };
    // useEffect(() => {
    //
    // }, [lastScanned]);

    const fetchProduitByCodeBarre = async (codeBarre) => {
        try {
            const data = await produitService.getProduitsByCodeBarre(codeBarre)
            // console.log(data)
            // setProduit(data);
            handleAjouterAuPanier(data);
            // props.setTexte('')
            props.setAlert(true);

        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            <Row>
                <Col xs={4}>
                    <div style={{width: '15rem'}}>
                        <Scanner onScan={handleScan} allowMultiple={true} scanDelay={1500}
                                 style={{width: '100%', height: '100%'}} // Adapter le scanner à la taille du conteneur
                        />
                        {texte && (
                            <span>
                                Texte : {texte}
                                </span>
                        )}
                    </div>
                </Col>
                <Col xs={8}>
                    {texte && (
                        // <ProduitDetailComp id={texte} codeBarre={texte} scanAndAdd={!!props.scanAndAdd} setTexte={setTexte} />
                        <></>
                    )}
                </Col>
            </Row>

            <hr/>


        </div>
    );
};

export default QRCodeScanner;
