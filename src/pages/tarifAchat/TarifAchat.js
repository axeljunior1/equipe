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
import AlertComp from "../../components/AlertComp";

function TarifAchat() {
    const [tarifAchat, setTarifAchat] = useState([]);
    const [error, setError] = useState(null);
    const [createError, setCreateError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAlertUpdateTA, setShowAlertUpdateTA] = useState(false);
    const navigate = useNavigate();
    const {loggedEmployee} = useJwt();

    const [prixAchatValues, setPrixAchatValues] = useState( {});

    const handleChange = (id, value) => {
        setPrixAchatValues((prev) => ({ ...prev, [id]: value }));
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
        }finally {
            setLoading(false);
        }
    }
    // useEffect(()=>{
    //     if (tarifAchat.length > 0) {
    //         let obj = {}
    //         tarifAchat.forEach(element => {
    //             obj[element.id] = element.prixAchat;
    //         })
    //         setPrixAchatValues(obj)
    //     }
    // }, [tarifAchat])


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

    const handleEditTarif = async (id, value) => {
        console.log(id, value);
        setLoading(true);
        setError(null);

        try {
            await apiCrudService.patch("tarif-achats", id , {prixAchat: value});
            await fetchTarifAchat();
            setShowAlertUpdateTA(true)
        } catch (e) {
            setError(e.response.data);
        }finally {
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
                        <td>
                            {tarif.produit.id} - {tarif.produit.nom}
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
