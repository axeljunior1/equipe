import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import VenteService from "../../services/VenteService";
import venteService from "../../services/VenteService";
import Table from "react-bootstrap/Table";
import LigneVenteService from "../../services/LigneVenteService";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import SearchProduitPopup from "../test/SearchProduitPopup";

const VenteDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const [vente, setVente] = useState(null);
    const [lignesVentes, setLignesVentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour le mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les données du formulaire
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal

    let initFormAddLigne = {
        "prixVenteUnitaire": 0,
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
            setFormData(data) // Pré-remplit le formulaire
        } catch (err) {
            setError(err);
        } finally {
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
            let data = await venteService.getVenteLines(id);
            console.log('ligneData :', data);
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
        } catch (error) {
            setError(error);
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
    const handleEmployeeSelect = (id, nom, prixUnitaire) => {
        setFormAddLigne({...formAddLigne, 'produitId': id, "produitNom": nom, prixVenteUnitaire: prixUnitaire});
        setShowModal(false); // Ferme le modal
    };

    return (
        <div className="">

            <h1><strong>Détail de la vente</strong></h1>
            {!isEditing ? (
                <div className="card p-4 shadow">
                    <h3 className="card-title text-center">{vente.nom}</h3>
                    <div className="card-body">
                        <p><strong>Employé :</strong>
                            <Link to={`/employes/${vente.employe.id}`}
                                  className='text-decoration-none'> {vente.employe.nom} - {vente.employe.prenom}</Link>
                        </p>
                        <p><strong>Montant :</strong> {vente.montantTotal}</p>
                        <p><strong>Date de Création :</strong> {vente.dateCreation}</p>
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
                    <h3> Lignes de l'vente</h3>
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
                        {lignesVentes.map((ligne, index) => (
                            <tr key={ligne.id}>
                                <td>{index + 1}</td>
                                <td><Link to={`/produits/${ligne.produitId}`}
                                          className='text-decoration-none'>{ligne.produitId} - {ligne.produitNom}</Link>
                                </td>
                                <td>{ligne.prixUnitaire}</td>
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
                    <Form onSubmit={handleSubmitFormAAddLine} className={"mt-5"}>
                        <Row className="">
                            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label className={'fw-bold'}> {formAddLigne.produitNom ? (<span
                                        className="text-danger"> {formAddLigne.produitNom} </span>) : "Produit ID"}</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="number"
                                            value={formAddLigne.produitId}
                                            onChange={handleInputChange}
                                            name='produitId'
                                            className="my-1"
                                        />
                                        <Button variant={"outline-info"} onClick={() => {
                                            setShowModal(true);
                                        }
                                        }>
                                            🔍Search
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                <Form.Label className={'fw-bold'}>Quantité</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formAddLigne.quantite}
                                    onChange={handleInputChange}
                                    placeholder="Quantité"
                                    name='quantite'
                                    className="my-1"
                                />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                <Form.Label className={'fw-bold'}>Prix Unitaire</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formAddLigne.prixVenteUnitaire}
                                    onChange={handleInputChange}
                                    placeholder="Prix unitaire d'vente"
                                    name='prixVenteUnitaire'
                                    className="my-1"
                                />
                            </Col>
                        </Row>
                        <Row className={'justify-content-end mt-3 '}>
                            <Col xs={"3"}>
                                <Button variant={"outline-primary"} type={'submit'} className='w-100'>Ajouter
                                    la ligne ligne</Button>
                            </Col>
                        </Row>
                    </Form>
                    <hr/>
                    <Row className={'justify-content-end mt-3 '}>
                        <Col xs={"3"}>
                            <Button variant={"danger"} className='w-100' onClick={handleDeleteVente}>Supprimmer
                                l'vente</Button>
                        </Col>
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
                    <SearchProduitPopup onSelect={handleEmployeeSelect}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default VenteDetail;
