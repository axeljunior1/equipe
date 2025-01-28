import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import {PanierProvider} from "./context/PanierContext";
import {ThemeProvider} from "./context/ThemeContext";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {JwtProvider} from "./context/JwtContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <JwtProvider>
        <PanierProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ThemeProvider>
        </PanierProvider>
    </JwtProvider>
);
