import React, {useState} from 'react';

import {Button, Col, Form, Modal, Row, Table} from 'react-bootstrap';
import {usePanier} from "../../context/PanierContext";
import InputGroup from "react-bootstrap/InputGroup";
import QRCodeScanner from "../../components/QRCodeScanner";
import SearchClientPopup from "../test/SearchClientPopup";
import axiosInstance from "../../context/axiosInstance";
import {useNavigate} from "react-router-dom";
import ModalDetailProduit from "../../modales/modalDetailProduit";
import AlertComp from "../../components/AlertComp";

const Panier = () => {
    const [showModalClient, setshowModalClient] = useState(false); // Contrôle d'affichage du modal
    const [showModalDetailProduit, setShowModalDetailProduit] = useState(false); // Contrôle d'affichage du modal
    const {panier, ajouterAuPanier ,  retirerDuPanier, calculerTotal} = usePanier();
    const [produitIdModal, setProduitIdModal] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    let initFormClient = {
        "id": 0,
        "nom": '',
        "prenom": "",
        "email": '',
        "telephone": ""
    }
    const [formClient, setFormClient] = useState(initFormClient);
    //Todo => lors de la modification d'un article, il faut peut-etre mettre a jour les produit dans le panier

    const handleAjouterAuPanier = (produit) => {
        ajouterAuPanier({ ...produit, quantite: 1 });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormClient({...formClient, [name]: value});
    };


    const handleSubmitFormAAddLine = async (e) => {
        e.preventDefault();
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
        setFormClient({...formClient,
            id: param.id,
            nom: param.nom,
            prenom: param.prenom,
            email: param.email,
            telephone: param.telephone,

        });
        setshowModalClient(false); // Ferme le modal
    };

    const handleShowModalDetailProduit = async (produitId)=>{
        setProduitIdModal(produitId);
        setShowModalDetailProduit(true);
    }

    const handleIncrease = (itemPanier) =>{
        itemPanier.quantite++;
        ajouterAuPanier(itemPanier)
    }

    const handleDecrease = (itemPanier) =>{
        itemPanier.quantite--;
        ajouterAuPanier(itemPanier)
    }

    const postCaisse = async (caisse) => {
        try {
            let response = await  axiosInstance.post("/ventes/createVenteNLignes", caisse)

            console.log(response.data)

            navigate(`/ventes/${response.data.id}`);
        }catch (error) {
            console.log(error);
        }
    }


    const validerLaVente = ()=> {
        // on a un panier dans le quel on a des items
        // on a un formulaire avec les info client
        // creer une vente
        // creer des ligne
        //creer ou pas le client
        console.log("validerLaVente");
        console.log(panier)
        let caisse = {
            clientNom : formClient.nom,
            clientPrenom : formClient.prenom,
            clientEmail : formClient.email,
            clientTelephone : formClient.telephone,
            venteMontantTotal : 0,
            venteClientId : formClient.id,
            venteEmployeId : 2,
            lignesCaisses : []
        }

        panier.map(item => {
            caisse.lignesCaisses.push({
                lVentePrixVenteUnitaire : item.prixUnitaire,
                lVenteQuantite : item.quantite,
                lVenteProduitId : item.id
            });
        })

        try {
            console.log(caisse)

            postCaisse(caisse);
        }catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <h2>Panier</h2>

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
                        <tr key={item.id || `${item.nom}-${item.prixUnitaire}`}>
                            <td>
                                <Button variant={"outline-primary"} className={"w-100"} onClick={()=>handleShowModalDetailProduit(item.id)}>{item.nom}</Button>
                                </td>
                            <td>{item.prixUnitaire}€</td>
                            <td>
                                <Row>
                                    <Col xs={"2"}>{item.quantite}</Col>
                                    <Col xs={"10"}>
                                        {/*<ProductCartCounter quantity={item.quantite} handleIncrease={()=>handleIncrease(item)} handleDecrease={()=>handleDecrease(item)} />*/}

                                        <Button
                                            variant="outline-secondary" className='w-100 fw-bold '
                                            onClick={() => handleAjouterAuPanier(item)}
                                        >
                                            Ajouter 1
                                        </Button>
                                    </Col>
                                </Row>
                                 </td>
                            <td>{(item.prixUnitaire * item.quantite).toFixed(2)}€</td>
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

            <h3> Informations client </h3>
            <Form onSubmit={handleSubmitFormAAddLine} className={""}>
                <Row className="">
                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                        <Form.Group className="mb-3">
                            <Form.Label className={'fw-bold'}>Id du client</Form.Label>

                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="number"
                                    value={formClient.id}
                                    onChange={handleInputChange}
                                    name='produitId'
                                    className="my-1"
                                />
                                <Button variant={"outline-info"} onClick={() => {
                                    setshowModalClient(true);
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
                            value={formClient.nom}
                            onChange={handleInputChange}
                            placeholder="Nom"
                            name='nom'
                            className="my-1"
                        />
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                        <Form.Label className={'fw-bold'}>prenom</Form.Label>
                        <Form.Control
                            type="text"
                            value={formClient.prenom}
                            onChange={handleInputChange}
                            placeholder="Prénom"
                            name='prenom'
                            className="my-1"
                        />
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                        <Form.Label className={'fw-bold'}>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={formClient.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            name='email'
                            className="my-1"
                        />
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                        <Form.Label className={'fw-bold'}>Email</Form.Label>
                        <Form.Control
                            type="tel"
                            value={formClient.telephone}
                            onChange={handleInputChange}
                            placeholder="Telephone"
                            name='telephone'
                            className="my-1"
                        />
                    </Col>
                </Row>

                <Row className={'justify-content-end mt-3 '}>
                    <Col xs={"3"}>
                        <Button variant={"success"} onClick={validerLaVente } className='w-100'>Valider le panier (Valider la vente)
                            </Button>
                    </Col>
                </Row>
            </Form>


            <br/>
            <br/>
            <h3>Total: {calculerTotal()}€</h3>

            <div className={'mt-3'}>
                <QRCodeScanner scanAndAdd={true} setAlert={setShowAlert}/>
            </div>

            {/* Modal de recherche d'employé */}
            <Modal show={showModalClient} onHide={() => setshowModalClient(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rechercher un Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SearchClientPopup onSelect={handleProductSelect}/>
                </Modal.Body>
            </Modal>

            <ModalDetailProduit  produitId={produitIdModal} showModal={showModalDetailProduit}
                                setShowModal={setShowModalDetailProduit} />
        </div>
    );
};


export default Panier;