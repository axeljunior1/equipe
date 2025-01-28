import React, {useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';
import {Card, Col, Row} from "react-bootstrap";
import ProduitDetailComp from "./ProduitDetailComp";

const QRCodeScanner = (props) => {
    const [texte, setTexte] = useState('');

    const handleScan = (result) => {
        if (result) {
            let textValue = result[0].rawValue?.slice(3);
            setTexte(textValue?.trim());

            console.log('QR Code Data:', textValue);
        }
    };


    return (
        <div>
            <Row>
                <Col xs={4}>
                    <div style={{width: '15rem'}}>
                        <Scanner onScan={(result) => handleScan(result)}
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
                        <ProduitDetailComp id={texte} scanAndAdd={!!props.scanAndAdd}/>

                    )}
                </Col>
            </Row>

            <hr/>


        </div>
    );
};

export default QRCodeScanner;
