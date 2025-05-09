import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import apiCrudService from "../../services/ApiCrudService";
import useCategory from "../../hooks/useCategory";

const ProduitCreer = () => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        image: '',
        quantity: 0,
        prixUnitaire: 0,
        categorieId: '',
        ean13: '',
        stockInitial: 0

    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {categories, fetchCategories, loading: loadingCat, error: errorCat} = useCategory();

    // Gestion des modifications du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };




    // Fonction pour soumettre les données à l'API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response = await apiCrudService.post('produits',formData);
            debugger;
            navigate(`/produits/${response.id}?showAlertCreation=true`);

        }catch (error) {
            setError(error);
        }finally {
            setLoading(false);
        }


    };
    const initPro = [
        { nom: "Coque de téléphone transparente", description: "Coque légère et résistante.", ean13: "1234567890001", image: "coque_transparente.jpg", prixVente: 9.99, prixAchat: 4.5, categorieId: 1, seuilProduit: 10, stockInitial: 50 },
        { nom: "Chargeur sans fil rapide", description: "Chargeur induction 15W.", ean13: "1234567890002", image: "chargeur_sans_fil.jpg", prixVente: 24.99, prixAchat: 12.5, categorieId: 1, seuilProduit: 8, stockInitial: 30 },
        { nom: "Écouteurs Bluetooth", description: "Son haute qualité, autonomie 5h.", ean13: "1234567890003", image: "ecouteurs_bt.jpg", prixVente: 29.99, prixAchat: 15, categorieId: 1, seuilProduit: 7, stockInitial: 20 },

        { nom: "Lampe de chevet moderne", description: "Lampe avec intensité réglable.", ean13: "1234567890004", image: "lampe_chevet.jpg", prixVente: 19.99, prixAchat: 10, categorieId: 2, seuilProduit: 5, stockInitial: 25 },
        { nom: "Plaid douillet", description: "Plaid chaud et confortable.", ean13: "1234567890005", image: "plaid_maison.jpg", prixVente: 34.99, prixAchat: 20, categorieId: 2, seuilProduit: 3, stockInitial: 15 },
        { nom: "Diffuseur d'huiles essentielles", description: "Ambiance relaxante.", ean13: "1234567890006", image: "diffuseur.jpg", prixVente: 29.99, prixAchat: 18, categorieId: 2, seuilProduit: 6, stockInitial: 18 },

        { nom: "Couscoussier inox 10L", description: "Ustensile de cuisine familial.", ean13: "1234567890007", image: "couscoussier.jpg", prixVente: 45.99, prixAchat: 30, categorieId: 4, seuilProduit: 4, stockInitial: 12 },
        { nom: "Set de couteaux pro", description: "Couteaux inox avec bloc bois.", ean13: "1234567890008", image: "set_couteaux.jpg", prixVente: 59.99, prixAchat: 35, categorieId: 4, seuilProduit: 5, stockInitial: 20 },

        { nom: "Télécommande universelle", description: "Compatible avec TV & box.", ean13: "1234567890009", image: "telecommande.jpg", prixVente: 14.99, prixAchat: 7, categorieId: 5, seuilProduit: 8, stockInitial: 30 },
        { nom: "Support mural TV", description: "Support inclinable 32-55 pouces.", ean13: "1234567890010", image: "support_tv.jpg", prixVente: 39.99, prixAchat: 20, categorieId: 5, seuilProduit: 4, stockInitial: 16 },

        { nom: "Écran 27 pouces 4K", description: "Écran UHD avec HDR.", ean13: "1234567890011", image: "ecran_4k.jpg", prixVente: 299.99, prixAchat: 200, categorieId: 6, seuilProduit: 2, stockInitial: 10 },
        { nom: "Projecteur portable", description: "Mini projecteur LED HD.", ean13: "1234567890012", image: "projecteur.jpg", prixVente: 199.99, prixAchat: 120, categorieId: 6, seuilProduit: 3, stockInitial: 8 },

        { nom: "Souris gaming RGB", description: "Souris avec capteur 16K DPI.", ean13: "1234567890013", image: "souris_gaming.jpg", prixVente: 49.99, prixAchat: 25, categorieId: 7, seuilProduit: 6, stockInitial: 20 },
        { nom: "Casque audio sans fil", description: "Casque Bluetooth avec ANC.", ean13: "1234567890014", image: "casque_bt.jpg", prixVente: 129.99, prixAchat: 80, categorieId: 7, seuilProduit: 4, stockInitial: 15 },
        { nom: "Clavier mécanique RGB", description: "Switches rouges, rétroéclairage.", ean13: "1234567890015", image: "clavier_mecha.jpg", prixVente: 89.99, prixAchat: 50, categorieId: 7, seuilProduit: 5, stockInitial: 18 },

        { nom: "Caméra de sécurité WiFi", description: "Caméra HD avec vision nocturne.", ean13: "1234567890016", image: "camera_wifi.jpg", prixVente: 79.99, prixAchat: 40, categorieId: 8, seuilProduit: 5, stockInitial: 14 },
        { nom: "Enceinte Bluetooth étanche", description: "Parfaite pour les sorties.", ean13: "1234567890017", image: "enceinte_bt.jpg", prixVente: 49.99, prixAchat: 25, categorieId: 8, seuilProduit: 8, stockInitial: 20 },
        { nom: "Station météo connectée", description: "Suivi météo depuis votre smartphone.", ean13: "1234567890018", image: "station_meteo.jpg", prixVente: 99.99, prixAchat: 55, categorieId: 8, seuilProduit: 3, stockInitial: 10 },
        { nom: "Balance connectée", description: "Analyse corporelle détaillée.", ean13: "1234567890019", image: "balance_connectee.jpg", prixVente: 39.99, prixAchat: 20, categorieId: 8, seuilProduit: 6, stockInitial: 15 },
        { nom: "Mini drone caméra HD", description: "Drone avec retour vidéo en direct.", ean13: "1234567890020", image: "mini_drone.jpg", prixVente: 149.99, prixAchat: 100, categorieId: 8, seuilProduit: 3, stockInitial: 8 },
    ];

