import React, {useEffect} from 'react';
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {formatDate} from "../../utils/dateUtils";
import HeaderBtnElementComp from "../../components/HeaderBtnElementComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import useEmploye from "../../hooks/useEmploye";

function Achats() {
    const {fetchAllEmployes, employes, error, loading} = useEmploye()

    const fetchEmployes = async () => {
        await fetchAllEmployes()
    }

    useEffect(() => {
        fetchEmployes().then();
    }, []);



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <ErrorAlert error={error}/>;
    }

    return (
        <div>
            <h1>Gestion des Achats</h1>

            <HeaderBtnElementComp titreFil='creer-employe' variant='outline-primary'
                                  valueBtn='Créer Employe'/>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Roles</th>
                    <th>Date de creation</th>
                </tr>
                </thead>
                <tbody>
                {employes?.map((employe, index) => (
                    <tr key={employe.id}>
                        <td>{index+1}</td>
                        <td>
                            <Link to={`/employes/${employe.id}`} className='text-decoration-none'>{employe.id} - {employe.nom}  </Link>
                        </td>
                        <td>{employe.prenom}</td>
                        <td className="fw-bold">
                            {employe["roles"].length > 3
                                ? employe["roles"].slice(0, 3).map(r => r.nom).join(', ') + '...'
                                : employe["roles"].map(r => r.nom).join(', ')}
                        </td>
                        <td>{formatDate(employe["dateCreation"])}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Achats;
