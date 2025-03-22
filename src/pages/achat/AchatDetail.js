import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import AchatService from "../../services/AchatService";
import achatService from "../../services/AchatService";
import LigneAchatService from "../../services/LigneAchatService";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import AlertComp from "../../components/AlertComp";
import DataTableComp from "../../components/DataTableComp";
import PaginationComp from "../../components/PaginationComp";
import {formatDate} from "../../utils/dateUtils";
import DetailsComp from "../../components/DetailsComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import apiCrudService from "../../services/ApiCrudService";
import ProduitListe from "../produit/ProduitsListe";

const AchatDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search); // Utilise URLSearchParams pour obtenir les paramètres de requête
    const pShowAlert = queryParams.get("showAlert"); // Récupère la valeur de param1

    const [achat, setAchat] = useState(null);
    const [lignesAchats, setLignesAchats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // État pour le mode édition
    const [formData, setFormData] = useState({}); // État pour stocker les données du formulaire
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal
    const [showAlert, setShowAlert] = useState(pShowAlert ? pShowAlert : false);
    const [nombreTotalDeLigne, setNombreTotalDeLigne] = useState(0); // Nombre total de pages

    //Pagination
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const [totalPages, setTotalPages] = useState(0); // Nombre total de pages

    let initFormAddLigne = {
        "prixAchat": 0,
        "prixAchatF": "",
        "quantite": 0,
        "achatId": id,
        "produitId": 0,
        "produitNom": ""
    }
    const [formAddLigne, setFormAddLigne] = useState(initFormAddLigne);


    useEffect(() => {
        fetchAchat().then(r => null);

    }, [currentPage, pageSize]);

    // Fonction pour récupérer les données de l'employé
    const fetchAchat = async () => {
        setLoading(true);
        try {
            let data = await AchatService.getAchatById(Number(id))
            setAchat(data)
            await fetchLigneAchat(data)
            // setFormData(data) // Pré-remplit le formulaire
        } catch (err) {
            setError(err);
        } finally {
            setIsEditing(false);
        }
    };

    // Fonction pour mettre à jour les données de l'employé
    const updateAchat = async () => {
        AchatService.updateAchat(id, formData).then(data => {
            setAchat(data)
            setFormData(data);
            setIsEditing(false);
        }).catch(err => setError('Une erreur est survenue lors de la mise à jour de l\'employé' + err));

    };


    const fetchLigneAchat = async () => {
        setError(null)
        setLoading(true);
        try {
            let data = await achatService.getAchatLines(id);
            setLignesAchats(data.content); // Mise à jour de l'état après que toutes les données sont récupérées
            setTotalPages(data.totalPages); // Assuming 'totalPages' is the total page count
            setNombreTotalDeLigne(data.totalElements)
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteAchat = async () => {
        await AchatService.deleteAchat(id);
        navigate('/achats')

    }


    useEffect(() => {
            fetchAchat();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id]);


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


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormAddLigne({...formAddLigne, [name]: value});
    };

    async function createAchatLine() {
        setLoading(true)
        setError(null)
        try {
            if (formAddLigne.quantite <= 0) throw new Error("Quantité doit être positive et > 0");
            console.log(formAddLigne);

            await apiCrudService.post('ligneAchats', formAddLigne);
            setFormAddLigne({...formAddLigne, 'produitId': 0, "produitNom": "", "prixAchatF": ""});
            fetchAchat();
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        } finally {
            setIsEditing(false);
            setLoading(false)

        }
    }

    const removeColumns = (baseColumns, excludedAccessors) => {
        return baseColumns.filter(col => !excludedAccessors.includes(col.accessor));
    };

    const baseColumns = [

        {
            header: "Produit",
            accessor: "produit",
            render: (value, ligne) => (
                <Link to={`/produits/${ligne.produitId}`} className="text-decoration-none">
                    {ligne.produit?.id} - {ligne.produit?.nom}
                </Link>
            )
        },
        {
            header: "Prix Achat",
            accessor: "prixAchat",
            render: (value, ligne) => <>{ligne.prixAchat}</>  // Affiche le prix unitaire du produit
        },
        {
            header: "Quantité",
            accessor: "quantite",
            render: (value, ligne) => <>{ligne.quantite}</>  // Affiche la quantité
        },
        {
            header: "Supprimer",
            accessor: "delete",
            render: (value, ligne) => (
                <Button variant={"outline-danger"} className="w-100" onClick={(e) => handleDeleteLigne(e, ligne.id)}>
                    Supprimer 🚮
                </Button>
            )  // Bouton de suppression
        }
    ];


    let columns = removeColumns(baseColumns, []);


    const handleSubmitFormAAddLine = async (e) => {
        e.preventDefault();
        if (formAddLigne.quantite <= 0) {
            setError("La quantité doit etre positive et > 0");
            return;
        }
        await createAchatLine();
    }

    const handleDeleteLigne = async (e, id) => {
        e.preventDefault();
        await LigneAchatService.deleteLigneAchat(id)

        await fetchAchat();
    }

    // Fonction pour gérer la sélection d'un employé
    const handleProduitSelect = (produit) => {
        console.log(produit)
        setFormAddLigne({...formAddLigne, 'produitId': produit.id, "produitNom": produit.nom, "prixAchat": produit.prixAchat});
        setShowModal(false); // Ferme le modal
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0); // Reset to first page whenever page size changes
    };
    const lines = [
        <p><strong>Employé :</strong> <Link to={`/employes/${achat.employe.id}`}
                                            className='text-decoration-none'> {achat.employe.id} - {achat.employe.nom}</Link>
        </p>,
        <p><strong>Montant :</strong> {achat.montantTotal}</p>,
        <p><strong>Date de Création :</strong> {formatDate(achat.dateCreation)}</p>
    ]


    const entetes = [
        {title: "Nombre de ligne", value: nombreTotalDeLigne},
    ];




    if (!achat) {
        return <h1 className="text-warning">Achat introuvable</h1>;
    }


    return (
        <div className="">

            {error &&
                <ErrorAlert error={error} />
            }


            {showAlert && (
                <AlertComp
                    message="Opération réussie l'achat a été crée !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlert(false)}
                />
            )}

            <h1><strong>Détail de l'achat</strong></h1>
            {!isEditing ? (

                <div className="">


                    <DetailsComp horizontal={true}
                                 lines={lines}
                                 footerList={[]}
                    />


                    <h3 className="my-3"> Lignes de l'achat</h3>

                    {lignesAchats.length > 0 ? (

                        <DataTableComp data={lignesAchats} columns={columns} entetes={entetes}/>
                    ) : (
                        <div className="text-center text-muted">Aucun element trouvé.</div>
                    )}
                    {/* Pagination controls */}

                    <PaginationComp className={"mb-5"}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    handlePageSizeChange={handlePageSizeChange}
                                    nombreElt={nombreTotalDeLigne}

                    />

                    {/*Todo : passer le form sour formik*/}

                    <Form onSubmit={handleSubmitFormAAddLine} className={"mt-5"}>
                        {error &&
                            <Row>
                                <Col xs={12} className="text-danger my-1">
                                    Erreur : {error}
                                </Col>
                            </Row>}
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

                                <Form.Label className={'fw-bold'}>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formAddLigne.produitNom}
                                    onChange={handleInputChange}
                                    placeholder="Nom du produit"
                                    name='produitNom' readOnly
                                    className="my-1"
                                />
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
                                <Form.Label className={'fw-bold'}>Prix Achat</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formAddLigne.prixAchat}
                                    onChange={handleInputChange}
                                    placeholder="Prix unitaire d'achat"
                                    name='prixAchat'
                                    className="my-1" disabled
                                />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                <Form.Label className={'fw-bold'}>Prix Achat Forcé</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formAddLigne.prixAchatF}
                                    onChange={handleInputChange}
                                    placeholder="Forcer le prix d'achat"
                                    name='prixAchatF'
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
                            <Button variant={"danger"} className='w-100' onClick={handleDeleteAchat}>Supprimmer
                                l'achat</Button>
                        </Col>
                    </Row>
                </div>
            ) : (
                /*
                * Ce n'est plus utile car pour l'instant il n'y a pas d'information à modifier
                * */
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
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rechercher un Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProduitListe onSelect={handleProduitSelect}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AchatDetail;
