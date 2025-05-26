import React from 'react';
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const HeaderBtnElementComp = (props) => {
    return (
        <div className="">
            <div className="d-flex justify-content-end my-3">
                <Link to={`/${props.titreFil}`} className='text-decoration-none'>
                    <Button variant={props.variant} onClick={props.onClick}>{props.valueBtn}
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default HeaderBtnElementComp;