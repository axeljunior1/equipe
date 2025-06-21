import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import apiCrudService from "../../services/ApiCrudService";
import {useNavigate, useParams} from "react-router-dom";
import useModePaiement from "../../hooks/useModePaiement";


const POSPaymentScreen = (props) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [montantPaiement, setMontantPaiement] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();
    const {modePaiements, error : errorMP, loading: loadingMP, fetchAll} = useModePaiement();

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

    const fetchAllModePaiement = async () => {
        await fetchAll();
    }

    // Charger l'état actuel depuis le backend
    useEffect(() => {
        fetch(id);
    }, []);


    useEffect(() => {
        fetchAllModePaiement();
    }, []);

    useEffect(() => {
        if(modePaiements && modePaiements.length > 0){
            console.log(modePaiements)
        }
    }, [modePaiements]);


    // Envoyer un événement à la state machine backend
    const confirmPaiement = async (action) => {
        if (montantPaiement === "" || montantPaiement <= 0) {
            setError("Veuillez entrer un montant valide");
            return;
        }
        if (!paymentMethod || paymentMethod === "") {
            setError("Veuillez choisir un mode de paiement");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await apiCrudService.post(`ventes/payer/${id}`, {
                montantPaiement: montantPaiement,
                modePaiementId: paymentMethod
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
                    className="form-select" required
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value=""  disabled hidden selected >Choisir un mode de paiement</option>
                    {modePaiements && modePaiements.length > 0 && modePaiements.map((modePaiement) => {
                        return (
                            <option key={modePaiement.id} value={modePaiement.id}>
                                {modePaiement.code}
                            </option>
                        )
                    })}
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
