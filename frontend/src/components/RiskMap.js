import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const RiskMap = ({ predictions }) => {
  const getColor = (riskLevel) => {
    if (riskLevel === "High") return "red";
    if (riskLevel === "Medium") return "orange";
    return "green";
  };

  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {predictions.map((data, index) => (
        <CircleMarker
          key={index}
          center={[data.latitude, data.longitude]}
          radius={10}
          color={getColor(data.risk_level)}
          fillColor={getColor(data.risk_level)}
          fillOpacity={0.5}
        >
          <Popup>
            <b>Crime Type:</b> {data.crime_type} <br />
            <b>Risk Level:</b> {data.risk_level} <br />
            <b>Crime Rate:</b> {data.crime_rate_percentage}%
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default RiskMap;
