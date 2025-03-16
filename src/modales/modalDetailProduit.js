import React from 'react';
import {Modal} from "react-bootstrap";
import ProduitDetail from "../pages/produit/ProduitDetail";

const ModalDetailProduit = (props) => {
    return (
        <div>
            <Modal show={props.showModal} onHide={() => props.setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modale détail produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProduitDetail id={props.produitId} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalDetailProduit;