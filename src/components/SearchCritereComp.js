import React, { useState, useEffect } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FilterInput = ({ name, value, onChange, placeholder }) => (
    <Form.Control
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="my-1"
    />
);

const FilterSelect = ({ name, value, onChange, options, placeholder }) => (
    <Form.Select
        name={name}
        value={value}
        onChange={onChange}
        className="mb-3"
    >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </Form.Select>
);

const SearchCritereComp = ({
                               searchInput,
                               handleSearchInput,
                               handleSubmitSearch,
                               handleSubmitFilter,
                               cols,
                           }) => {
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const initialFilters = {};
        cols.forEach(col => {
            initialFilters[col.name] = '';
        });
        setFilters(initialFilters);
    }, [cols]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    return (
        <div>
            <form className="my-3" onSubmit={handleSubmitSearch}>
                <Row>
                    <Col xs="auto">
                        <Button type="submit" className="mb-md-0 mb-xs-2">
                            Recherche
                        </Button>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchInput}
                            placeholder="Recherche"
                            className="form-control mr-sm-2"
                        />
                    </Col>
                </Row>
            </form>

            {cols && cols.length > 0 && (
                <Accordion className="my-5" defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Filtre de recherche 🔍</Accordion.Header>
                        <Accordion.Body>
                            <Form onSubmit={handleSubmitFilter} className="my-3">
                                <Row>
                                    {cols.map((col, index) => {
                                        if (col.type === 'text') {
                                            return (
                                                <Col key={index} xs={12} sm={12} md={6} lg={4} xxl={3}>
                                                    <FilterInput
                                                        name={col.name}
                                                        value={filters[col.name]}
                                                        onChange={handleInputChange}
                                                        placeholder={col.placeholder}
                                                    />
                                                </Col>
                                            );
                                        }
                                        if (col.type === 'select') {
                                            return (
                                                <Col key={index} xs={12} sm={12} md={6} lg={4} xxl={3}>
                                                    <FilterSelect
                                                        name={col.name}
                                                        value={filters[col.name]}
                                                        onChange={handleInputChange}
                                                        options={col.options}
                                                        placeholder={col.placeholder}
                                                    />
                                                </Col>
                                            );
                                        }
                                        return null;
                                    })}
                                </Row>
                                <Row className="justify-content-end">
                                    <Col xs={12} sm={12} md={6} lg={4} xxl={3}>
                                        <Button type="submit" variant="secondary" className="my-2 w-100">
                                            Filtrer
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}
        </div>
    );
};

SearchCritereComp.propTypes = {
    searchInput: PropTypes.string,
    handleSearchInput: PropTypes.func,
    handleSubmitSearch: PropTypes.func,
    handleSubmitFilter: PropTypes.func,
    cols: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['text', 'select']).isRequired,
            placeholder: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.object),
        })
    ),
};

export default SearchCritereComp;
