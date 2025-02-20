import React from 'react';
import {Accordion, Button, Col, Container, Form, Row} from "react-bootstrap";

const SearchCritereComp = ({
                                  searchInput,
                                  handleSearchInput,
                                  handleSubmitSearch,
                                  handleSubmitFilter,
                                  handleInputChange,
                                  filters, cols
                              }) => {
    return (
        <div>

            <form className='my-3' onSubmit={handleSubmitSearch}>
                <Row>

                    <Col xs="auto">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchInput}
                            placeholder="Recherche"
                            className="form-control mr-sm-2"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit">Recherche</Button>
                    </Col>
                </Row>
            </form>

            <Accordion className='my-3' defaultActiveKey='0'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header> Filtre de recherche 🔍</Accordion.Header>
                    <Accordion.Body>
                        {/*<QRCodeScanner />*/}


                        <Form onSubmit={handleSubmitFilter} className='my-3'>

                            <Container>
                                <Row className="">

                                </Row>


                                <Row className="justify-content-end">
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Button type="submit" variant='secondary'
                                                className={'my-2 w-100'}>Filtrer</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

        </div>
    );
};

export default SearchCritereComp;