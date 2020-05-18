import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import Store from "./store";
import * as serviceWorker from "./serviceWorker";
import "./assets/css/index.css";

// window.$server_url = 'https://klikz.us:8443'; // For Production
window.$server_url = "http://localhost:8080"; // For Development

ReactDOM.render(
    <React.StrictMode>
        <Provider store={Store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

serviceWorker.unregister();
