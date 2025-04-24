import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import apiCrudService from "../../services/ApiCrudService";
import ProduitListe from "../produit/ProduitsListe";
import AlertComp from "../../components/AlertComp";
import useVente from "../../hooks/useVentes";

const VenteDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal
    const {ventes: vente, error, loading, fetchById} = useVente()
    const {ventes: lignesVentes, error: errorVL, loading: loadingVL, fetchVenteLines, remove} = useVente()


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertPaiement = queryParams.get("pShowAlertPaiement");
    const [showAlertPaiement, setShowAlertPaiement] = useState(!!pShowAlertPaiement);

    let initFormAddLigne = {
        "prixVente": 0,
        "quantite": 0,
        "venteId": id,
        "produitId": 0,
        "produitNom": ""
    }
    const [formAddLigne, setFormAddLigne] = useState(initFormAddLigne);


    // Fonction pour récupérer les données de l'employé
    const fetchVente = async (ide = id) => {
        fetchById(ide)
        await fetchLigneVente()
    };


    const fetchLigneVente = async () => {

        fetchVenteLines(id)

    };


    const payerVente = async () => {
        navigate(`/paiement/vente/${vente.id}`)

    }

    const anulerVente = async () => {
        // await apiCrudService.get(`ventes/${vente.id}/annuler`);
        navigate('/ventes')

    }


    useEffect(() => {
        fetchVente(id).then();
    }, [id]);

    useEffect(() => {
        if (vente && vente.length>0){
            fetchLigneVente().then()
        }
    }, [vente]);


    // Gestion des états
    if (loading || loadingVL) {
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


    if (errorVL) {
        return <h1 className="text-danger">{errorVL}</h1>;
    }

    if (!vente || vente.length === 0 ) {
        return <h1 className="text-warning">Vente introuvable</h1>;
    }



    const handleDeleteLigne = async (e, id) => {
        e.preventDefault();
        remove(id)

        await fetchVente();
    }

    // Fonction pour gérer la sélection d'un employé
    const handleEmployeeSelect = (produit) => {

        setFormAddLigne({
            ...formAddLigne, 'produitId': produit.id,
            "produitNom": produit.nom,
            prixVente: produit.prixVente
        });

        setShowModal(false); // Ferme le modal
    };

    return (
        <div className="">

            {showAlertPaiement && (
                <AlertComp
                    message="Opération réussie le Paiement a été enregistré !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlertPaiement(false)}
                />
            )}

            <h1><strong>Détail de la vente</strong></h1>
            <div className="card p-4 shadow">
                <h3 className="card-title text-center">Vente : {vente.id}</h3>
                <div className="card-body">
                    <p><strong>Employé :</strong>
                        <Link to={`/employes/${vente.employe.id}`}
                              className='text-decoration-none'> {vente.employe.id} - {vente.employe.prenom}</Link>
                    </p>
                    <p><strong>Montant :</strong> {vente.montantTotal}</p>
                    <p><strong>Date de Création :</strong> {formatDate(vente.createdAt)}</p>
                    <p><strong>Date de mise à jour :</strong> {formatDate(vente.updatedAt)}</p>
                    <p><strong>Etat :</strong> {vente.etat.libelle}</p>
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
                            <Button variant={"primary"} className='w-100' onClick={payerVente}>Valider et Imprimer la
                                facture </Button>
                        </Col>
                    }
                    <Col xs={"3"}>
                        <Button variant={"secondary"} className='w-100' onClick={anulerVente}>Annuler</Button>
                    </Col>
                </Row>
            </div>

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
