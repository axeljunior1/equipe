import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import ErrorDisplay from "../components/ErrorDisplay";
import { useJwt } from "../context/JwtContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../context/axiosInstance";

const LoginForm = () => {
    const initialFormLogin = {
        username: "",
        password: "",
    };

    const [formLoging, setFormLoging] = useState(initialFormLogin);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { setJwt, setLoggedEmployee, setPanierId } = useJwt();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            const res = await axiosInstance.post("/login", formLoging); // Utilisation de l'instance Axios
            const token = res.data.token;

            // console.log("Réponse réussie -> Token :", token);
            setJwt(token);

            setLoggedEmployee(JSON.stringify(res.data.employeGetDto));

            let panierId = null;
            res.data.panier?.forEach(panier => {
                if (panier.etat?.libelle === 'EN_COURS') {
                    panierId = panier.id;
                }

            })

            console.log('panierId log form' , panierId);
            setPanierId(panierId);

            // Vérifiez si une URL mémorisée existe
            const requestedUrl = localStorage.getItem("requestedUrl");
            if (requestedUrl) {
                localStorage.removeItem("requestedUrl"); // Nettoyez après redirection
                navigate(requestedUrl); // Redirigez vers l'URL mémorisée
            } else {
                navigate("/"); // Par défaut, redirigez vers la page d'accueil
            }

        } catch (err) {
            if (err.response) {
                setErrors((prevErrors) => [
                    ...prevErrors,
                    `Erreur ${err.response.status}: ${err.response.data.message || "Problème lors de la connexion."}`,
                ]);
            } else if (err.request) {
                setErrors((prevErrors) => [
                    ...prevErrors,
                    "Aucune réponse du serveur. Vérifiez votre connexion réseau.",
                ]);
            } else {
                setErrors((prevErrors) => [
                    ...prevErrors,
                    `Erreur inattendue : ${err.message}`,
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangeField = (e) => {
        const { name, value } = e.target;
        setFormLoging({
            ...formLoging,
            [name]: value,
        });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
            <Row>
                {errors && <Col xl={12} xs={12}>
                    <ErrorDisplay errors={errors}/>
                </Col  >}

                <Col xl={12} xs={12}>
                    <Card style={{ width: "22rem", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Connexion</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Identifiant</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Entrez identifiant"
                                        required
                                        name="username"
                                        value={formLoging.username}
                                        onChange={handleChangeField}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Mot de passe"
                                        required
                                        name="password"
                                        value={formLoging.password}
                                        onChange={handleChangeField}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                    {loading ? "Connexion..." : "Connexion"}
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                <small>
                                    Pas encore inscrit ? <a href="/signup">Créer un compte</a>
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
