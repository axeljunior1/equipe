import React, {useEffect, useRef, useState} from 'react';

import {Button, Col, Form, Modal, Row, Table} from 'react-bootstrap';
import axiosInstance from "../../context/axiosInstance";
import {useNavigate} from "react-router-dom";
import ModalDetailProduit from "../../modales/modalDetailProduit";
import AlertComp from "../../components/AlertComp";
import {Search} from "lucide-react";
import {useJwt} from "../../context/JwtContext";
import useMobile from "../../context/useMobile";
import {usePanier} from "../../context/PanierContext";
import ListClients from "../client/ClientList";
import produitService from "../../services/ProduitService";
import BarcodeReader from "../../components/BarcodeReader";

const Panier = () => {
    const [showModalClient, setshowModalClient] = useState(false); // Contrôle d'affichage du modal
    const [showModalDetailProduit, setShowModalDetailProduit] = useState(false); // Contrôle d'affichage du modal
    const {
        panier,
        retirerDuPanier,
        calculerTotal,
        ajouterAuPanier,
        presentDansPanier,
        refreshPanier,
        nombreProduitDansPanier,
        idPanierProduit,
        updatePanier
    } = usePanier();

    const isMobile = useMobile(); // Utilisation du hook
    const [produitIdModal, setProduitIdModal] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [validated, setValidated] = useState(false);
    const {loggedEmployee, panierId} = useJwt();
    const [produit, setProduit] = useState(null);
    const [texte, setTexte] = useState('');
    const [result, setResult] = useState("Aucun résultat");
    const videoRef = useRef(null);



    const [loading, setLoading] = useState(true);

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
    //Todo => lors de la modification d'un article, il faut peut-etre mettre a jour les produits dans le panier

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
        console.log("panier mis à jour :", panier);

        for (const panierElement of panier) {
            if (panierElement.produit.id === 47) {
                console.log("panierElement après mise à jour:", panierElement);
            }
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
            if(panier.length > 0){
                validerLaVente().then()
            }else {
                setError({message : "Le panier est vide ! "})
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
        setshowModalClient(false); // Ferme le modal
    };

    const handleShowModalDetailProduit = async (produitId) => {
        setProduitIdModal(produitId);
        setShowModalDetailProduit(true);
    }

    const validerLaVente = async () => {

        if(!formClient.id) throw new Error('No client ')
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


    const handleScan = async (texte) => {
        console.log(texte)

        setLoading(true);
        try {

            let produit = await produitService.getProduitsByCodeBarre(texte);
            setProduit(produit);

        }catch(err) {
            setError(err);
        }finally {
            setLoading(false);
        }



    }



    let rowQRCode = <Row>
        <Col xs={4}>


            <div style={{width: '20rem'}}>
                {/*<Scanner onScan={handleScan} allowMultiple={true} scanDelay={1500}*/}
                {/*         style={{*/}
                {/*             width: '100%',*/}
                {/*             height: '100%'*/}
                {/*         }} // Adapter le scanner à la taille du conteneur*/}
                {/*/>*/}

                <BarcodeReader onScan={handleScan} setError={setError} />
                <Form.Control
                    type="number"
                    value={formClient.email}
                    onChange={handleInputChange}
                    name='id'
                    className="my-1"
                    required
                    isInvalid={validated && !formClient.id}
                />

            </div>
        </Col>
    </Row>;

    useEffect(() => {

        if (produit !== null) {
            let postData = {
                "prixVente": produit.prixVente,
                "produitId": produit.id,
                "quantite": nombreProduitDansPanier(produit.id) + 1
            };
            ajouterAuPanier(postData);
        }

    }, [produit]);


    return (
        <div>
            <h2>Panier</h2>

            {isMobile && <div className={'my-3'}>
                {rowQRCode}
            </div>}

            {error &&
                <div className="alert alert-danger" role="alert"> {error.message} </div>
            }

            <h3 className="my-4 text-danger">Total: {calculerTotal()}€</h3>

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
                                        onClick={() => handleShowModalDetailProduit(item.produit.id)}>{item.produit.nom}</Button>
                            </td>
                            <td>{item.produit.prixVente}€</td>
                            <td>
                                <Row>
                                    <Col xs={"10"}>
                                        {/*<ProductCartCounter quantity={item.quantite} handleIncrease={()=>handleIncrease(item)} handleDecrease={()=>handleDecrease(item)} />*/}

                                        <Button
                                            variant="outline-primary" className='fw-bold me-3'
                                            onClick={() => handleIncrease(item)}
                                        >
                                            +
                                        </Button>
                                        {item.quantite}
                                        <Button
                                            variant="outline-info" className=' fw-bold ms-3'
                                            onClick={() => handleDecrease(item, 'remove')}
                                        >
                                            -
                                        </Button>
                                    </Col>
                                </Row>
                            </td>
                            <td>{(item.produit.prixVente * item.quantite).toFixed(2)}€</td>
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

            <span className='d-none d-md-block'>            <h3> Informations client </h3>
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
                                setshowModalClient(true)
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

            {!isMobile && <div className={'mt-3'}>

                {rowQRCode}

            </div>}

            {/* Modal de recherche de client */}
            <Modal show={showModalClient} onHide={() => setshowModalClient(false)} size="lg" centered>
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