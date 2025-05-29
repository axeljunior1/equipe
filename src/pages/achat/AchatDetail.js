import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Col, Modal, Row} from "react-bootstrap";
import DataTableComp from "../../components/DataTableComp";
import PaginationComp from "../../components/PaginationComp";
import {formatDate} from "../../utils/dateUtils";
import DetailsComp from "../../components/DetailsComp";
import ErrorAlert from "../../exceptions/ErrorAlert";
import ProduitListe from "../produit/ProduitsListe";
import useAchat from "../../hooks/useAchat";
import useLigneAchat from "../../hooks/useLigneAchat";
import AchatAddLineForm from "./AchatAddLineForm";


const AchatDetail = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal

    //Pagination
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const [pageSize, setPageSize] = useState(15); // Taille de la page
    const {achats: achat, error, loading, fetchById} = useAchat()
    const {
        achats: lignesAchats,
        errorAL,
        loadingAL,
        fetchAchatLines,
        remove,
        totalPages: totalPagesAL,
        totalElements: totalElementsAL
    } = useAchat()
    const {error: errorLA, loading: loadingLA, create: createLA, remove: removeLA} = useLigneAchat()
    const [formErrors, setFormErrors] = useState({});


    let initFormAddLigne = {
        "prixAchat": "",
        "prixAchatF": "",
        "quantite": "",
        "achatId": id,
        "produitId": "",
        "produitNom": ""
    }
    const [formAddLigne, setFormAddLigne] = useState(initFormAddLigne);



    // Fonction pour récupérer les données de l'employé
    const fetchAchat = async () => {
        fetchById(id)
    };


    const fetchLigneAchat = async () => {
        fetchAchatLines(id)
    };


    const handleDeleteAchat = async () => {
        remove(id);
        navigate('/achats')

    }

    useEffect(() => {
        fetchAchat().then();
    }, [currentPage, pageSize, id]);



    useEffect(() => {
        fetchLigneAchat().then()
    }, [achat]);


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

        if (formAddLigne.quantite <= 0) throw new Error("Quantité doit être positive et > 0");
        console.log(formAddLigne);

       let res =  await createLA(formAddLigne);
       if (res.success){
           await fetchAchat()
           setFormAddLigne(initFormAddLigne);
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
                    {ligne['produit']?.id} - {ligne['produit']?.nom}
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


    const handleDeleteLigne = async (e, id) => {
        e.preventDefault();

        removeLA(id)

        await fetchAchat()

    }

    // Fonction pour gérer la sélection d'un employé
    const handleProduitSelect = (produit) => {
        console.log(produit)
        setFormAddLigne({
            ...formAddLigne,
            'produitId': produit.id,
            "produitNom": produit.nom,
            "prixAchat": produit.prixAchat
        });
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
        <p key={1}><strong>Employé :</strong> <Link to={`/employes/${achat['employe']?.id}`}
                                                    className='text-decoration-none'> {achat['employe']?.id} - {achat['employe']?.nom}</Link>
        </p>,
        <p key={2}><strong>Montant :</strong> <span className="text-danger"> {achat.montantTotal} </span></p>,
        <p key={3}><strong>Date de Création :</strong> {formatDate(achat['dateCreation'])}</p>
    ]


    const entetes = [
        {title: "Nombre de ligne", value: totalElementsAL},
    ];


    const handleSubmitFormAAddLine = async (e) => {
        e.preventDefault();

        const errors = {};

        if (!formAddLigne.produitId || formAddLigne.produitId <= 0) {
            errors.produitId = "ID produit invalide";
        }
        if (!formAddLigne.quantite || formAddLigne.quantite <= 0) {
            errors.quantite = "Quantité requise";
        }
        if (formAddLigne.prixAchatF && formAddLigne.prixAchatF < 0) {
            errors.prixAchatF = "Prix forcé invalide";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        await createAchatLine();
    };


    if (loading || loadingAL || loadingLA) {
        return <div>Loading...</div>
    }


    if (!achat) {
        return <h1 className="text-warning">Achat introuvable</h1>;
    }


    if (error || errorAL || errorLA) {
        return <h1 className="text-danger"> {error || errorAL || errorLA} </h1>;
    }


    return (
        <div className="">

            {error &&
                <ErrorAlert error={error}/>
            }


            <h1><strong>Détail de l'achat</strong></h1>
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
                                totalPages={totalPagesAL}
                                pageSize={pageSize}
                                handlePageSizeChange={handlePageSizeChange}
                                nombreElt={totalElementsAL}

                />


                <AchatAddLineForm onSubmit={handleSubmitFormAAddLine} formAddLigne={formAddLigne}
                                  onChange={handleInputChange} formErrors={formErrors}
                                  onClick={() => setShowModal(true)}/>
                <hr/>


                <Row className={'justify-content-end mt-3 '}>
                    <Col xs={"3"}>
                        <Button variant={"danger"} className='w-100' onClick={handleDeleteAchat}>Supprimer
                            l'achat</Button>
                    </Col>
                </Row>
            </div>


            {/* Modal de recherche d'un produit */}
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
