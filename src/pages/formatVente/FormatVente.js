import React, {useEffect} from 'react';
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import useFormatVente from "../../hooks/useFormatVente";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";

const FormatVente = () => {

    const {error, loading, formatVentes, fetchAll} = useFormatVente()

    const getFormatsventes = async () => {
        await fetchAll();
    }

    useEffect(() => {
        getFormatsventes()
    }, [])


    const handleCreateAchat = async (e) =>{
        e.preventDefault();
    } ;

    if (loading){
        return <div>Loading.....</div>;
    }


    return (
        <div>
             <h1><strong>Formats ventes</strong></h1>




                <HeaderBtnElementComp titreFil='creer-format-vente' variant='outline-primary'
                                      valueBtn='Créer Format de vente' />


            {formatVentes && formatVentes.length > 0 ?
                (
                    <Table striped bordered hover>
                        <thead>
                        <tr className="text-center align-middle">
                            <th className="text-center align-middle">Nom Produit</th>
                            <th className="text-center align-middle">Unité</th>
                            <th className="text-center align-middle">Quantité</th>
                            <th className="text-center align-middle">Prix de Vente</th>
                        </tr>
                        </thead>
                        <tbody>
                        {formatVentes.map((formatVente) => (
                            <tr key={formatVente.id} className="text-center align-middle">
                                <td className="text-center align-middle">
                                    <Link to={`/produits/${formatVente.produitId}`} className="text-decoration-none">
                                        {formatVente.produitNom}
                                    </Link>
                                </td>
                                <td className="text-center align-middle ">{formatVente.uniteVenteNom}</td>
                                <td className="text-center align-middle ">{formatVente.quantiteParFormat}</td>
                                <td className="text-center align-middle ">{formatVente.prixVente}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>Aucun format de vente</p>
                )
            }


        </div>
    );
};

export default FormatVente;