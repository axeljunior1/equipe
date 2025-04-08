import React from 'react';
import PropTypes from "prop-types";

const CategorieDetailComp = (props) => {

    CategorieDetailComp.propTypes = {
        categories: PropTypes.object,
        isEditing : PropTypes.func
    };


    return (
        <div className="card p-4 shadow">
            <h3 className="card-title text-center">{props.categories.nom}</h3>
            <div className="card-body">
                <p><strong>Description :</strong> {props.categories.description}</p>
            </div>
            <div className="d-flex justify-content-center">
                {props.isEditing && <button
                    className="btn btn-outline-primary me-2 fw-bold"
                    onClick={() => props.isEditing()}
                >
                    Modifier
                </button>}


            </div>
        </div>
    );
};

export default CategorieDetailComp;