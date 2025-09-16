import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  return (
    <MapContainer center={[20, 80]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer 
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
        attribution="Tiles © Esri &mdash; Source: Esri, Maxar, Earthstar Geographics" 
      />
    </MapContainer>
  );
}
