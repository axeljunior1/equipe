import React from 'react';
import {Accordion, Button, Col, Container, Form, Row} from "react-bootstrap";

const SearchProduitCritere = ({
                                  searchInput,
                                  handleSearchInput,
                                  handleSubmitSearch,
                                  handleSubmitFilter,
                                  handleInputChange,
                                  filters
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
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Select className="mb-3"
                                                     name="actif"
                                                     value={filters.actif}
                                                     onChange={handleInputChange}
                                                     placeholder="Actif">
                                            <option>Produits actifs uniquement ?</option>
                                            <option value={"true"}>Oui</option>
                                            <option value={"false"}>Non</option>

                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.nom}
                                            onChange={handleInputChange}
                                            placeholder="Nom"
                                            name='nom'
                                            className="my-1"
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.description}
                                            onChange={handleInputChange}
                                            placeholder="Description"
                                            name='description'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.prixUnitaireMin}
                                            onChange={handleInputChange}
                                            placeholder="Prix Unitaire Min"
                                            name='prixUnitaireMin'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.prixUnitaireMax}
                                            onChange={handleInputChange}
                                            placeholder="Prix Unitaire Max"
                                            name='prixUnitaireMax'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.stockInitialMin}
                                            onChange={handleInputChange}
                                            placeholder="Stock Initial Min"
                                            name='stockInitialMin'
                                            className="my-1 "
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Form.Control
                                            type="text"
                                            value={filters.stockInitialMax}
                                            onChange={handleInputChange}
                                            placeholder="Stock Initial Max"
                                            name='stockInitialMax'
                                            className="my-1 "
                                        />
                                    </Col>
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

export default SearchProduitCritere;