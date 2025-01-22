import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import {PanierProvider} from "./context/PanierContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <PanierProvider>
            <App/>
        </PanierProvider>
    </BrowserRouter>
);
