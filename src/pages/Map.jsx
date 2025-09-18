// src/components/IndiaMap.jsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FcSearch } from "react-icons/fc";
import "leaflet/dist/leaflet.css";

import rawIndiaStates from "../assets/in.json";       // India states GeoJSON
import rawIndiaDistricts from "../assets/in_districts.json"; // India districts GeoJSON

/* India bounding box */
const indiaBounds = [
  [6.4627, 68.1097], // SW
  [37.6, 97.3956],   // NE
];

/* 🔑 Extract state/district name safely */
function getName(feature) {
  if (!feature || !feature.properties) return "";
  return (
    feature.properties.NAME_2 || // district
    feature.properties.district ||
    feature.properties.DISTRICT ||
    feature.properties.NAME_1 || // state
    feature.properties.st_nm ||
    feature.properties.STATE_NAME ||
    feature.properties.name ||
    ""
  );
}

/* Handles zoom when region is selected */
function MapActions({ selectedRegion, features }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedRegion) return;

    const feature = features.find((f) => getName(f) === selectedRegion);
    if (!feature) return;

    const layer = L.geoJSON(feature);
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
  }, [selectedRegion, features, map]);

  return null;
}

export default function IndiaMap() {
  const [weather, setWeather] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const geoJsonRef = useRef(null);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeState, setActiveState] = useState(null);
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const API_KEY = "2c427abccabf23a389369450d97b65c4"; // 🔑 OpenWeather key

  const stateFeatures = useMemo(
    () => rawIndiaStates?.features || [],
    []
  );
  const districtFeatures = useMemo(
    () => rawIndiaDistricts?.features || [],
    []
  );

  // Weather fetch
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

  // Styles
  const defaultStyle = { color: "#ffffff", weight: 1.5, fillOpacity: 0 };
  const highlightStyle = { color: "#f97316", weight: 3, fillOpacity: 0 };

  const styleFunc = (feature) => {
    const name = getName(feature);
    return name === selectedRegion ? highlightStyle : defaultStyle;
  };

  // State-level interaction
  const onEachState = (feature, layer) => {
    const name = getName(feature);
    layer.bindTooltip(name, { sticky: true, direction: "auto" });
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 3, color: "#FFD700", fillOpacity: 0 });
        e.target.openTooltip();
      },
      mouseout: (e) => {
        if (geoJsonRef.current?.resetStyle) {
          geoJsonRef.current.resetStyle(e.target);
        } else {
          e.target.setStyle(defaultStyle);
        }
        e.target.closeTooltip();
      },
      click: () => {
        setSelectedRegion(name);
        setActiveState(name);
        getWeather(name);
      },
    });
  };

  // District-level interaction
  const onEachDistrict = (feature, layer) => {
    const name = getName(feature);
    layer.bindTooltip(name, { sticky: true, direction: "auto" });
    layer.on({
      click: () => {
        setSelectedRegion(name);
        getWeather(name);
      },
    });
  };

  // Filter districts by active state
  const filteredDistricts = useMemo(() => {
    if (!activeState) return [];
    return districtFeatures.filter((f) => {
      const stateProp =
        f.properties.STATE_NAME || f.properties.st_nm || f.properties.NAME_1;
      return stateProp?.toLowerCase() === activeState.toLowerCase();
    });
  }, [activeState, districtFeatures]);

  // Search handler
  const handleSearch = (evt) => {
    evt?.preventDefault?.();
    const q = query.trim().toLowerCase();
    if (!q) return alert("Type a state or district name to search");

    const match =
      stateFeatures.find((f) => getName(f).toLowerCase().includes(q)) ||
      districtFeatures.find((f) => getName(f).toLowerCase().includes(q));

    if (!match) return alert("No match found: " + query);

    const name = getName(match);
    setSelectedRegion(name);

    // If it’s a state, activate its districts
    const isState = stateFeatures.some((f) => getName(f) === name);
    setActiveState(isState ? name : null);

    getWeather(name);
  };

  // Auto-refresh weather every 5 min
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
              placeholder="Search State or District"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
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
                    <>
                      <div className="bg-green-600 rounded-xl text-white p-2 m-2">
                        <h2 className="text-xl">{weather.name}</h2>
                        <p>🌡 Temp: {weather.main.temp} °C</p>
                      </div>
                      <div className="bg-green-600 text-white rounded-xl p-2 m-2">
                        <p>☁ {weather.weather[0].description}</p>
                        <p>💨 Wind: {weather.wind.speed} m/s</p>
                      </div>
                    </>
                  ) : (
                    <h1 className="bg-green-600 text-2xl text-white rounded-xl p-3 m-2">
                      Pick a State
                    </h1>
                  )}
                </div>
              </li>
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

        {/* States */}
        <GeoJSON
          data={rawIndiaStates}
          style={styleFunc}
          onEachFeature={onEachState}
          ref={geoJsonRef}
        />

        {/* Districts of selected state */}
        {activeState && (
          <GeoJSON
            data={filteredDistricts}
            style={{ color: "#ffffff", weight: 2, fillOpacity: 0 }}
            onEachFeature={onEachDistrict}
          />
        )}

        {/* Weather overlay */}
        <TileLayer
          key={refreshKey}
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          attribution="Weather data © OpenWeatherMap"
          opacity={0.5}
        />

        {/* Fit to region center */}
        <MapActions
          selectedRegion={selectedRegion}
          features={[...stateFeatures, ...districtFeatures]}
        />
      </MapContainer>
    </div>
  );
}
