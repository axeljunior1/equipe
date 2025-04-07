import React, {useEffect, useState} from 'react';

import {Button, Col, Form, Modal, Row, Table} from 'react-bootstrap';
import axiosInstance from "../../context/axiosInstance";
import {useNavigate} from "react-router-dom";
import ModalDetailProduit from "../../modales/modalDetailProduit";
import AlertComp from "../../components/AlertComp";
import {Search} from "lucide-react";
import {useJwt} from "../../context/JwtContext";
import {usePanier} from "../../context/PanierContext";
import ListClients from "../client/ClientList";
import BarcodeReader from "../../components/BarcodeReader";
import ProduitListe from "../produit/ProduitsListe";

const Panier = () => {
    const [showModalClient, setShowModalClient] = useState(false); // Contrôle d'affichage du modal
    const [showModalDetailProduit, setShowModalDetailProduit] = useState(false); // Contrôle d'affichage du modal
    const {
        fetchCart,
        panier,
        retirerDuPanier,
        calculerTotal,
        ajouterAuPanier,
        updatePanier
    } = usePanier();

    const [produitIdModal, setProduitIdModal] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [validated, setValidated] = useState(false);
    const {loggedEmployee, panierId} = useJwt();
    const [qtes, setQtes] = useState({});


    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    let initFormClient = {
        "id": undefined,
        "nom": '',
        "prenom": "",
        "email": '',
        "telephone": ""
    }
    const [formClient, setFormClient] = useState(initFormClient);

    const handleUpdatePanier = item => {
        let data =
            {
                "prixVente": item.prixVente,
                "id": item.id,
                "quantite": item.quantite
            }
        updatePanier(data);
    };


    useEffect(() => {
        let obj = {}

        for (const panierElement of panier) {
            obj[panierElement["id"]] = panierElement["quantite"];
            setQtes(obj)
        }
    }, [panier]); //

    const handleIncrease = (itemPanier) => {
        itemPanier.quantite++;
        handleUpdatePanier(itemPanier)
    }

    const handleDecrease = (itemPanier) => {
        if (itemPanier.quantite === 1) {
            retirerDuPanier(itemPanier.id);
        } else {
            itemPanier.quantite--;
            handleUpdatePanier(itemPanier)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormClient({...formClient, [name]: value});
    };


    const handleSubmitFormAAddLine = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();

        } else {
            if (panier.length > 0) {
                validerLaVente().then()
            } else {
                setError({message: "Le panier est vide ! "})
            }
            // Formulaire valide, procéder avec l'envoi des données
            console.log('Données soumises:', formClient);
        }

        setValidated(true);

    }
    // Fonction pour gérer la sélection d'un employé
    const handleProductSelect = (param) => {
        // param = {
        //     id : client.id ,
        //     nom : client.nom ,
        //     prenom : client.prenom ,
        //     email : client.email ,
        //     telephone: client.telephone
        // }
        setFormClient({
            ...formClient,
            id: param.id,
            nom: param.nom,
            prenom: param.prenom,
            email: param.email,
            telephone: param.telephone,

        });
        setShowModalClient(false); // Ferme le modal
    };

    const handleShowModalDetailProduit = async (produitId) => {
        setProduitIdModal(produitId);
        setShowModalDetailProduit(true);
    }

    const validerLaVente = async () => {

        if (!formClient.id) throw new Error('No client ')
        let caisse = {
            idClient: formClient.id,
            idPanier: panierId,
            idEmploye: JSON.parse(loggedEmployee)?.id
        }

        setLoading(true);
        setError(null);
        try {
            let response = await axiosInstance.post("/ventes/valide-panier", caisse)

            console.log(response.data)

            navigate(`/ventes/${response.data.id}`);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }


    const [isHovered, setIsHovered] = useState(false);


    const handleQteChange = (id, val) => {
        setQtes({...qtes, [id]: val});
    }
    const handleQteBlur = (item) => {

        ajouterAuPanier(item)
    }


    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <div>
            <h2>Panier</h2>


            {error &&
                <div className="alert alert-danger" role="alert"> {error.message} </div>
            }

            <h3 className="my-4 text-danger">Total: {calculerTotal()}€</h3>

            <BarcodeReader/>


            {showAlert && (
                <AlertComp
                    message="Opération réussie le produit a été ajouté au panier !"
                    type="success"
                    timeout={9500} // L'alerte disparaît après 5 secondes
                    onClose={() => setShowAlert(false)}
                />
            )}

            {panier.length === 0 ? (
                <p>Votre panier est vide.</p>

            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {panier.map((item) => (
                        <tr key={item.id || `${item.nom}-${item.prixVente}`}>
                            <td>
                                <Button variant={"outline-primary"} className={"w-100"}
                                        onClick={() => handleShowModalDetailProduit(item["produit"].id)}>{item["produit"].nom}</Button>
                            </td>
                            <td>{item["produit"].prixVente}€</td>
                            <td>
                                <Row>
                                    <Col>
                                        {/*<ProductCartCounter quantity={item.quantite} handleIncrease={()=>handleIncrease(item)} handleDecrease={()=>handleDecrease(item)} />*/}

                                        <Row className="d-flex justify-content-around">
                                            <Col xs={4}>
                                                <Button
                                                    variant="outline-primary" className='fw-bold me-3'
                                                    onClick={() => handleIncrease(item)}
                                                >
                                                    +
                                                </Button>
                                            </Col>
                                            <Col xs={4}>
                                                <Form.Control className="col-2"

                                                              type={"number"}
                                                              id={item.id}
                                                              value={qtes[item.id]}
                                                              onChange={(e) => handleQteChange(item.id, e.target.value)}
                                                              onBlur={(e) => handleQteBlur(
                                                                  {
                                                                      "prixVente": item["produit"].prixVente,
                                                                      "produitId": item["produit"].id,
                                                                      "quantite": e.target.value,
                                                                  }
                                                              )}

                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Button
                                                    variant="outline-info" className=' fw-bold ms-3'
                                                    onClick={() => handleDecrease(item)}
                                                >
                                                    -
                                                </Button>
                                            </Col>
                                        </Row>


                                    </Col>
                                </Row>
                            </td>
                            <td>{(item["produit"].prixVente * item.quantite).toFixed(2)}€</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => retirerDuPanier(item.id)}
                                >
                                    Retirer
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>


                </Table>
            )}

            <br/>
            <br/>

            <span className='d-none d-md-block'>
                <h3> Informations client </h3>
                <Form onSubmit={handleSubmitFormAAddLine} className={""} validated={validated}>
                    <Row className="">
                        <Col xs={12} sm={12} md={6} lg={4} xxl={3} className="position-relative d-inline mt-2">
                            <Form.Label className={'fw-bold'}>Id du client</Form.Label>

                            <Form.Control
                                type="number"
                                value={formClient.id}
                                onChange={handleInputChange}
                                name='id'
                                className="my-1"
                                required
                                isInvalid={validated && !formClient.id}
                            />
                    <Form.Control.Feedback type="invalid">
                        Ce champ est requis.
                    </Form.Control.Feedback>
                            <button
                                className="btn position-absolute top-50 end-0 me-10 pe-10 py-0 "
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShowModalClient(true)
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                title="Rechercher"

                            >
                                <Search className={isHovered ? "text-success" : "text-info"} size={30}/>
                            </button>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} xxl={3} className="mt-2">
                            <Form.Label className={'fw-bold'}>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                value={formClient.nom}
                                onChange={handleInputChange}
                                placeholder="Nom"
                                name='nom'
                                className="my-1"
                                required readOnly
                                isInvalid={validated && !formClient.nom}
                            />
                    <Form.Control.Feedback type="invalid">
                        Ce champ est requis.
                    </Form.Control.Feedback>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} xxl={3} className="mt-2">
                            <Form.Label className={'fw-bold'}>prenom</Form.Label>
                            <Form.Control
                                type="text"
                                value={formClient.prenom}
                                onChange={handleInputChange}
                                placeholder="Prénom"
                                name='prenom'
                                className="my-1"
                                required readOnly
                                isInvalid={validated && !formClient.prenom}
                            />
                    <Form.Control.Feedback type="invalid">
                        Ce champ est requis.
                    </Form.Control.Feedback>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} xxl={3} className="mt-2">
                            <Form.Label className={'fw-bold'}>Email</Form.Label>
                            <Form.Control
                                type="text"
                                value={formClient.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                name='email' readOnly
                                className="my-1"
                            />
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} xxl={3} className="mt-2">
                            <Form.Label className={'fw-bold'}>Telephone</Form.Label>
                            <Form.Control
                                type="tel"
                                value={formClient.telephone}
                                onChange={handleInputChange}
                                placeholder="Telephone"
                                name='telephone'
                                className="my-1"
                                required readOnly
                                isInvalid={validated && !formClient.telephone}
                            />
                    <Form.Control.Feedback type="invalid">
                        Ce champ est requis.
                    </Form.Control.Feedback>
                        </Col>
                    </Row>

                    <Row className={'justify-content-end mt-3 '}>
                        <Col xs={"3"}>
                            <Button variant={"success"} type="submit" className='w-100'>
                                Valider la vente
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <br/>
                <br/>
            </span>
            <div className="my-3">
                <ProduitListe panierList={true}/>
            </div>


            {/* Modal de recherche de client */}
            <Modal show={showModalClient} onHide={() => setShowModalClient(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rechercher un Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListClients onSelect={handleProductSelect}/>
                </Modal.Body>
            </Modal>

            <ModalDetailProduit produitId={produitIdModal} showModal={showModalDetailProduit}
                                setShowModal={setShowModalDetailProduit}/>
        </div>
    );
};


export default Panier;