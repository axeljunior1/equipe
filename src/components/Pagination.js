import React from 'react';
import {Button, Col, Row} from "react-bootstrap";

const Pagination = ({currentPage,pageSize, handlePageChange, handlePageSizeChange, totalPages}) => {


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
                        <select
                            id="pageSize"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="ml-2 form-control">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Pagination;