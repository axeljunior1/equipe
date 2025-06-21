import React from 'react';
import { Table, Card } from 'react-bootstrap';

const PaiementList = ({ paiements }) => {
    if (!paiements || paiements.length === 0) {
        return <p>Aucun paiement disponible.</p>;
    }

    return (
        <Card className="my-3">
            <Card.Header>Liste des paiements</Card.Header>
            <Card.Body>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>État</th>
                        <th>Mode</th>
                        <th>Référence</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paiements.map((p) => (
                        <tr key={p.idPaiement}>
                            <td>{p.idPaiement}</td>
                            <td>{new Date(p.createdAt).toLocaleString()}</td>
                            <td>{p.montantPaye?.toFixed(2)} (DEV)</td>
                            <td>{p.etat?.libelle}</td>
                            <td>{p.modePaiement?.code || '-'}</td>
                            <td>{p.modePaiement?.reference || '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default PaiementList;
