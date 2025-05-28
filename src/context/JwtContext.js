import {createContext, useContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";

const JwtContext = createContext();
export const JwtProvider = ({children}) => {
    const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || "");
    const [loggedEmployee, setLoggedEmployee] = useState(() => {
        const storedUser = localStorage.getItem("loggedEmployee");
        return storedUser ? JSON.parse(storedUser) : null; // Convertir en objet ou null si absent
    });
    const [panierId, setPanierId] = useState(() => localStorage.getItem("panierId") || undefined);
    const [tenantId, setTenantId] = useState(() => localStorage.getItem("tenantId") || undefined);
    const [employeName, setEmployeName] = useState(() => localStorage.getItem("employeName") || undefined);
    const [employeId, setEmployeId] = useState(() => localStorage.getItem("employeId") || undefined);
    const [employePrenom, setEmployePrenom] = useState(() => localStorage.getItem("employePrenom") || undefined);

    const restore = async () => {
        setJwt("");
        setLoggedEmployee(null);
        setPanierId(null);
        setTenantId(null);
        setEmployeName(null);
        setEmployeId(null);
        setEmployePrenom(null);
    }

    useEffect(() => {
        console.log(jwt, "jwt has changed")
        if (jwt) {
            localStorage.setItem("jwt", jwt);
        } else {
            localStorage.removeItem("jwt");
        }
    }, [jwt]);

    useEffect(() => {
        if (loggedEmployee) {
            localStorage.setItem("loggedEmployee", JSON.stringify(loggedEmployee)); // Stocker en JSON
        } else {
            localStorage.removeItem("loggedEmployee");
        }
    }, [loggedEmployee]);

    useEffect(() => {
        if (panierId) {
            localStorage.setItem("panierId", panierId);
        } else {
            localStorage.removeItem("panierId");
        }
    }, [panierId]);

    useEffect(() => {
        if (tenantId) {
            localStorage.setItem("tenantId", tenantId)
        } else {
            localStorage.removeItem("tenantId")
        }
        //employeName

        if (employeName) {
            localStorage.setItem("employeName", employeName)
        } else {
            localStorage.removeItem("employeName")
        }

        //employeId
        if (employeId) {
            localStorage.setItem("employeId", employeId)
        } else {
            localStorage.removeItem("employeId")
        }

        //employePrenom
        if (employePrenom) {
            localStorage.setItem("employePrenom", employePrenom)
        } else {
            localStorage.removeItem("employePrenom")
        }


    }, [tenantId, employeName, employeId, employePrenom])


    return (
        <JwtContext.Provider value={{
            jwt,
            setJwt,
            loggedEmployee,
            setLoggedEmployee,
            panierId,
            setPanierId,
            tenantId,
            restore,
            employeName,
            employeId,
            employePrenom,
            setTenantId,
            setEmployeName,
            setEmployeId,
            setEmployePrenom
        }}>
            {children}
        </JwtContext.Provider>
    );
};

JwtProvider.propTypes = {
    children: PropTypes.node,
};

export const useJwt = () => useContext(JwtContext);