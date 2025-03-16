import React, {useEffect, useState} from 'react';
import AchatService from "../../services/AchatService";
import achatService from "../../services/AchatService";
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import {useJwt} from "../../context/JwtContext";
import {formatDate} from "../../utils/dateUtils";
import ErrorAlert from "../../exceptions/ErrorAlert";

function Achats() {
    const [achats, setAchats] = useState([]);
    const [error, setError] = useState(null);
    const [createError, setCreateError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {loggedEmployee} = useJwt();

    async function fetchAchats() {
        setLoading(true);
        setError(null);

        try {
            let data = await AchatService.getAchats()
            setAchats(data.content)
        } catch (e) {
            setError(e.response.data);
        }finally {
            setLoading(false);
        }
    }

    useEffect( () => {
         fetchAchats().then(r => {});
    }, []);




    const handleDeleteAchat =async (id) => {
        setLoading(true);
        setError(null);
        try{
            await AchatService.deleteAchat(id);
            fetchAchats().then(r => {});
        }catch(err){
            setError(err);
        }finally {
            setLoading(false);
        }
    };

    if (error) {
        return <ErrorAlert error={error} />;
    }

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
            navigate(`/achats/${restCreateAchat.id}?showAlert=true`);

        }catch(err){
            if (err.response?.data?.message)
                setCreateError(err.response.data.message);
        }finally {
            setLoading(false);
        }

    }

    return (
        <div>
            <h1><strong>Achats</strong></h1>

            {createError &&

                <p className={"mt-3 text-danger"}> Erreur :  {createError} </p>
            }

            <HeaderBtnElementComp titreFil='' variant='outline-primary' onClick={handleCreateAchat}
                                  valueBtn='Créer Achat' />

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Montant</th>
                    <th>Date de création/modification</th>
                    <th>Employé</th>
                    <th>Supprimer ? 🚮</th>
                </tr>
                </thead>
                <tbody>
                {achats.map((achat, index) => (
                    <tr key={achat.id}>
                        <td>{index + 1}</td>
                        <td>
                            <Link to={`/achats/${achat.id}`} className='text-decoration-none'> Achat - {achat.id}</Link>
                        </td>
                        <td>{achat.montantTotal}</td>
                        <td>{formatDate(achat.dateCreation)}</td>
                        <td>
                            <Link to={`/employes/${achat.employeId}`} className='text-decoration-none'>{achat.employe.id} - {achat.employe.nom}</Link>
                        </td>
                        <td>
                            <Button variant={"outline-danger"} className={"w-100"} onClick={()=>handleDeleteAchat(achat.id)}> Supprimer la ligne </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Achats;
