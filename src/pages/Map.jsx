// src/components/IndiaMap.jsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import "leaflet/dist/leaflet.css";
import rawIndiaDistricts from "../assets/in.json"; // Your uploaded GeoJSON (districts)
import { FcSearch } from "react-icons/fc";

/* India bounding box */
const indiaBounds = [
  [6.4627, 68.1097], // SW
  [37.6, 97.3956],   // NE
];

// 🔑 Extract district name safely
function getName(feature) {
  if (!feature || !feature.properties) return "";
  return (
    feature.properties.NAME_2 ||  // District name (Datameet / Census)
    feature.properties.district ||
    feature.properties.DISTRICT ||
    feature.properties.name ||
    ""
  );
}

function MapActions({ selectedRegion, features }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedRegion) return;
    const feature = features.find((f) => getName(f) === selectedRegion);
    if (!feature) return;

    const layer = L.geoJSON(feature);
    const center = layer.getBounds().getCenter();
    map.setView(center, 7);
  }, [selectedRegion, features, map]);
  return null;
}

export default function IndiaMap() {
  const [weather, setWeather] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const API_KEY = "2c427abccabf23a389369450d97b65c4"; // 🔑 OpenWeather key

  const features = useMemo(
    () => (rawIndiaDistricts?.features || []),
    []
  );

  const geoJsonRef = useRef(null);

  // Styles
  const defaultStyle = { color: "#ffffff", weight: 1, fillOpacity: 0 };
  const highlightBase = { color: "#f97316", weight: 2, fillOpacity: 0 };

  const styleFunc = (feature) => {
    const name = getName(feature);
    return name === selectedRegion ? highlightBase : defaultStyle;
  };

  const onEachFeature = (feature, layer) => {
    const name = getName(feature);
    layer.bindTooltip(name, { sticky: true, direction: "auto" });

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 3, color: "#FFD700", fillOpacity: 0 });
        e.target.openTooltip();
      },
      mouseout: (e) => {
        try {
          if (geoJsonRef.current?.resetStyle) {
            geoJsonRef.current.resetStyle(e.target);
          } else {
            e.target.setStyle(defaultStyle);
          }
        } catch {
          e.target.setStyle(defaultStyle);
        }
        e.target.closeTooltip();
      },
      click: () => {
        setSelectedRegion(name);
        getWeather(name);
      },
    });
  };

  const handleSearch = (evt) => {
    evt?.preventDefault?.();
    const q = query.trim().toLowerCase();
    if (!q) return alert("Type a district name to search");

    const match = features.find((f) =>
      getName(f).toLowerCase().includes(q)
    );
    if (!match) return alert("No district found: " + query);

    setSelectedRegion(getName(match));
    getWeather(getName(match));
  };

  const getWeather = async (place) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        setWeather(null);
        alert("Weather not found for " + place);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather");
    }
  };

  // 🔄 Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedRegion) getWeather(selectedRegion);
      setRefreshKey((prev) => prev + 1);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedRegion]);

  return (
    <div className="relative w-full h-screen">
      {/* Search + Sidebar */}
      <div className="absolute z-[1000] w-full">
        <div className="flex justify-between m-5">
          {/* Sidebar button */}
          <div className="sidebar">
            <button onClick={() => setIsOpen(true)}>
              <PiDotsThreeOutlineVerticalFill className="bg-white text-5xl rounded-full p-2" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex">
            <input
              className="bg-white text-2xl rounded-4xl rounded-e-none p-4 focus:outline-none"
              placeholder="Search District"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              type="submit"
              className="bg-white rounded-4xl rounded-s-none p-2"
              title="Search"
              onClick={handleSearch}
            >
              <FcSearch size={22} />
            </button>
          </div>
        </div>

        {/* Sidebar Drawer */}
        <div
          className={`fixed top-0 left-0 h-[700px] w-130 bg-white rounded-4xl my-2 shadow-lg transform transition-transform duration-300 z-[1100] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4 p-2 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          <div className="p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">Menu</h2>
            <ul className="space-y-3">
              <li className="cursor-pointer w-[500px]">
                Weather
                <div className="flex justify-evenly align-items-center">
                  {weather ? (
                    <div className="bg-green-600 rounded-xl text-white p-2 m-2">
                      <h2 className="text-xl">{weather.name}</h2>
                      <p className="mt-1">
                        🌡 Temperature : {weather.main.temp} °C
                      </p>
                    </div>
                  ) : (
                    <h1 className="bg-green-600 text-2xl text-white rounded-xl p-3 m-2">
                      Pick a District
                    </h1>
                  )}
                  {weather ? (
                    <div className="bg-green-600 text-white rounded-xl p-2 m-2">
                      <h2 className="text-xl">{weather.name}</h2>
                      <p className="mt-1">
                        ☁ Condition : {weather.weather[0].description}
                      </p>
                      <p>💨 Wind : {weather.wind.speed} m/s</p>
                    </div>
                  ) : (
                    <h1 className="bg-green-600 text-white rounded-xl text-2xl p-2 m-2">
                      Pick a District
                    </h1>
                  )}
                </div>
              </li>
              <li className="cursor-pointer">Option 2</li>
              <li className="cursor-pointer">Option 3</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[22, 80]}
        zoom={5}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        minZoom={4}
        attributionControl={false}
      >
        {/* Satellite base */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
        />

        {/* Labels */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution="Labels © Esri"
        />

        {/* Districts only */}
        <GeoJSON
          data={rawIndiaDistricts}
          style={styleFunc}
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
        />

        {/* Fit to district center on selection */}
        <MapActions selectedRegion={selectedRegion} features={features} />
      </MapContainer>
    </div>
  );
}
