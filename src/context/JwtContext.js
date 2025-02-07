import {createContext, useContext, useEffect, useState} from "react";

const JwtContext = createContext();
export const JwtProvider = ({ children }) => {
    const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || "");
    const [loggedEmployee, setLoggedEmployee] = useState(() => {
        const storedUser = localStorage.getItem("username");
        return storedUser ? JSON.parse(storedUser) : null; // Convertir en objet ou null si absent
    });


    useEffect(() => {
        if (jwt) {
            localStorage.setItem("jwt", jwt);
        } else {
            localStorage.removeItem("jwt");
        }
    }, [jwt]);

    useEffect(() => {
        if (loggedEmployee) {
            localStorage.setItem("username", JSON.stringify(loggedEmployee)); // Stocker en JSON
        } else {
            localStorage.removeItem("username");
        }
    }, [loggedEmployee]);

    return (
        <JwtContext.Provider value={{ jwt, setJwt, loggedEmployee, setLoggedEmployee }}>
            {children}
        </JwtContext.Provider>
    );
};



export const useJwt = () => useContext(JwtContext);