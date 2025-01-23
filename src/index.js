import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import {PanierProvider} from "./context/PanierContext";
import {ThemeProvider} from "./context/ThemeContext";
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <PanierProvider>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </PanierProvider>
);
