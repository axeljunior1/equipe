import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";

const ProductCartCounter = ({ quantity , handleDecrease, handleIncrease  }) => {

    return (
        <ButtonGroup>
            <Button variant="outline-danger" onClick={handleDecrease()} disabled={!quantity || quantity === 0}>➖</Button>
            <Button variant="light" disabled>{quantity}</Button>
            <Button variant="outline-warning" onClick={handleIncrease()}>➕</Button>
        </ButtonGroup>
    );
};

export default ProductCartCounter;
