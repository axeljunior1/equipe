import React from "react";
import { Alert } from "react-bootstrap";

const ErrorDisplay = ({ errors = [] }) => {
    return (
        <>
            {errors.length > 0 && (
                errors.map((error, index) => (
                    <Alert key={index} variant="danger">
                        {error}
                    </Alert>
                ))
            ) }
        </>
    );
};

export default ErrorDisplay;
