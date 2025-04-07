import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {Button, FormControl} from "react-bootstrap";
import ErrorAlert from "../../exceptions/ErrorAlert";
import apiCrudService from "../../services/ApiCrudService";
import AlertComp from "../../components/AlertComp";

function TarifAchat() {
    const [tarifAchat, setTarifAchat] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAlertUpdateTA, setShowAlertUpdateTA] = useState(false);

    const [prixAchatValues, setPrixAchatValues] = useState({});

    const handleChange = (id, value) => {
        setPrixAchatValues((prev) => ({...prev, [id]: value}));
    };

    async function fetchTarifAchat() {
        setLoading(true);
        setError(null);

        try {
            let data = await apiCrudService.get("tarif-achats")
            setTarifAchat(data.content)
            let obj = {}
            data.content.forEach(element => {
                obj[element.id] = element.prixAchat;
            })
            setPrixAchatValues(obj)
        } catch (e) {
            setError(e.response.data);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchTarifAchat().then();
    }, []);


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <ErrorAlert error={error}/>;
    }


// Exemple : augmenter tous les tarifs de 10%
    const handleIncreaseAllPrices = () => {
    };


    const handleEditTarif = async (id, value) => {
        console.log(id, value);
        setLoading(true);
        setError(null);

        try {
            await apiCrudService.patch("tarif-achats", id, {prixAchat: value});
            await fetchTarifAchat();
            setShowAlertUpdateTA(true)
        } catch (e) {
            setError(e.response.data);
        } finally {
            setLoading(false);
        }


    }

    return (
        <div>
            <h1><strong>TarifAchat</strong></h1>

            {showAlertUpdateTA && (
                <AlertComp
                    message="Opération réussie le Tarif d'achat a été mis a jour !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertUpdateTA(false)}
                />
            )}


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID Tarif</th>
                    <th>ID Produit</th>
                    <th>Prix Achat</th>
                    <th>Modifier</th>
                </tr>
                </thead>
                <tbody>
                {tarifAchat.map((tarif) => (
                    <tr key={tarif.id}>
                        <td>{tarif.id}</td>
                        <td>
                            {tarif["produit"].id} - {tarif["produit"].nom}
                        </td>
                        <td>
                            <FormControl
                                type="number"
                                id={`${tarif.id}`}
                                name={`${tarif.id}`}
                                value={prixAchatValues[tarif.id] || ""}
                                onChange={(e) => handleChange(tarif.id, e.target.value)}
                            />
                        </td>
                        <td>
                            <Button
                                variant="warning"
                                onClick={() => handleEditTarif(tarif.id, prixAchatValues[tarif.id])}
                            >
                                Modifier
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Button variant="success" onClick={handleIncreaseAllPrices} disabled>
                Augmenter tous les prix
            </Button>

        </div>
    );
}

export default TarifAchat;
