import React from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {i} from "framer-motion/m";

const PaginationComp = ({currentPage,pageSize, handlePageChange, handlePageSizeChange, totalPages, nombreElt}) => {


    let optionPargination = []

    if (nombreElt > 10) {

        for (let i = 5; i >= 1; i--) {
            let nbreElement = (nombreElt/i).toFixed(0);

            if(optionPargination.indexOf(nbreElement) < 0){
                // console.log(nbreElement)
                optionPargination.push(nbreElement)
            }
        }

    }else{
        optionPargination.push(10);
    }

    if(totalPages <= 1 ) {
        return <></> ;
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
                            {optionPargination.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PaginationComp;