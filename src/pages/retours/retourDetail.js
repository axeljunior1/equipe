import React, {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import ProduitListe from "../produit/ProduitsListe";
import AlertComp from "../../components/AlertComp";
import useRetour from "../../hooks/useRetour";
import * as PropTypes from "prop-types";
import Paiement from "../../components/PaiementList";
import useLigneRetour from "../../hooks/useLigneRetour";
import apiCrudService from "../../services/ApiCrudService";


Paiement.propTypes = {data: PropTypes.any};
const RetourDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const {retours: retour, error: errorR, loading: loadingR, fetchById} = useRetour()
    const {error: errorLR, loading: loadingLR, createAll, remove: removeLR} = useLigneRetour()
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pShowAlertPaiement = queryParams.get("pShowAlertPaiement");
    const [showAlertPaiement, setShowAlertPaiement] = useState(!!pShowAlertPaiement);
    const [showModal, setShowModal] = useState(false);
    const [listCheck, setListCheck] = useState({});

    let initFormAddLigne = {
        "prixRetour": 0,
        "quantite": 0,
        "retourId": id,
        "produitId": 0,
        "produitNom": ""
    }
    const [formAddLigne, setFormAddLigne] = useState(initFormAddLigne);
    const [showConfirm, setShowConfirm] = useState(false);


    // Fonction pour récupérer les données de l'employé
    const fetchRetour = async (ide = id) => {
        fetchById(ide)
        // await fetchLigneRetour()
    };


    const fermerRetour = async () => {

    }

    const dellLigneRetour = async (idligne) => {
        let response = await removeLR(idligne)
        if (response.success) {
            console.log(response)
            await fetchRetour(id)
        }
    }


    useEffect(() => {
        fetchRetour(id).then();
    }, [id]);

    useEffect(() => {
        let elt = {};
        let ligneVentes = retour?.vente?.ligneVentes;
        if (ligneVentes) {
            for (let i = 0; i < ligneVentes.length; i++) {
                let init = false;
                for (const ligneRetour of retour.ligneRetours) {
                    console.log(ligneRetour?.ligneVente?.id);
                    if (ligneRetour?.ligneVente?.id === ligneVentes[i].id) {
                        init = true;
                    }
                }
                elt[ligneVentes[i].id] = init;
            }
            setListCheck(elt)
        }
    }, [retour]);


    // Gestion des états
    if (loadingR || loadingLR) {
        return (
            <div className="text-center">
                <h1>Chargement en cours...</h1>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    const handleChangeCheck = (e, id) => {

        console.log(id)
        console.log(e.target.value)
        console.log(e.target.checked)

        let elt = {...listCheck}
        elt[id] = e.target.checked
        setListCheck(elt)
    }


    const handleChangeCheckSelAll = (e) => {
        let check = e.target.checked
        let elt = {...listCheck}
        for (const eltKey in elt) {
            elt[eltKey] = check
        }
        setListCheck(elt)

    }

    const validSelect = async () => {
        let checkOk = []
        retour?.vente?.ligneVentes.forEach((ligne) => {
            if (listCheck[ligne.id] === true) {
                checkOk.push({ligneVenteId: ligne.id, retourId: id, quantite: ligne.quantite})
            }
        })
        console.log(checkOk)

        let response = await createAll(checkOk)

        if (response.success) {
            console.log(response)
            await fetchRetour(id)
        }

    }

    const validerRetour = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await apiCrudService.get(`retours/${id}/valider`);
            console.log(response);
            await fetchRetour(id)

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    const rejeterRetour = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await apiCrudService.get(`retours/${id}/rejeter`);
            console.log(response);
            await fetchRetour(id)

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    if (!retour || retour.length === 0) {
        return <h1 className="text-warning">Retour introuvable</h1>;
    }


    // Fonction pour gérer la sélection d'un employé
    const handleEmployeeSelect = (produit) => {

        setFormAddLigne({
            ...formAddLigne, 'produitId': produit.id,
            "produitNom": produit.nom,
            prixRetour: produit.prixRetour
        });

        setShowModal(false); // Ferme le modal
    };
    const handleCloseNo = () => setShowConfirm(false);
    const handleCloseYes = async () => {
        setShowConfirm(false);
        await fermerRetour();

    }

    if (loading || loadingR || loadingLR) {
        return <div>Loading...</div>;
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

            {error && <Alert className={'mt-3'} variant="danger" dismissible>{error}</Alert>}
            {errorR && <Alert className={'mt-3'} variant="danger" dismissible>{errorR}</Alert>}
            {errorLR && <Alert className={'mt-3'} variant="danger" dismissible>{errorLR}</Alert>}

            <h1><strong>Détail du retour</strong></h1>
            <div className="card p-4 shadow">
                <h3 className="card-title text-center">Retour : {retour.id}</h3>
                <div className="card-body">
                    <p><strong>Employé :</strong>
                        {/*<Link to={`/employes/${retour.id}`}*/}
                        {/*      className='text-decoration-none'> {retour.employe.id} - {retour.employe.prenom}</Link>*/}
                    </p>
                    {/*<p><strong>Montant :</strong> {retour.ligneVente.prixVente}</p>*/}
                    {/*<p><strong>Date de Création :</strong> {formatDate(retour.dateCreation)}</p>*/}
                    <p><strong>Type :</strong> {retour.typeRetour?.libelle}</p>
                    <p className="text-success"><strong>Etat :</strong> {retour.etat.libelle}</p>
                    {/*<p><strong>Reste à payer :</strong> {retour.resteAPayer}</p>*/}
                </div>
                <br/>
                <h3> Lignes du retour</h3>
                {retour && retour.ligneRetours && retour.ligneRetours.length > 0 ? (
                    <Table striped bordered hover className={"mt-2"}>
                        <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Produit</th>
                            <th>Prix unitaire</th>
                            <th>Qte</th>
                            <th>Supprimer 🚮</th>
                        </tr>
                        </thead>
                        <tbody>
                        {retour.ligneRetours?.map((ligne, index) => (
                            <tr key={ligne.id}>
                                <td>{index + 1}</td>
                                <td><Link to={`/produits/${ligne.ligneVente.produitId}`}
                                          className='text-decoration-none'>{ligne.ligneVente.produitId} - {ligne.ligneVente.produitNom}</Link>
                                </td>
                                <td>{ligne.ligneVente.prixVente} {ligne.ligneVente?.produitDeviseVenteSymbole}   </td>
                                <td>{ligne.quantite}</td>
                                <td><Button variant="outline-danger" onClick={() => dellLigneRetour(ligne.id)}>Supprimer
                                    la ligne</Button></td>

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
                    {/*{retour.etat?.libelle !== 'EN_ATTENTE_VALIDATION' && retour.etat?.libelle !== 'FERMEE' &&*/}
                    {/*    <> <Col xs={"3"}>*/}
                    {/*        <Button variant={"primary"} className='w-100' onClick={payerRetour}>Payer </Button>*/}
                    {/*    </Col>*/}
                    {/*    <Col xs={"3"}>*/}
                    {/*        <Button variant={"success"} className='w-100' onClick={payerRetourOM}>Payer Par OM </Button>*/}
                    {/*    </Col> </>*/}
                    {/*}*/}
                    {retour.etat.libelle === 'EN_ATTENTE_VALIDATION' && (
                        <>
                            <Col xs={"3"}>
                                <Button variant={"outline-info"} className='w-100'
                                        onClick={() => validerRetour()}>Valider</Button>
                            </Col>

                            <Col xs={"3"}>
                                <Button variant={"outline-danger"} className='w-100'
                                        onClick={() => rejeterRetour()}>Rejeter</Button>
                            </Col>
                        </>
                    )}

                </Row>

            </div>

            <div className="card p-4 shadow mt-3">
                <h3> Lignes de la ventes </h3>

                {retour && retour.vente && retour.vente &&
                    <Table striped bordered hover className={"mt-3"}>
                        <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Produit</th>
                            <th>Vente</th>
                            <th>Prix unitaire</th>
                            <th>Qte</th>
                            <th><input type="checkbox"
                                       name="selAll"
                                       id="selAll"
                                       onChange={handleChangeCheckSelAll}
                            /> <label htmlFor="selAll">Retourner ? ⏪</label></th>
                        </tr>
                        </thead>
                        <tbody>
                        {retour.vente?.ligneVentes?.map((ligne, index) => (
                            <tr key={ligne.id}>
                                <td>{index + 1}</td>
                                <td><Link to={`/produits/${ligne.produitId}`}
                                          className='text-decoration-none'>{ligne.produitId} - {ligne.produitNom}</Link>
                                </td>
                                <td>{ligne.prixVente} {ligne.produitDeviseVenteSymbole}  </td>
                                <td><Link to={`/ventes/${ligne.venteId}`}
                                          className='text-decoration-none'>Vente - {ligne.venteId}</Link></td>
                                <td>{ligne.quantite}</td>
                                <td>
                                    {/*<Button variant={"primary"} className='w-100'
                                            onClick={() => navigate(`/retours/${retour.id}/ligne/${ligne.id}`)}>
                                        Retourner
                                    </Button>*/}
                                    {ligne?.id &&
                                        <input type="checkbox"
                                               name="retour"
                                               id={ligne.id}
                                               onChange={(e) => handleChangeCheck(e, ligne.id)}
                                               checked={!!listCheck[ligne.id]}
                                               value={ligne.id}/>
                                    }
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </Table>
                }
                <Button variant="outline-primary" className="mt-3 col-3" onClick={validSelect}>Valider le retour de la
                    selection</Button>
                {/*<Paiement paiements={retour.paiements}/>*/}
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


            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fermeture du retour</Modal.Title>
                </Modal.Header>
                <Modal.Body> Voulez vous vraiment fermer la retour ? c'est une action irreversible </Modal.Body>
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

export default RetourDetail;

