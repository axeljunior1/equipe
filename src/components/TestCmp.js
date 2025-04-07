import React, {useEffect} from 'react';
import useProduct from "../hooks/useProduct";

const TestCmp = () => {

    const {produits, loading, error, fetchByCodeBarre} = useProduct();


    useEffect(() => {
        console.log("fetchByCodeBarre");
        fetchByCodeBarre("9996892070881")
    }, [])

    return (
        <div>

        </div>
    );
};

export default TestCmp;