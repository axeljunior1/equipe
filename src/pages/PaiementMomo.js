import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import axiosInstance from "../context/axiosInstance";

function PaiementMoMo() {
    const [telephone, setTelephone] = useState("");
    const [montant, setMontant] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [referenceId, setReferenceId] = useState(null);

    const genererUUID = () => crypto.randomUUID();

    const lancerPaiement = async () => {
        if (!telephone || !montant) {
            setStatus("❗ Numéro et montant requis");
            return;
        }

        const refId = genererUUID();
        setReferenceId(refId);
        setStatus("");
        setLoading(true);

        try {

            let response = await axiosInstance.post("momo/payer", { numero: telephone, montant: montant, referenceId: refId });

            if (response.status !== 200) throw new Error("Erreur d'envoi");

            setStatus("📲 Paiement demandé, validez sur le téléphone...");

            // Vérifier le statut toutes les 3 sec
            const interval = setInterval(async () => {
                const resStatut = await axiosInstance.get(`momo/statut/${refId}`);
                const data = resStatut.data;

                if (data.status && data.status !== "PENDING") {
                    clearInterval(interval);
                    setLoading(false);
                    if (data.status === "SUCCESSFUL") {
                        setStatus("✅ Paiement réussi !");
                    } else {
                        setStatus(`❌ Paiement échoué : ${data.status}`);
                    }
                }
            }, 3000);
        } catch (err) {
            setStatus("❌ Erreur de traitement");
            setLoading(false);
            console.error(err);
        }
    };

    return (
        <Container className="my-5">
            <Card className="shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">💳 Paiement MTN MoMo</Card.Title>
                    <Form>
                        <Form.Group controlId="formTelephone" className="mb-3">
                            <Form.Label>Numéro MoMo</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Ex: 670123456"
                                value={telephone}
                                defaultValue={""}
                                onChange={(e) => setTelephone(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formMontant" className="mb-3">
                            <Form.Label>Montant (F CFA)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ex: 5000"
                                value={montant}
                                onChange={(e) => setMontant(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" onClick={lancerPaiement} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Traitement...
                                    </>
                                ) : (
                                    "🔐 Lancer le paiement"
                                )}
                            </Button>
                        </div>
                    </Form>

                    {status && <Alert variant="info" className="mt-4 text-center">{status}</Alert>}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default PaiementMoMo;
