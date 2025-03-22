import React, {useEffect, useState} from 'react';
import AchatService from "../../services/AchatService";
import achatService from "../../services/AchatService";
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import {Button, FormControl} from "react-bootstrap";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import {useJwt} from "../../context/JwtContext";
import {formatDate} from "../../utils/dateUtils";
import ErrorAlert from "../../exceptions/ErrorAlert";
import apiCrudService from "../../services/ApiCrudService";

function TarifAchat() {
    const [tarifAchat, setTarifAchat] = useState([]);
    const [error, setError] = useState(null);
    const [createError, setCreateError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {loggedEmployee} = useJwt();

    async function fetchTarifAchat() {
        setLoading(true);
        setError(null);

        try {
            let data = await apiCrudService.get("tarif-achats")
            setTarifAchat(data.content)
        } catch (e) {
            setError(e.response.data);
        }finally {
            setLoading(false);
        }
    }

    useEffect( () => {
         fetchTarifAchat().then(r => {});
    }, []);



    const handleDeleteAchat =async (id) => {
        setLoading(true);
        setError(null);
        try{
            await AchatService.deleteAchat(id);
            fetchTarifAchat().then(r => {});
        }catch(err){
            setError(err);
        }finally {
            setLoading(false);
        }
    };

    if (error) {
        return <ErrorAlert error={error} />;
    }


    const handleMassUpdate = (updatedTarifs) => {
    };

// Exemple : augmenter tous les tarifs de 10%
    const handleIncreaseAllPrices = () => {
        // const updatedTarifs = tarifs.map((tarif) => ({
        //     id: tarif.id,
        //     prixAchat: tarif.prixAchat * 1.1,
        // }));
        // handleMassUpdate(updatedTarifs);
    };



    const handleCreateAchat = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{

            // let resIdEmploye = await employeService.getEmployesByUsername(username);
            let achat = {
                montantTotal : 0,
                employeId: JSON.parse(loggedEmployee).id
            };
            let restCreateAchat = await achatService.createAchat(achat)
            navigate(`/tarifAchat/${restCreateAchat.id}?showAlert=true`);

        }catch(err){
            if (err.response?.data?.message)
                setCreateError(err.response.data.message);
        }finally {
            setLoading(false);
        }

    }

    function handleEditTarif(id, number) {
        let preValue = tarifAchat;

    }

    return (
        <div>
            <h1><strong>TarifAchat</strong></h1>

            {createError &&

                <p className={"mt-3 text-danger"}> Erreur :  {createError} </p>
            }


            <HeaderBtnElementComp titreFil='' variant='outline-primary' onClick={handleCreateAchat}
                                  valueBtn='Créer Achat' />


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
                        <td>{tarif.produit.id} - {tarif.produit.nom} </td>
                        <td>
                            <FormControl
                                type="number"
                                id={"atar-" + tarif.id}
                                name={"atar-" + tarif.id}
                                value={tarif.prixAchat}
                                onChange={(e) =>
                                    handleEditTarif(tarif.id, parseFloat(e.target.value))
                                }
                            />
                        </td>
                        <td>
                            <Button
                                variant="warning"
                                onClick={() =>
                                    handleEditTarif(tarif.id, tarif.prixAchat)
                                }
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
