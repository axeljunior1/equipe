import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import apiCrudService from "../../services/ApiCrudService";
import {useNavigate, useParams} from "react-router-dom";


const POSPaymentScreen = (props) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [montantPaiement, setMontantPaiement] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    const fetch = async (id) => {
        setError("");
        setLoading(true);
        try {
            let res = await apiCrudService.get(`ventes/${id}`)

            setMontantPaiement(res.resteAPayer);

        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }
    }

    // Charger l'état actuel depuis le backend
    useEffect(() => {
        fetch(id);
    }, []);


    // Envoyer un événement à la state machine backend
    const confirmPaiement = async (action) => {
        setError("");
        setLoading(true);
        try {
            await apiCrudService.post(`ventes/payer/${id}`, {
                id: id,
                montantPaiement: montantPaiement,
                modePaiement: paymentMethod
            })


            navigate(`/ventes/${id}?pShowAlertPaiement=true`)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }
    };

    const prisACredit = async () => {
        setError("");
        setLoading(true);
        try {
            await apiCrudService.get(`ventes/credit/${id}`)

            navigate(`/ventes/${id}`)

        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }


    return (
        <div className="container mt-4">
            {error && (
                <p className="text-danger">
                    Erreur : {error}
                </p>
            )}


            <h2 className="mb-3">POS - Paiement : {montantPaiement} </h2>

            <div className="mb-3">
                <label className="form-label">Moyen de paiement</label>
                <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="cash">Espèces</option>
                    <option value="card">Carte Bancaire</option>
                    <option value="mobile">Mobile Money</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Montant à payer</label>
                <input
                    type="number"
                    className="form-control"
                    value={montantPaiement}
                    onChange={(e) => setMontantPaiement( e.target.value)}
                />
            </div>


            <div className="d-flex gap-2">

                <button className="btn btn-success" onClick={confirmPaiement}>
                    Payer
                </button>
                <button className="btn btn-warning " onClick={prisACredit}>
                    Pris à crédit
                </button>
                <button className="btn btn-danger disabled" onClick={() => null}>
                    Refuser
                </button>
            </div>
        </div>
    );
};

export default POSPaymentScreen;
