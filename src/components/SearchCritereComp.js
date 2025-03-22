import React from 'react';
import {Accordion, Button, Col, Container, Form, Row} from "react-bootstrap";

const SearchCritereComp = ({
                               searchInput,
                               handleSearchInput,
                               handleSubmitSearch,
                               handleSubmitFilter,
                               cols
                           }) => {
    return (
        <div>

            {handleSubmitSearch &&
            <form className='my-3' onSubmit={handleSubmitSearch}>
                <Row>

                    <Col  xs={"auto"}>
                        <Button className="mb-md-0 mb-xs-2" type="submit">Recherche</Button>
                    </Col>
                    <Col  md={""}>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchInput}
                            placeholder="Recherche"
                            className="form-control mr-sm-2"
                        />
                    </Col>
                </Row>
            </form>}

            {cols && cols.length > 0 &&
                <Accordion className='my-5' defaultActiveKey='0'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header> Filtre de recherche 🔍</Accordion.Header>
                    <Accordion.Body>
                        {/*<QRCodeScanner />*/}


                        <Form onSubmit={handleSubmitFilter} className='my-3'>

                            <div>
                                <Row className="">
                                    {cols.map((col, index) => (
                                        <Col key={index} xs={12} sm={12} md={6} lg={4} xxl={3}>
                                            {col}

                                        </Col>
                                    ))
                                    }

                                </Row>


                                <Row className="justify-content-end">
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Button type="submit" variant='secondary'
                                                className={'my-2 w-100'}>Filtrer</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Form>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            }
        </div>
    );
};

export default SearchCritereComp;