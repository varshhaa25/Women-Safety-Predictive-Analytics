import "leaflet/dist/leaflet.css";

/*import ReactDOM from "react-dom";


ReactDOM.render(<App />, document.getElementById("root"));*/

import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);