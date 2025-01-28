import {createContext, useContext, useEffect, useState} from "react";

const JwtContext = createContext();

export const JwtProvider = ({children}) => {
    const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || "");

    console.log("Token Provider monté ou mis à jour");

    useEffect(() => {
        // Sauvegarder le token dans localStorage chaque fois qu'il change
        if (jwt) {
            localStorage.setItem("jwt", jwt);
        } else {
            localStorage.removeItem("jwt"); // Supprimer si déconnexion
        }
    }, [jwt]);

    return (
        <JwtContext.Provider value={{jwt, setJwt}}>
            {children}
        </JwtContext.Provider>
    )

}



export const useJwt = () => useContext(JwtContext);