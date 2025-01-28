import React, {useEffect} from 'react';
import {useTheme} from "../context/ThemeContext";
import {Button} from "react-bootstrap";
import MainForm from "./test/MainForm";
import {useJwt} from "../context/JwtContext";

const Home = () => {
    const {theme, toggleTheme} = useTheme();
    const {jwt} = useJwt();

    useEffect(() => {
        console.log('jwt : ', jwt)
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

            <MainForm/>
        </div>
    );
};

export default Home;