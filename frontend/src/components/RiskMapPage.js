import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";

const getRiskColor = (riskLevel) => {
  if (riskLevel === "High") return "red";
  if (riskLevel === "Medium") return "orange";
  return "green"; // Low risk
};

  /*return new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};*/

const RiskMapPage = () => {
  const [crimeData, setCrimeData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/all-crime-data/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Crime Data:", data);
        if (data.length > 0) {
          console.log("First Crime Entry:", data[0]); // Debugging first entry
        }
        setCrimeData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2><center>Risk Map Visualization</center></h2>
      <MapContainer center={[43.6569, -79.4052]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {crimeData.length > 0 ? (
          crimeData.map((crime, index) => {
            if (crime.latitude && crime.longitude) {
              console.log(`Adding marker at: ${crime.latitude}, ${crime.longitude}, Risk: ${crime.risk_level}`);
              return (
                <CircleMarker 
                 key={index}
                 center={[crime.latitude, crime.longitude]}
                 radius={10} // Adjust size of marker
                 color={getRiskColor(crime.risk_level)}
                 fillColor={getRiskColor(crime.risk_level)}
                 fillOpacity={0.5} // Adjust transparency
                >
                  <Popup>
                    <strong>Location:</strong> {crime.Neighbourhood} <br />
                    <strong>Risk Level:</strong> {crime.risk_level} <br />
                    <strong>Crime Rate:</strong> {crime.crime_rate_percentage}%
                  </Popup>
                </CircleMarker>
              );
            } 
            else {
              console.log("Skipping marker due to missing coordinates:", crime);
              return null;
            }
          })
        ) : (
          <p>No crime data available</p>
        )}
      </MapContainer>
    </div>
  );
};

export default RiskMapPage;
