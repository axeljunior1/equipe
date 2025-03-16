import {createContext, useContext, useEffect, useState} from "react";

const JwtContext = createContext();
export const JwtProvider = ({ children }) => {
    const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || "");
    const [loggedEmployee, setLoggedEmployee] = useState(() => {
        const storedUser = localStorage.getItem("loggedEmployee");
        return storedUser ? JSON.parse(storedUser) : null; // Convertir en objet ou null si absent
    });
    const [panierId, setPanierId] = useState(() => localStorage.getItem("panierId")  || 0);
    const [resetApp, setResetApp] = useState("initial");

    useEffect(() => {
        console.log('initial state: panier id ', panierId);
    }, []);


    useEffect(() => {
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
        console.log('changed panierId ', panierId);
    }, [panierId]);

    return (
        <JwtContext.Provider value={{ jwt, setJwt, setResetApp, loggedEmployee, setLoggedEmployee, panierId, setPanierId }}>
            {children}
        </JwtContext.Provider>
    );
};



export const useJwt = () => useContext(JwtContext);