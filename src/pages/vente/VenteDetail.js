import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import VenteService from "../../services/VenteService";
import Table from "react-bootstrap/Table";
import LigneVenteService from "../../services/LigneVenteService";
import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {formatDate} from "../../utils/dateUtils";
import apiCrudService from "../../services/ApiCrudService";
import ProduitListe from "../produit/ProduitsListe";

const VenteDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const [vente, setVente] = useState(null);
    const [lignesVentes, setLignesVentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formAddLinesError, setFormAddLinesError] = useState("");
    const [isEditing, setIsEditing] = useState(false); // État pour le mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les données du formulaire
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal

    let initFormAddLigne = {
        "prixVente": 0,
        "quantite": 0,
        "venteId": id,
        "produitId": 0,
        "produitNom": ""
    }
    const [formAddLigne, setFormAddLigne] = useState(initFormAddLigne);


    // Fonction pour récupérer les données de l'employé
    const fetchVente = async () => {
        setLoading(true);
        try {
            let data = await VenteService.getVenteById(id)
            setVente(data)
            await fetchLigneVente(data)
            // setFormData(data) // Pré-remplit le formulaire
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);

            setIsEditing(false);
        }
    };

    // Fonction pour mettre à jour les données de l'employé
    const updateVente = async () => {
        VenteService.updateVente(id, formData).then(data => {
            setVente(data)
            setFormData(data);
            setIsEditing(false);
        }).catch(err => setError('Une erreur est survenue lors de la mise à jour de l\'employé' + err));

    };


    const fetchLigneVente = async () => {

        setLoading(true);
        try {
            let data = await apiCrudService.get(`ventes/${id}/lignes`);
            setLignesVentes(data.content); // Mise à jour de l'état après que toutes les données sont récupérées
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteVente = async () => {
        await VenteService.deleteVente(id);
        navigate('/ventes')

    }
    const payerVente = async () => {
        // await apiCrudService.get(`ventes/${vente.id}/payer`);
        navigate(`/paiement/vente/${vente.id}`)

    }
    const anulerVente = async () => {
        await apiCrudService.get(`ventes/${vente.id}/annuler`);
        navigate('/ventes')

    }
    const rembourserVente = async () => {
        await apiCrudService.get(`ventes/${vente.id}/rembourser`);
        navigate('/ventes')

    }


    useEffect(() => {
        fetchVente();
    }, [id]);


    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
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

    if (!vente) {
        return <h1 className="text-warning">Vente introuvable</h1>;
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormAddLigne({...formAddLigne, [name]: value});
    };

    async function createVenteLine() {
        setLoading(true)
        try {
            await LigneVenteService.createLigneVente(formAddLigne);
            setFormAddLigne({...formAddLigne, 'produitId': 0, "produitNom": "" });
            fetchVente().then();
        } catch (error) {
            console.log(error)
            if (error.response?.data?.message) {
                setFormAddLinesError(error.response.data.message);
            }
        } finally {
            setIsEditing(false);
            setLoading(false)

        }
    }

    const handleSubmitFormAAddLine = async (e) => {
        e.preventDefault();
        await createVenteLine();
    }

    const handleDeleteLigne = async (e, id) => {
        e.preventDefault();
        await LigneVenteService.deleteLigneVente(id)

        await fetchVente();
    }

    // Fonction pour gérer la sélection d'un employé
    const handleEmployeeSelect = (produit) => {

        setFormAddLigne({...formAddLigne, 'produitId': produit.id,
            "produitNom": produit.nom,
            prixVente: produit.prixVente
        });

        setShowModal(false); // Ferme le modal
    };

    return (
        <div className="">

            <h1><strong>Détail de la vente</strong></h1>
            {!isEditing ? (
                <div className="card p-4 shadow">
                    <h3 className="card-title text-center">Vente : {vente.id}</h3>
                    <div className="card-body">
                        <p><strong>Employé :</strong>
                            <Link to={`/employes/${vente.employe.id}`}
                                  className='text-decoration-none'> {vente.employe.id} - {vente.employe.prenom}</Link>
                        </p>
                        <p><strong>Montant :</strong> {vente.montantTotal}</p>
                        <p><strong>Date de Création :</strong> { formatDate(vente.createdAt)}</p>
                        <p><strong>Date de mise à jour :</strong> { formatDate(vente.updatedAt)}</p>
                        <p><strong>Etat :</strong> { vente.etat.libelle}</p>
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
                    <h3> Lignes de la vente</h3>
                    {lignesVentes && lignesVentes.length > 0 ? (
                        <Table striped bordered hover className={"mt-2"}>
                            <thead>
                            <tr>
                                <th>Numéro</th>
                                <th>Produit</th>
                                <th>Prix unitaire</th>
                                <th>Qte</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {lignesVentes?.map((ligne, index) => (
                                <tr key={ligne.id}>
                                    <td>{index + 1}</td>
                                    <td><Link to={`/produits/${ligne.id}`}
                                              className='text-decoration-none'>{ligne.produit.id} - {ligne.produit.nom}</Link>
                                    </td>
                                    <td>{ligne.prixVente}</td>
                                    <td>{ligne.quantite}</td>
                                    <td className={'justify-content-center align-items-center'}>
                                        <Button variant={"outline-danger"} className={'w-100'} onClick={(e) => {
                                            handleDeleteLigne(e, ligne.id)
                                        }}> Supprimer 🚮</Button>

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert severity="warning">
                            <p>Aucun element trouvé </p>
                        </Alert>
                    )}


                    <hr/>

                    <Row className={'justify-content-end mt-3 '}>
                        {vente.etat?.libelle !== 'CONFIRME' &&
                        <Col xs={"3"}>
                            <Button variant={"primary"} className='w-100' onClick={payerVente}>Valider et Imprimer la facture </Button>
                        </Col>
                            }
                        <Col xs={"3"}>
                            <Button variant={"secondary"} className='w-100' onClick={anulerVente}>Annuler</Button>
                        </Col>
                        {/*<Col xs={"3"}>*/}
                        {/*    <Button variant={"info"} className='w-100' onClick={rembourserVente}>Rembourser</Button>*/}
                        {/*</Col>*/}
                        {/*<Col xs={"3"}>*/}
                        {/*    <Button variant={"danger"} className='w-100' onClick={handleDeleteVente}>Supprimmer*/}
                        {/*        l'vente</Button>*/}
                        {/*</Col>*/}
                    </Row>
                </div>
            ) : (
                <div className="card p-4 shadow bg-light">
                    <h3 className="text-center mb-4">Modifier l'Vente</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Empêche le rechargement de la page
                            updateVente(); // Appelle la fonction de mise à jour
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
                                value={formData.dateCreation ? formData.dateCreation.split("T")[0] : ""}
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

            {/* Modal de recherche d'employé */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rechercher un Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProduitListe onSelect={handleEmployeeSelect}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default VenteDetail;


/*

{
    "id": 42,
    "montantTotal": 259.99,
    "createdAt": "2025-02-12T18:55:49.738605",
    "updatedAt": "2025-02-12T08:38:16.367019",
    "clientId": null,
    "clientNom": null,
    "client": {
        "id": 1,
        "nom": "cli 1 ",
        "prenom": "pre cli 1",
        "email": "string@cli1.com",
        "telephone": "0749482336",
        "dateCreation": null
    },
    "actif": true,
    "employeId": 12,
    "employeNom": null,
    "employe": {
        "id": 12,
        "nom": "junior",
        "prenom": "junior",
        "actif": true,
        "rolesIds": [
            1,
            2,
            3,
            4
        ],
        "rolesNoms": [
            "GESTIONNAIRE_STOCK",
            "COMPTABLE",
            "ADMIN",
            "VENDEUR"
        ],
        "role": [
            {
                "id": 1,
                "nom": "ADMIN",
                "description": "Administrateur ayant tous les droits",
                "authorities": [
                    {
                        "id": 2,
                        "nom": "SUPPRIMER_PRODUIT"
                    },
                    {
                        "id": 4,
                        "nom": "GERER_STOCK"
                    }
                ]
            },
            {
                "id": 4,
                "nom": "COMPTABLE",
                "description": "Responsable des finances",
                "authorities": []
            },
            {
                "id": 3,
                "nom": "VENDEUR",
                "description": "Employé chargé des vente",
                "authorities": []
            },
            {
                "id": 2,
                "nom": "GESTIONNAIRE_STOCK",
                "description": "Responsable de la gestion des stocks",
                "authorities": []
            }
        ],
        "dateCreation": "2025-02-10T22:39:42.907528"
    },
    "lignesVenteId": null,
    "ligneVentes": [
        {
            "id": 57,
            "prixUnitaire": null,
            "quantite": 1,
            "venteId": 42,
            "actif": true,
            "produitId": 51,
            "produitNom": null
        }
    ]
}

*/
