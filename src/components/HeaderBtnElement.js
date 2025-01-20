import React from 'react';
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const HeaderBtnElement = (props) => {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end my-3">
                <Button variant={props.variant} onClick={props.onClick}>
                    <Link to={`/${props.titreFil}`} className='text-decoration-none'>{props.valueBtn}</Link>
                </Button>
            </div>
        </div>
    );
};

export default HeaderBtnElement;