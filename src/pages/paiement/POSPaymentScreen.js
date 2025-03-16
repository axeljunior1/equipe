import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import apiCrudService from "../../services/ApiCrudService";
import {useParams} from "react-router-dom";


const POSPaymentScreen = (props) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [vente, setVente] = useState({});
    const {id} = useParams();

    const fetch = async (id) => {
        setError("");
        setLoading(true);
        try {
            let res = await apiCrudService.get(`ventes/${id}`)

            setVente(res);

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
    const confirmPaiement = (action) => {
        setError("");
        setLoading(true);
        try {
            let res = apiCrudService.get(`ventes/payer/${id}`)

            alert('Paiement réussi !!!')

        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">POS - Paiement </h2>

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
                    defaultValue={vente.montantTotal}
                />
            </div>


            <div className="d-flex gap-2">

                <button className="btn btn-success" onClick={confirmPaiement}>
                    Confirmer Paiement
                </button>
                <button className="btn btn-warning disabled" onClick={() => null}>
                    Paiement Partiel
                </button>
                <button className="btn btn-danger disabled" onClick={() => null}>
                    Refuser
                </button>
            </div>
        </div>
    );
};

export default POSPaymentScreen;
