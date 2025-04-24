// hooks/useProduct.js
import {useState} from "react";
import {
    getTarifAchats,
    updateTarifAchat,
} from "../services/TarifAchatService";
import {number} from "sockjs-client/lib/utils/random";
import {DEFAULT_PAGINATION_SIZE} from "../utils/constants";
import {updateRole} from "../services/RoleService";

export default function useTarifAchat() {
    const [tarifAchats, setTarifAchats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(number);
    const [totalPages, setTotalPages] = useState(number);

    
    const fetchAllTarifAchats = async ( page = 0, size = DEFAULT_PAGINATION_SIZE) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTarifAchats( page, size);
            setTarifAchats(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche dynamique des tarifAchats");
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un tarifAchat
    const update = async (id, tarifAchatData) => {
        setLoading(true);
        setError(null);
        try {
            await updateTarifAchat(id, tarifAchatData);

            await fetchAllTarifAchats();

        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du tarifAchat");
        } finally {
            setLoading(false);
        }
    };
    

    
    return {
        tarifAchats, loading, error, fetchAllTarifAchats, totalElements, update,
        totalPages
    };
}
