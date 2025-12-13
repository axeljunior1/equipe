import React from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";
import PropTypes from "prop-types";


const PaginationComp = ({currentPage, pageSize, handlePageChange, handlePageSizeChange, totalPages, nombreElt, nbreElmentsSouhaite = DEFAULT_PAGINATION_SIZE}) => {


    return (
        <div>
            {nombreElt > nbreElmentsSouhaite &&
                <>
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
                </>}
        </div>
    );
};

PaginationComp.propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handlePageSizeChange: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
    nombreElt: PropTypes.number.isRequired,

}

export default PaginationComp;