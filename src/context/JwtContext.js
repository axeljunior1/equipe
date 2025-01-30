import {createContext, useContext, useEffect, useState} from "react";

const JwtContext = createContext();

export const JwtProvider = ({children}) => {
    const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || "");
    const [loggedEmployee, setLoggedEmployee] = useState(() => localStorage.getItem("username") || "");

    console.log("Token Provider monté ou mis à jour");

    useEffect(() => {
        // Sauvegarder le token dans localStorage chaque fois qu'il change
        if (jwt) {
            localStorage.setItem("jwt", jwt);
        } else {
            localStorage.removeItem("jwt"); // Supprimer si déconnexion
        }
    }, [jwt]);

    useEffect(() => {
        // Sauvegarder le username dans localStorage chaque fois qu'il change
        if (loggedEmployee) {
            localStorage.setItem("username", loggedEmployee);
        } else {
            localStorage.removeItem("username"); // Supprimer si déconnexion
        }
    }, [loggedEmployee]);

    return (
        <JwtContext.Provider value={{jwt, setJwt, loggedEmployee, setLoggedEmployee}}>
            {children}
        </JwtContext.Provider>
    )

}



export const useJwt = () => useContext(JwtContext);