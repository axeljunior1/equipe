import React from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";

const PaginationComp = ({currentPage, pageSize, handlePageChange, handlePageSizeChange, totalPages, nombreElt}) => {


    let optionPargination = [];

    if (nombreElt > pageSize) {
        // Toujours inclure la valeur actuelle du pageSize
        optionPargination.push(pageSize);

        for (let i = 4; i >= 1; i--) {
            let nbreElement = Math.ceil(nombreElt / i);

            if (!optionPargination.includes(nbreElement)) {
                optionPargination.push(nbreElement);
            }
        }

        // Trier les options par ordre croissant (optionnel mais recommandé)
        optionPargination.sort((a, b) => a - b);
    } else {
        optionPargination = [pageSize];
    }


    return (
        <div>
            {/* Pagination controls */}
            <div className="d-flex justify-content-between">
                <Button
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}>
                    Précédent
                </Button>

                <div>
                    Page {currentPage + 1} sur {totalPages}
                </div>

                <Button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}>
                    Suivant
                </Button>
            </div>

            {/* Page size selection */}
            <div className="my-3">
                <Row>
                    <Col xs="auto">
                        <label htmlFor="pageSize">Produits par page:</label>
                        <Form.Select
                            id="pageSize"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="ml-2 form-control">
                            <option key={10} value={10}>10</option>
                            <option key={50} value={50}>50</option>
                            <option key={100} value={100}>100</option>
                            <option key={200} value={200}>200</option>
                        </Form.Select>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PaginationComp;