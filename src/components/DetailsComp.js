import React from 'react';
import {Col, ListGroup, Row, Stack} from "react-bootstrap";

const DetailsComp = (props) => {


        // // Fonction pour récupérer les données d'un produit
        // const fetchProduitByCodeBarre = async (codeBarre) => {
        //     try {
        //         const data = await produitService.getProduitsByCodeBarre(codeBarre)
        //         setProduit(data);
        //         ajouterAuPanier({
        //             "prixVente": data.prixVente,
        //             "produitId": data.id,
        //             "quantite": nombreProduitDansPanier(data.id) + 1
        //         });
        //         props.setTexte('')
        //
        //     } catch (error) {
        //         setError(error);
        //     }
        // };
        //
        //
        //
        //
        // useEffect(() => {
        //     console.log('relance panier ', props.panier)
        //     if (props.scanAndAdd) {
        //         fetchProduitByCodeBarre(props.codeBarre).then(r => r);
        //
        //     }
        // }, [ props.codeBarre]);


        return (
            <div className="card p-4 shadow">
                <h3 className="card-title text-center">{props.title}</h3>
                <div className="card-body">
                    <ListGroup variant="flush">
                        {props.lines && props.lines.map((line, i) => (
                            <ListGroup.Item key={i} variant={(i % 2 === 0) ? 'light' : 'secondary'}>
                                {line}
                            </ListGroup.Item>
                        ))}</ListGroup>
                </div>


                <Stack direction="horizontal" className="justify-content-end align-items-center" gap={1}>
                    {props.footerList && props.footerList.map((footer, i) => (
                        <div key={i} className="p-2">
                            {footer}
                        </div>
                    ))}
                </Stack>

            </div>
        );
    }
;

export default DetailsComp;