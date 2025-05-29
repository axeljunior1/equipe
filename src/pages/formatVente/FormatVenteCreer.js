import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button, Form, Modal} from 'react-bootstrap';
import useFormatVente from "../../hooks/useFormatVente";
import useUniteVente from "../../hooks/useUniteVente";
import ProduitListe from "../produit/ProduitsListe";

const FormatVenteCreer = () => {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    const [formData, setFormData] = useState({
        produitId: id ?? "",
        uniteVenteId: "",
        libelleFormat: '',
        quantiteParFormat: "",
        prixVente: ""
    });
    const navigate = useNavigate();
    const {error, loading, uniteVentes, fetchAll} = useUniteVente()
    const [formErrors, setFormErrors] = useState({});
    const [showModal, setShowModal] = useState(false); // Contrôle d'affichage du modal
    const {loading: loadingFormatVente, error: errFormatVente, create} = useFormatVente();


    // const {unite } =  useUn

    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fetchAllUniteventes = async () => {
        fetchAll()
    }

    useEffect(() => {
        fetchAllUniteventes();
    }, [])


    // Fonction pour soumettre les données à l'API
    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await create(formData);


        if (res.success) {
            navigate(`/format-vente`);
        }

    };

    const handleProduitSelect = (produit) => {
        console.log(produit)
        setFormData({
            ...formData,
            'produitId': produit.id,
            "produitNom": produit.nom,
            "prixAchat": produit.prixAchat,
            "prixVente": produit.prixVente,
        });
        setShowModal(false); // Ferme le modal
    };


    const handleKeydown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
        }
    }


    if (loading || loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mt-5">
            <h3 className="text-success fw-bold ">Créer un nouveau format de vente</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {/*{errorCat && <div className="alert alert-danger">{errorCat}</div>}*/}
            <Form className=" mt-3 mb-4" onSubmit={handleSubmit}>

                <div className="position-relative">
                    <Form.Floating>
                        <Form.Control
                            type="number"
                            value={formData.produitId}
                            onChange={handleChange}
                            name="produitId"
                            id="produitId"
                            className={`pe-5 ${formErrors.produitId ? "is-invalid" : ""}`}
                            placeholder="Produit ID"
                        />

                        {formErrors.produitId && (
                            <div className="invalid-feedback d-block">
                                {formErrors.produitId}
                            </div>
                        )}
                        <label htmlFor="produitId" className="fw-bold">
                            {formData.produitNom ? (
                                <span className="text-success">{formData.produitNom}</span>
                            ) : (
                                "Produit ID"
                            )}
                        </label>
                    </Form.Floating>
                    <Button
                        variant="outline-info"
                        size="sm"
                        onClick={()=> setShowModal(true)}
                        className="position-absolute top-50 end-0 translate-middle-y me-2"
                        style={{zIndex: 2}}
                    >
                        🔍
                    </Button>
                </div>


                <Form.Group className="my-3">

                    <Form.Label htmlFor="uniteVenteId"> Unité de vente </Form.Label>
                    <Form.Select className="mb-3"
                                 name="uniteVenteId"
                                 value={formData.uniteVenteId} required
                                 onChange={handleChange}
                                 placeholder="Unité de Vente">
                        <option value="" disabled hidden>Entrez l'unité de Vente</option>
                        <>
                            {uniteVentes.map((item) => (
                                <option key={item.id} value={item.id} >{item.code} - {item.libelle}</option>
                            ))}</>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prix Vente</Form.Label>
                    <Form.Control
                        type="number"
                        name="prixVente"
                        value={formData.prixVente}
                        onChange={handleChange}
                        placeholder="Entrez le prix Vente" required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Libellé du format</Form.Label>
                    <Form.Control
                        type="text"
                        name="libelleFormat"
                        value={formData.libelleFormat}
                        onChange={handleChange}
                        placeholder="Entrez le libellé du format" required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Quantité par format</Form.Label>
                    <Form.Control
                        type="number"
                        name="quantiteParFormat"
                        value={formData.quantiteParFormat}
                        onChange={handleChange}
                        placeholder="Entrez la qté par format" required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Créer le formatVente'}
                </Button>
            </Form>

            {/* Modal de recherche d'un produit */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rechercher un Produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProduitListe onSelect={handleProduitSelect}/>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default FormatVenteCreer;
