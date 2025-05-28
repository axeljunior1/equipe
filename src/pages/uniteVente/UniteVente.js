import React, {useEffect} from 'react';
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import useUniteVente from "../../hooks/useUniteVente";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";

const UniteVente = () => {

    const {error, loading, uniteVentes, fetchAll,totalElements} = useUniteVente()

    const getUnitesventes = async () => {
        await fetchAll();
    }

    useEffect(() => {
        getUnitesventes()
    }, [])

    useEffect(() => {
        if (uniteVentes?.length > 0) {
            console.log(uniteVentes, totalElements)
        }
    }, [uniteVentes])

    const handleCreateAchat = async (e) => {
        e.preventDefault();
    };

    if (loading) {
        return <div>Loading.....</div>;
    }

    return (
        <div>
            <h1><strong>Unites ventes</strong></h1>

            {error && <p className={"text-danger"}> {error} </p>}

            <HeaderBtnElementComp titreFil='creer-unite-vente' variant='outline-primary'
                                  valueBtn='Créer Unite de vente'/>


            {uniteVentes && uniteVentes.length > 0 ?
                (
                    <Table striped bordered hover>
                        <thead>
                        <tr className="text-center align-middle">
                            <th className="text-center align-middle">Code</th>
                            <th className="text-center align-middle">Libelle</th>
                        </tr>
                        </thead>
                        <tbody>
                        {uniteVentes.map((uniteVente) => (
                            <tr key={uniteVente.id} className="text-center align-middle">
                                <td className="text-center align-middle">
                                    <Link to={`/#`} className="text-decoration-none">
                                        {uniteVente.code}
                                    </Link>
                                </td>
                                <td className="text-center align-middle ">{uniteVente.libelle}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>Aucun unite de vente</p>
                )
            }


        </div>
    );
};

export default UniteVente;