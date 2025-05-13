import React, {useEffect} from 'react';
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import {useJwt} from "../../context/JwtContext";
import {formatDate} from "../../utils/dateUtils";
import ErrorAlert from "../../exceptions/ErrorAlert";
import useAchat from "../../hooks/useAchat";

function Achats() {
    const navigate = useNavigate();
    const {loggedEmployee} = useJwt();
    const {achats, error, loading, fetchAllAchats, create, remove} = useAchat()

    async function fetchAchats() {
        await fetchAllAchats()
    }

    useEffect( () => {
         fetchAchats();
    }, []);



    const handleDeleteAchat =async (id) => {
        remove(id)
    };
    if (loading){
        return <div>Loading.....</div>;
    }

    if (error) {
        return <ErrorAlert error={error} />;
    }

    const handleCreateAchat = async (e) =>{
        e.preventDefault();

        if (typeof loggedEmployee === 'string') {
            const parsed = JSON.parse(loggedEmployee);
            let achat = {
                montantTotal: 0,
                employeId: parsed.id,
            };
            let res = await create(achat);
            if (res.success ) {
                navigate(`/achats/${res.data.id}`);
            }
        }
    }


    return (
        <div>
            <h1><strong>Achats</strong></h1>




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
                        <td>{formatDate(achat['dateCreation'])}</td>
                        <td>
                            <Link to={`/employes/${achat.employeId}`} className='text-decoration-none'>{achat['employe'].id} - {achat['employe'].nom}</Link>
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
