import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import {formatDate} from "../../utils/dateUtils";
import ProduitListe from "../produit/ProduitsListe";
import AlertComp from "../../components/AlertComp";
import useVente from "../../hooks/useVentes";
import * as PropTypes from "prop-types";
import Paiement from "../../components/PaiementList";
import apiCrudService from "../../services/ApiCrudService";
import useLigneVente from "../../hooks/useLigneVente";
import RetourClientPreForm from "../retours/RetourClientPreForm";


Paiement.propTypes = {data: PropTypes.any};
const VenteDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal
    const [showModalRetourClient, setShowModalRetourClient] = useState(false); // Contrôle d'affichage du modal
    const {ventes: vente, error, loading, fetchById, fermerVente : closeVente} = useVente()
    const {ventes: lignesVentes, error: errorVL, loading: loadingVL, fetchVenteLines, remove} = useVente()
    const {error: errorLV, loading: loadingLV, remove: removeLV} = useLigneVente()


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
    const [showConfirm, setShowConfirm] = useState(false);


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

    const payerVenteOM = async () => {
        navigate(`/paiement-momo/${vente.id}`)

    }

    const anulerVente = async () => {
        await apiCrudService.get(`ventes/${vente.id}/annuler`);
        navigate('/ventes')

    }

    const fermerVente = async () => {
        await closeVente(id);

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



    if (!vente || vente.length === 0 ) {
        return <h1 className="text-warning">Vente introuvable</h1>;
    }



    const handleDeleteLigne = async (e, id) => {
        e.preventDefault();
        removeLV(id)

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
    const handleCloseNo = () => setShowConfirm(false);
    const handleCloseYes = async () => {
        setShowConfirm(false);
        await fermerVente();

    }

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

            {error && <Alert className={'mt-3'} variant="danger" dismissible>{error}</Alert> }
            {errorVL && <Alert className={'mt-3'} variant="danger" dismissible>{errorVL}</Alert> }
            {errorLV && <Alert className={'mt-3'} variant="danger" dismissible>{errorLV}</Alert> }

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
                    <p className="text-success"><strong>Etat :</strong> {vente.etat.libelle}</p>
                    <p><strong>Reste à payer :</strong> {vente.resteAPayer}</p>
                    <Button variant="danger" className='col-3' onClick={() => setShowModalRetourClient(true)}>Retour Client</Button>
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
                            <th>Format de la vente</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lignesVentes?.map((ligne, index) => (
                            <tr key={ligne.id}>
                                <td>{index + 1}</td>
                                <td><Link to={`/produits/${ligne.id}`}
                                          className='text-decoration-none'>{ligne.produitId} - {ligne.produitNom}</Link>
                                </td>
                                <td>{ligne.prixVente} {ligne.produit?.deviseSymbole} ({ligne.produit?.deviseCode})</td>
                                <td>{ligne.quantite}</td>
                                <td>{ligne.formatVenteLibelle}</td>
                                <td className="text-center align-middle">
                                    <Button
                                        variant="outline-danger"
                                        className={`w-100 ${vente.etat.libelle === 'EN_ATTENTE_PAIEMENT' ? '' : 'disabled'}`}
                                        onClick={(e) => handleDeleteLigne(e, ligne.id)}
                                    >
                                        Supprimer 🚮
                                    </Button>
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



                <Row className={'justify-content-end mt-3 '}>
                    {vente.etat?.libelle !== 'PAYEE' && vente.etat?.libelle !== 'FERMEE' &&
                        <> <Col xs={"3"}>
                            <Button variant={"primary"} className='w-100' onClick={payerVente}>Payer </Button>
                        </Col>
                        <Col xs={"3"}>
                            <Button variant={"success"} className='w-100' onClick={payerVenteOM}>Payer Par OM </Button>
                        </Col> </>
                    }
                    {vente.etat.libelle === 'PAYEE' && (

                        <Col xs={"3"}>
                            <Button variant={"secondary"} className='w-100' onClick={() => setShowConfirm(true)}>Fermer</Button>
                        </Col>

                    )}
                    {vente.etat.libelle === 'EN_ATTENTE_PAIEMENT' && (
                    <Col xs={"3"}>
                        <Button variant={"secondary"} className='w-100' onClick={anulerVente}>Annuler</Button>
                    </Col>
                    )}
                </Row>
            </div>

            <div className="card p-4 shadow mt-3">
                <h3> Paiements de la vente </h3>
                <Paiement paiements={vente.paiements}/>
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


            <Modal show={showModalRetourClient} onHide={() => setShowModalRetourClient(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Retour Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RetourClientPreForm />
                </Modal.Body>
            </Modal>

            <Modal show={showConfirm} onHide={()=>setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fermeture de la vente</Modal.Title>
                </Modal.Header>
                <Modal.Body> Voulez vous vraiment fermer la vente ? c'est une action irreversible </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNo}>
                        Non
                    </Button>
                    <Button variant="primary" onClick={handleCloseYes}>
                        Oui
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VenteDetail;

