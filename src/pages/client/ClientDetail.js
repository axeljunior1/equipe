import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AlertComp from "../../components/AlertComp";
import apiCrudService from "../../services/ApiCrudService";
import {Button} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import DetailsComp from "../../components/DetailsComp";

const DetailClient = (props) => {
    const id = useParams().id ?? props.id;
    // const {
    //     panier,
    //     ajouterAuPanier,
    //     retirerDuPanier,
    //     calculerTotal,
    //     nombreProduitDansPanier,
    //     presentDansPanier,
    //     updatePanier
    // } = usePanier();


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);

    // Fonction pour récupérer les données d'un client
    const fetchClient = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.getById('clients', id)
            // console.log(data)
            setClient(data);
            // Important pour ne retourner que les champs utiles pour la mise a jour

        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchClient().then(r => r)// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!client) {
        return <h1>Client introuvable</h1>;
    }

    const lines = [
        <p><strong>Nom :</strong> {client.nom} </p>,
        <p><strong>Prenom :</strong> {client.prenom}</p>,
        <p><strong>Tel :</strong> {client.telephone}</p>,
        <p><strong>Email :</strong> {client.email}</p>,
        <p><strong>Date de création :</strong> {formatDate(client.createdAt)}</p>,
        <p><strong>Actif : </strong> {client.actif ? (<span className="text-success fw-bold"> Oui </span>) : (
            <span className=" fw-bold text-danger"> Non </span>)}</p>,
    ]

    const handleDeleteClient = async (id) => {
        try {
            await apiCrudService.delete("clients", id);
            navigate("/clients?showAlertSupprClient=true");
        } catch (err) {
            setError(err);
        }
    }


    const footerList = [

        <button
            className="btn btn-outline-primary me-2 fw-bold"
            onClick={() => navigate(`/clients/edit/${client.id}`)}
        >
            Modifier
        </button>,
        <Button className="ms-3" variant={"danger"} onClick={() => handleDeleteClient(id)}> Supprimer le
            client
        </Button>
    ]


    return (

        <div className="">
            {showAlertCreation && (
                <AlertComp
                    message="Opération réussie le client a été crée !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertCreation(false)}
                />
            )}

            <h1><strong>Détail du Client</strong></h1>

            <DetailsComp
                lines={lines}
                footerList={footerList}
                title={<span
                    className={client.actif ? 'text-success' : 'text-danger'}> {client.id} - {client.nom} </span>}
            />

        </div>


    );
};

export default DetailClient;
