import {createContext, useContext, useEffect, useState} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [theme, setTheme] = useState(()=>{
        const savedPanier = localStorage.getItem("theme");
        return savedPanier ? JSON.parse(savedPanier) : 'danger';
    });
    useEffect(() => {
        //     // Sauvegarder le panier dans localStorage à chaque modification
            localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    console.log("ThemeProvider monté ou mis à jour");


    const toggleTheme = (preTheme) => {
        setTheme(preTheme === 'danger' ? 'primary' : 'danger');
    }
    return (
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}



export const useTheme = () => useContext(ThemeContext);