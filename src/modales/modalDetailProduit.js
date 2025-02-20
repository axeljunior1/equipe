import React from 'react';
import {Modal} from "react-bootstrap";
import SearchProduitPopup from "../pages/test/SearchProduitPopup";
import DetailsProduit from "../pages/DetailsProduit";

const ModalDetailProduit = (props) => {
    return (
        <div>
            <Modal show={props.showModal} onHide={() => props.setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modale détail produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DetailsProduit id={props.produitId} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalDetailProduit;