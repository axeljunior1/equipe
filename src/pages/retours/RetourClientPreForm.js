import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import apiCrudService from "../../services/ApiCrudService";
import {Form} from "react-bootstrap";

const RetourClientPreForm = (props) => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [typeRetour, setTypeRetour] = useState([]);
    const [etatRetour, setEtatRetour] = useState([]);
    const [etatRetourField, setEtatRetourField] = useState("");
    const [typeRetourField, setTypeRetourField] = useState("");
    const navigate = useNavigate();


    const fetchTypeRetour = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiCrudService.get(`type-retours`);

            setTypeRetour(response.content);
            console.log(response.content);
        } catch (e) {
            setError(e.message);
        }finally {
            setLoading(false);
        }
    }
    const fetchEtatRetour = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiCrudService.get(`etat-retours`);

            setEtatRetour(response.content);
            console.log(response.content);
        } catch (e) {
            setError(e.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTypeRetour();
        fetchEtatRetour();
    }, [])

    const submitForm = async (e) => {
        e.preventDefault();

        if (!typeRetour || !etatRetour) {
            setError("Veuillez choisir un type de retour et un etat de retour");
            return;
        }

        let data = {
            venteId: id,
            typeId: typeRetourField,
            etatId: etatRetourField
        };

        console.log("data", data)

        try {
            setLoading(true);
            setError("");
            const response = await apiCrudService.post(`retours`, data);
            console.log(response);
            navigate(`/retours/${response.id}`);

        }catch (err){
            console.log('error test', err);
            setError(err);
        }finally {
            setLoading(false);
        }
        // console.log(typeRetour);
    }

    if (loading) {
        return <h1>Chargement en cours...</h1>;
    }
    return (
        <div>
            <h1>Retour Client</h1>
            {error && <p className={"text-danger"}> {error} </p>}

            <Form onSubmit={submitForm} className="mt-5">

                <Form.Group controlId="formTypeRetour">
                    <Form.Label>Type de retour</Form.Label>
                    <Form.Select aria-label="Default select example"

                        className="form-select" required
                        value={typeRetourField} defaultValue={""}
                        onChange={(e) => setTypeRetourField(e.target.value)}
                        >
                        <option value=""  disabled hidden  >Choisir un type de retour</option>
                        {typeRetour && typeRetour.length > 0 && typeRetour.map((type) => {
                            return (
                                <option key={type.id} value={type.id}>
                                    {type.libelle}
                                </option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="formEtatRetour" className="mt-3">
                    <Form.Label>Etat de retour</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 className="form-select" required defaultValue=""
                                 value={etatRetourField}
                                 onChange={(e) => setEtatRetourField(e.target.value)}
                    >
                        <option value=""  disabled hidden   >Choisir un type de retour</option>
                        {etatRetour && etatRetour.length > 0 && etatRetour.map((etat) => {
                            return (
                                <option key={etat.id} value={etat.id}>
                                    {etat.libelle}
                                </option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                <button type="submit" className="btn btn-primary mt-3">Créer le retour</button>
            </Form>

        </div>
    );
};

export default RetourClientPreForm;