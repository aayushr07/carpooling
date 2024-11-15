import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

export default function MapComponent({ startPoint, setStartPoint, endPoint, setEndPoint }) {
  const [mapCenter] = useState([20.5937, 78.9629]); // Center on India

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!startPoint) {
          setStartPoint([e.latlng.lat, e.latlng.lng]);
        } else {
          setEndPoint([e.latlng.lat, e.latlng.lng]);
        }
      },
    });
    return null;
  };

  return (
    <MapContainer center={mapCenter} zoom={5} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {startPoint && <Marker position={startPoint} />}
      {endPoint && <Marker position={endPoint} />}
      <MapClickHandler />
    </MapContainer>
  );
}
