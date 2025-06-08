import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

const SafeRoutes = () => {
  const [start, setStart] = useState({ lat: "", lon: "" });
  const [end, setEnd] = useState({ lat: "", lon: "" });
  const [safeRoutes, setSafeRoutes] = useState([]);

  const handleChange = (e) => {
    setStart({ ...start, [e.target.name]: e.target.value });
  };

  const handleEndChange = (e) => {
    setEnd({ ...end, [e.target.name]: e.target.value });
  };

  const findSafeRoutes = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/safe-routes/", {
        start_lat: parseFloat(start.lat),
        start_lon: parseFloat(start.lon),
        end_lat: parseFloat(end.lat),
        end_lon: parseFloat(end.lon),
      });

      setSafeRoutes(response.data.safe_routes);
    } catch (error) {
      console.error("Error fetching safe routes:", error);
    }
  };

  return (
    <div>
      <h1>Safe Route Suggestions</h1>

      {/* User Input Form */}
      <form onSubmit={findSafeRoutes}>
        <input type="text" name="lat" placeholder="Start Latitude" onChange={handleChange} required />
        <input type="text" name="lon" placeholder="Start Longitude" onChange={handleChange} required />
        <input type="text" name="lat" placeholder="End Latitude" onChange={handleEndChange} required />
        <input type="text" name="lon" placeholder="End Longitude" onChange={handleEndChange} required />
        <button type="submit">Find Safe Route</button>
      </form>

      {/* Map Display */}
      <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Start & End Markers */}
        {start.lat && start.lon && (
          <Marker position={[parseFloat(start.lat), parseFloat(start.lon)]}>
            <Popup>Start Location</Popup>
          </Marker>
        )}
        {end.lat && end.lon && (
          <Marker position={[parseFloat(end.lat), parseFloat(end.lon)]}>
            <Popup>End Location</Popup>
          </Marker>
        )}

        {/* Safe Route Markers & Lines */}
        {safeRoutes.length > 0 && (
          <>
            {safeRoutes.map((route, index) => (
              <Marker key={index} position={route}>
                <Popup>Safe Point</Popup>
              </Marker>
            ))}

            {/* Draw route using Polyline */}
            <Polyline positions={safeRoutes} color="green" />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default SafeRoutes;


