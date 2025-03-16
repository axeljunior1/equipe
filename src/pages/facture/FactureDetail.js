import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AlertComp from "../../components/AlertComp";
import apiCrudService from "../../services/ApiCrudService";
import {Button} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import DetailsComp from "../../components/DetailsComp";

const DetailFacture = (props) => {
    const id = useParams().id ?? props.id; // Récupère l'ID depuis l'URL*


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertCreation = queryParams.get("showAlertCreation");

    const [facture, setFacture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlertCreation, setShowAlertCreation] = useState(!!pShowAlertCreation);

    // Fonction pour récupérer les données d'un facture
    const fetchFacture = async () => {
        setLoading(true);
        try {
            const data = await apiCrudService.getById('factures', id)
            // console.log(data)
            setFacture(data);
            // Important pour ne retourner que les champs utiles pour la mise a jour

        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchFacture().then(r => r)// Appel de la fonction asynchrone
    }, []);

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    if (!facture) {
        return <h1>Facture introuvable</h1>;
    }

    const lines = [
        <p><strong>Numero :</strong> {facture.numeroFacture} </p>,
        <p><strong>Montant total :</strong> {facture.montantTotal}</p>,
        <p><strong>Status :</strong> {facture.etatNom}</p>,
        <p><strong>Mode de paiement :</strong> {facture.modePaiement}</p>,
        <p><strong>Email :</strong> {facture.email}</p>,
        <p><strong>Date de création :</strong> {formatDate(facture.createdAt)}</p>,
        <p><strong>Actif : </strong> {facture.actif ? (<span className="text-success fw-bold"> Oui </span>) : (
            <span className=" fw-bold text-danger"> Non </span>)}</p>,
    ]

    const handleDeleteFacture = async (id) => {
        try {
            await apiCrudService.delete("factures", id);
            navigate("/factures?showAlertSupprFacture=true");
        } catch (err) {
            setError(err);
        }
    }


    const footerList = [

        <button
            className="btn btn-outline-primary me-2 fw-bold"
            onClick={() => navigate(`/factures/edit/${facture.id}`)}
        >
            Modifier
        </button>,
        <Button className="ms-3" variant={"danger"} onClick={() => handleDeleteFacture(id)}> Supprimer le
            facture
        </Button>
    ]


    return (

        <div className="">
            {showAlertCreation && (
                <AlertComp
                    message="Opération réussie le facture a été crée !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertCreation(false)}
                />
            )}

            <h1><strong>Détail du Facture</strong></h1>

            <DetailsComp
                lines={lines}
                footerList={footerList}
                title={<span
                    className={facture.actif ? 'text-success' : 'text-danger'}> {facture.id} - {facture.nom} </span>}
            />

        </div>


    );
};

export default DetailFacture;
