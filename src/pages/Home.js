import React, {useEffect} from 'react';
import {useTheme} from "../context/ThemeContext";
import {Button} from "react-bootstrap";

const Home = () => {
    const {theme, toggleTheme} = useTheme();

    useEffect(() => {
    }, []);

    return (
        <div>
            <h1> Welcome to the Home Page</h1>
            <Button variant={theme}  onClick={()=> {
                toggleTheme(theme)
                console.log(theme === 'primary' ? 'danger' : 'primary');
            }}>
                Toggle Theme
            </Button>
        </div>
    );
};

export default Home;