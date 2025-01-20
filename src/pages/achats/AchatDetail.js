import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import AchatService from "../../services/AchatService";
import Table from "react-bootstrap/Table";
import LigneAchatService from "../../services/LigneAchatService";

const AchatDetail = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const [achat, setAchat] = useState(null);
    const [ligneAchatIds, setLigneAchatIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour le mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les données du formulaire


    // Fonction pour récupérer les données de l'employé
    const fetchAchat = async () => {
        AchatService.getAchatById(id)
            .then(data => {
                // let lignes  = []
                // if (data && data.ligneAchats.length > 0 ) {
                //     data.ligneAchats.forEach((ligneAchat) => {
                //         LigneAchatService.getLigneAchatById(ligneAchat.id).then(data => {
                //             lignes.push(data)
                //         }).catch(error => console.log(error));
                //     })
                // }
                // setLigneAchatIds(lignes)
                // console.log(lignes)

                setAchat(data)
                fetchLigneAchat(data);
                setFormData(data); // Pré-remplit le formulaire
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    };

    // Fonction pour mettre à jour les données de l'employé
    const updateAchat = async () => {
        AchatService.updateAchat(id, formData).then(data => {
            setAchat(data)
            setFormData(data);
            setIsEditing(false);
        }).catch(err => setError('Une erreur est survenue lors de la mise à jour de l\'employé' + err ));

    };

    const fetchLigneAchat = async (achat) => {
        let lignes = achat.ligneAchats.map((ligneAchat) => ligneAchat.id);
        console.log('lignes :', lignes);

        let ligneData = [];
        try {
            // Utilisation de Promise.all pour attendre toutes les réponses en parallèle
            ligneData = await Promise.all(
                lignes.map((id) => LigneAchatService.getLigneAchatById(id))
            );
            console.log('ligneData :', ligneData);
            setLigneAchatIds(ligneData); // Mise à jour de l'état après que toutes les données sont récupérées
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAchat();
    }, [id]);

    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Gestion des états
    if (loading) {
        return (
            <div className="text-center">
                <h1>Chargement en cours...</h1>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <h1 className="text-danger">{error}</h1>;
    }

    if (!achat) {
        return <h1 className="text-warning">Employé introuvable</h1>;
    }

    return (
        <div className="container mt-5">
            {!isEditing ? (
                <div className="card p-4 shadow">
                    <h3 className="card-title text-center">{achat.nom}</h3>
                    <div className="card-body">
                        <p><strong>Employé :</strong>
                            <Link to={`/employe/${achat.employe.id}`} className='text-decoration-none'> {achat.employe.nom} - {achat.employe.prenom}</Link>
                        </p>
                        <p><strong>Montant :</strong> {achat.montantTotal}</p>
                        <p><strong>Date de Création :</strong> {achat.dateCreation}</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier
                        </button>
                    </div>
                    <br/>
                    <h3> Lignes de l'achat</h3>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Numéro </th>
                            <th>Id Ligne</th>
                            <th>Produit</th>
                            <th>Prix unitaire</th>
                            <th>Qte</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ligneAchatIds.map((ligneAchat, index) => (
                            <tr key={ligneAchat}>
                                <td>{index + 1}</td>
                                <td>{ligneAchat.id}</td>
                                <td> <Link to={`/produits/${ligneAchat.produitId}`} className='text-decoration-none'>{ligneAchat.produitId}</Link></td>
                                <td>{ligneAchat.prixAchatUnitaire}</td>
                                <td>{ligneAchat.quantite}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier l'Achat</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            updateAchat(); // Appelle la fonction de mise à jour
                        }}
                    >
                        {/* Nom */}
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">Montant Total :</label>
                            <input
                                type="text"
                                id=""
                                name="nom"
                                className="form-control"
                                value={formData.montantTotal}
                                onChange={handleChange}
                                placeholder="Entrez le montant total"
                            />
                        </div>

                        {/* Prénom */}
                        <div className="mb-3">
                            <label htmlFor="prenom" className="form-label">Prénom :</label>
                            <input
                                type="text"
                                id="prenom"
                                name="prenom"
                                className="form-control"
                                value={formData.employe.prenom}
                                onChange={handleChange}
                                placeholder="Entrez le prénom"
                            />
                        </div>

                        {/* Date de Création */}
                        <div className="mb-3">
                            <label htmlFor="dateCreation" className="form-label">Date de Création :</label>
                            <input
                                type="date"
                                id="dateCreation"
                                name="dateCreation"
                                className="form-control"
                                value={formData.dateCreation ?  formData.dateCreation.split("T")[0] : ""}
                                onChange={handleChange}
                                placeholder="Entrez la date de création"
                            />
                        </div>

                        {/* Boutons */}
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success">
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AchatDetail;
