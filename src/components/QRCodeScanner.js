import React, {useState} from 'react';
// import {Scanner} from '@yudiel/react-qr-scanner';
import {Col, Row} from "react-bootstrap";
import produitService from "../services/ProduitService";

const  QRCodeScanner = (props) => {
    const [texte, setTexte] = useState('');
    const [error, setError] = useState(null);


    const handleScan = (result) => {
        if (result) {
            let textValue = result[0].rawValue;
            setTexte(textValue);
            fetchProduitByCodeBarre(textValue).then(r => r)

            console.log('QR Code Data:', textValue);
        }
    };


    const fetchProduitByCodeBarre = async (codeBarre) => {
        try {
            const data = await produitService.getProduitsByCodeBarre(codeBarre)
            // console.log(data)
            console.log('nombreProduitDansPanier(data.id)' ,props.nombreProduitDansPanier(data.id));
            props.ajouterAuPanier({
                "prixVente": data.prixVente,
                "produitId": data.id,
                "quantite":  (props.nombreProduitDansPanier(data.id) + 1)
            });
            props.setTexte('')
            props.setAlert(true);

        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            <Row>
                <Col xs={4}>
                    {/*<div style={{width: '20rem'}}>*/}
                    {/*    <Scanner onScan={handleScan} allowMultiple={true} scanDelay={1000}*/}
                    {/*             style={{width: '100%', height: '100%'}} // Adapter le scanner à la taille du conteneur*/}
                    {/*    />*/}
                    {/*    {texte && (*/}
                    {/*        <span>*/}
                    {/*            Texte : {texte}*/}
                    {/*            </span>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </Col>
                <Col xs={8}>
                    {texte && (
                        // <DetailsComp id={texte} codeBarre={texte} scanAndAdd={!!props.scanAndAdd} setTexte={setTexte} />
                        <></>
                    )}
                </Col>
            </Row>

            <hr/>


        </div>
    );
};

export default QRCodeScanner;
