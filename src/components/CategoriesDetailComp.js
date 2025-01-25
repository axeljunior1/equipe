import React, {useEffect, useState} from 'react';
import categorieService from "../services/CategorieService";

const CategorieDetailComp = (props) => {
    const [categorie, setCategorie] = useState({});
    const [error, setError] = useState(null);




    // Fonction pour récupérer les données d'un categorie
    const fetchCategorie = async (id) => {
        console.log(props.id)
        try {
            const data = await categorieService.getCategoriesById(id)
            console.log(data)
            setCategorie(data);

        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchCategorie(props.id).then(r => null);
    }, [props.id]);



    return (
        <div className="card p-4 shadow">
            <h3 className="card-title text-center">{categorie.nom}</h3>
            <div className="card-body">
                <p><strong>Description :</strong> {categorie.description}</p>
                {categorie.qrCode && (
                    <div>
                        <p><strong>QR Code :</strong></p>
                        <img
                            src={`data:image/png;base64,${categorie.qrCode}`}
                            alt="QR Code"
                            style={{width: "150px", height: "150px", objectFit: "cover"}}
                        />
                    </div>
                )}
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