// Exemple d'affichage :

    const initProduct = async () => {

        initPro.map(async produit => {
            setLoading(true);
            try {
                console.log('Produit : ' + produit.nom);
                await apiCrudService.post('produits', produit);

                alert('tout est ok ! ')
            } catch (e) {
                setError(e)
            } finally {
                setLoading(false);
            }
        })
    }

    const handleKeydown = (e) =>{
        if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    useEffect(() => {
        fetchCategories();
    },[])

    if (loadingCat) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mt-5">
            <h3>Créer un nouveau produit</h3>
            {error && <div className="alert alert-danger">{error.message}</div>}
            {errorCat && <div className="alert alert-danger">{errorCat.message}</div>}
            <Button variant={"outline-warning"} onClick={initProduct} >Initialiser</Button>
            <Form className=" mt-3 mb-4" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Entrez le nom du produit" required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Entrez la description" required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Ean13</Form.Label>
                    <Form.Control
                        type="text"
                        name="ean13"
                        value={formData.ean13}
                        onChange={handleChange}
                        onKeyDown={handleKeydown}
                        placeholder="Ean13"
                    />
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
                    <Form.Label>Prix Achat</Form.Label>
                    <Form.Control
                        type="number"
                        name="prixAchat"
                        value={formData.prixAchat}
                        onChange={handleChange}
                        maxLength={13}
                        minLength={13}
                        placeholder="Entrez le prix Achat" required
                    />
                </Form.Group>

                <Form.Select className="mb-3"
                             name="categorieId"
                             value={formData.categorieId} required
                             onChange={handleChange}
                             placeholder="Entrez la catégorie">
                    <option>Catégorie</option>
                    <>
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>{item.nom}</option>
                    ))}</>
                </Form.Select>

                <Form.Group className="mb-3">
                    <Form.Label>Stock Initial</Form.Label>
                    <Form.Control
                        type="number"
                        name="stockInitial"
                        value={formData.stockInitial}
                        onChange={handleChange}
                        placeholder="Entrez le stock initial"
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Créer le produit'}
                </Button>
            </Form>


        </div>
    );
};

export default ProduitCreer;
