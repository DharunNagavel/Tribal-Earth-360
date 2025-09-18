// src/components/IndiaMap.jsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FcSearch } from "react-icons/fc";
import "leaflet/dist/leaflet.css";

import rawIndiaStates from "../assets/in.json";
import rawIndiaDistricts from "../assets/in_districts.json";

/* Complete FRA dataset as structured array */
const fraStateArray = [
  {
    "state": "Andhra Pradesh",
    "claims_received": { "individual": 285098, "community": 3294, "total": 288392 },
    "titles_distributed": { "individual": 226651, "community": 1822, "total": 228473 },
    "claims_rejected": 58410,
    "claims_disposed": 286883,
    "percent_disposed": 99.48,
    "claims_pending": 1509
  },
  {
    "state": "Assam",
    "claims_received": { "individual": 148965, "community": 6046, "total": 155011 },
    "titles_distributed": { "individual": 57325, "community": 1477, "total": 58802 },
    "claims_rejected": null,
    "claims_disposed": 58802,
    "percent_disposed": 37.93,
    "claims_pending": 96209
  },
  {
    "state": "Bihar",
    "claims_received": {"individual": 4696, "community": 0, "total": 4696},
    "titles_distributed": {"individual": 191, "community": 0, "total": 191},
    "claims_rejected": 4496,
    "claims_disposed": 4687,
    "percent_disposed": 99.81,
    "claims_pending": 9
  },
  {
    "state": "Chhattisgarh",
    "claims_received": {"individual": 890220, "community": 57259, "total": 947479},
    "titles_distributed": {"individual": 481432, "community": 52636, "total": 534068},
    "claims_rejected": 406787,
    "claims_disposed": 940855,
    "percent_disposed": 99.30,
    "claims_pending": 6624
  },
  {
    "state": "Goa",
    "claims_received": {"individual": 9757, "community": 379, "total": 10136},
    "titles_distributed": {"individual": 856, "community": 15, "total": 871},
    "claims_rejected": 447,
    "claims_disposed": 1318,
    "percent_disposed": 13.00,
    "claims_pending": 8818
  },
  {
    "state": "Gujarat",
    "claims_received": {"individual": 183055, "community": 7187, "total": 190242},
    "titles_distributed": {"individual": 98732, "community": 4792, "total": 103524},
    "claims_rejected": 2331,
    "claims_disposed": 105855,
    "percent_disposed": 55.64,
    "claims_pending": 84387
  },
  {
    "state": "Himachal Pradesh",
    "claims_received": {"individual": 4883, "community": 683, "total": 5566},
    "titles_distributed": {"individual": 662, "community": 146, "total": 808},
    "claims_rejected": 54,
    "claims_disposed": 862,
    "percent_disposed": 15.49,
    "claims_pending": 4704
  },
  {
    "state": "Jharkhand",
    "claims_received": {"individual": 107032, "community": 3724, "total": 110756},
    "titles_distributed": {"individual": 59866, "community": 2104, "total": 61970},
    "claims_rejected": 28107,
    "claims_disposed": 90077,
    "percent_disposed": 81.33,
    "claims_pending": 20679
  },
  {
    "state": "Karnataka",
    "claims_received": {"individual": 288549, "community": 5940, "total": 294489},
    "titles_distributed": {"individual": 14981, "community": 1345, "total": 16326},
    "claims_rejected": 253269,
    "claims_disposed": 269595,
    "percent_disposed": 91.55,
    "claims_pending": 24894
  },
  {
    "state": "Kerala",
    "claims_received": {"individual": 44455, "community": 1014, "total": 45469},
    "titles_distributed": {"individual": 29422, "community": 282, "total": 29704},
    "claims_rejected": 12835,
    "claims_disposed": 42539,
    "percent_disposed": 93.56,
    "claims_pending": 2930
  },
  {
    "state": "Madhya Pradesh",
    "claims_received": {"individual": 585326, "community": 42187, "total": 627513},
    "titles_distributed": {"individual": 266901, "community": 27976, "total": 294877},
    "claims_rejected": 322407,
    "claims_disposed": 617284,
    "percent_disposed": 98.37,
    "claims_pending": 10229
  },
  {
    "state": "Maharashtra",
    "claims_received": {"individual": 397897, "community": 11259, "total": 409156},
    "titles_distributed": {"individual": 199667, "community": 8668, "total": 208335},
    "claims_rejected": 172631,
    "claims_disposed": 380966,
    "percent_disposed": 93.11,
    "claims_pending": 28190
  },
  {
    "state": "Odisha",
    "claims_received": {"individual": 701148, "community": 35024, "total": 736172},
    "titles_distributed": {"individual": 462067, "community": 8832, "total": 470899},
    "claims_rejected": 144636,
    "claims_disposed": 615535,
    "percent_disposed": 83.61,
    "claims_pending": 120637
  },
  {
    "state": "Rajasthan",
    "claims_received": {"individual": 113162, "community": 5213, "total": 118375},
    "titles_distributed": {"individual": 49215, "community": 2551, "total": 51766},
    "claims_rejected": 65921,
    "claims_disposed": 117687,
    "percent_disposed": 99.42,
    "claims_pending": 688
  },
  {
    "state": "Tamil Nadu",
    "claims_received": {"individual": 33119, "community": 1548, "total": 34667},
    "titles_distributed": {"individual": 15442, "community": 1066, "total": 16508},
    "claims_rejected": 12711,
    "claims_disposed": 29219,
    "percent_disposed": 84.28,
    "claims_pending": 5448
  },
  {
    "state": "Telangana",
    "claims_received": {"individual": 651822, "community": 3427, "total": 655249},
    "titles_distributed": {"individual": 230735, "community": 721, "total": 231456},
    "claims_rejected": 94426,
    "claims_disposed": 325882,
    "percent_disposed": 49.73,
    "claims_pending": 329367
  },
  {
    "state": "Tripura",
    "claims_received": {"individual": 200557, "community": 164, "total": 200721},
    "titles_distributed": {"individual": 127931, "community": 101, "total": 128032},
    "claims_rejected": 68848,
    "claims_disposed": 196880,
    "percent_disposed": 98.09,
    "claims_pending": 3841
  },
  {
    "state": "Uttar Pradesh",
    "claims_received": {"individual": 92972, "community": 1194, "total": 94166},
    "titles_distributed": {"individual": 22537, "community": 893, "total": 23430},
    "claims_rejected": 70736,
    "claims_disposed": 94166,
    "percent_disposed": 100.00,
    "claims_pending": 0
  },
  {
    "state": "Uttarakhand",
    "claims_received": {"individual": 3587, "community": 3091, "total": 6678},
    "titles_distributed": {"individual": 184, "community": 1, "total": 185},
    "claims_rejected": 6493,
    "claims_disposed": 6678,
    "percent_disposed": 100.00,
    "claims_pending": 0
  },
  {
    "state": "West Bengal",
    "claims_received": {"individual": 131962, "community": 10119, "total": 142081},
    "titles_distributed": {"individual": 44444, "community": 686, "total": 45130},
    "claims_rejected": 96587,
    "claims_disposed": 141717,
    "percent_disposed": 99.74,
    "claims_pending": 364
  },
  {
    "state": "Jammu & Kashmir",
    "claims_received": { "individual": 33233, "community": 12857, "total": 46090 },
    "titles_distributed": { "individual": 429, "community": 5591, "total": 6020 },
    "claims_rejected": 39924,
    "claims_disposed": 45944,
    "percent_disposed": 99.68,
    "claims_pending": 146
  }
];

/* India bounding box */
const indiaBounds = [
  [6.4627, 68.1097], // SW
  [37.6, 97.3956],   // NE
];

/* Extract state/district name safely */
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

/* Handles zoom on selection */
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
  const [isOpen, setIsOpen] = useState(true);
  const geoJsonRef = useRef(null);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeState, setActiveState] = useState(null);
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [fraStats, setFraStats] = useState(null);

  const API_KEY = "2c427abccabf23a389369450d97b65c4";

  const stateFeatures = useMemo(() => rawIndiaStates?.features || [], []);
  const districtFeatures = useMemo(() => rawIndiaDistricts?.features || [], []);

  // Map states for quick lookup
  const fraStateData = useMemo(() => {
    const mapping = {};
    fraStateArray.forEach(item => {
      mapping[item.state.toLowerCase()] = item;
    });
    return mapping;
  }, []);

  // Fetch weather from OpenWeatherMap API
  const getWeather = async (place) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${place},india&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        setWeather(null);
      }
    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setWeather(null);
    }
  };

  // Get FRA data for a selected state
  const getFraData = (stateName) => {
    const data = fraStateData[stateName.toLowerCase()];
    setFraStats(data || null);
    return data;
  };

  // Style for states using percent_disposed to color code
  const defaultStyle = (feature) => {
    const name = getName(feature);
    const stateData = fraStateData[name.toLowerCase()];
    let fillColor = "#e5e7eb"; // Default gray for no data

    if (stateData) {
      if (stateData.percent_disposed > 70) fillColor = "#4CAF50"; // Green
      else if (stateData.percent_disposed > 40) fillColor = "#FFC107"; // Yellow
      else if (stateData.percent_disposed > 0) fillColor = "#F44336"; // Red
    }

    return {
      color: "#ffffff",
      weight: 1.5,
      fillColor,
      fillOpacity: 0.7,
    };
  };

  const highlightStyle = {
    color: "#f97316",
    weight: 3,
    fillOpacity: 0.9
  };

  const styleFunc = (feature) => {
    const name = getName(feature);
    const baseStyle = defaultStyle(feature);
    return name === selectedRegion ? { ...baseStyle, ...highlightStyle } : baseStyle;
  };

  // State-level interaction
  const onEachState = (feature, layer) => {
    const name = getName(feature);
    const stateData = fraStateData[name.toLowerCase()];

    const tooltipContent = stateData ?
      `<div style="min-width: 200px;">
         <strong>${name}</strong><br/>
         Total Claims: ${stateData.claims_received.total.toLocaleString()}<br/>
         Titles Distributed: ${stateData.titles_distributed.total.toLocaleString()}<br/>
         Claims Pending: ${stateData.claims_pending.toLocaleString()}<br/>
         % Disposed: ${stateData.percent_disposed}%
       </div>` :
      `<div>${name}</div>`;

    layer.bindTooltip(tooltipContent, { sticky: true, direction: "auto" });
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 3,
          color: "#FFD700",
          fillOpacity: 0.9
        });
        e.target.openTooltip();
      },
      mouseout: (e) => {
        if (geoJsonRef.current?.resetStyle) {
          geoJsonRef.current.resetStyle(e.target);
        } else {
          e.target.setStyle(defaultStyle(feature));
        }
        e.target.closeTooltip();
      },
      click: () => {
        setSelectedRegion(name);
        setActiveState(name);
        getWeather(name);
        getFraData(name);
      }
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
        // No FRA data for districts
        setFraStats(null);
      }
    });
  };

  // Filter districts by active state
  const filteredDistricts = useMemo(() => {
    if (!activeState) return [];
    return districtFeatures.filter((f) => {
      const stateProp = f.properties.STATE_NAME || f.properties.st_nm || f.properties.NAME_1;
      return stateProp?.toLowerCase() === activeState.toLowerCase();
    });
  }, [activeState, districtFeatures]);

  // Search handler for states/districts
  const handleSearch = (evt) => {
    evt?.preventDefault?.();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const match =
      stateFeatures.find((f) => getName(f).toLowerCase().includes(q)) ||
      districtFeatures.find((f) => getName(f).toLowerCase().includes(q));

    if (!match) {
      alert("No match found for: " + query);
      return;
    }

    const name = getName(match);
    setSelectedRegion(name);

    const isState = stateFeatures.some((f) => getName(f) === name);
    if (isState) {
      setActiveState(name);
      getFraData(name);
    } else {
      setActiveState(null);
      setFraStats(null);
    }

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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-2 z-[1200] bg-[#78C6A3] text-white p-3 rounded-full shadow-md hover:bg-green-700"
        >
          <PiDotsThreeOutlineVerticalFill size={28} />
        </button>
      )}

      {/* Search Bar */}
      <div className="absolute top-6 right-6 z-[1200] flex items-center bg-white rounded-full shadow-md overflow-hidden">
        <input
          type="text"
          placeholder="Search State or District"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="px-4 py-2 w-64 outline-none"
        />
        <button
          onClick={handleSearch}
          className="p-2 flex items-center justify-center hover:bg-green-700"
        >
          <FcSearch size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[350px] bg-white shadow-lg transform transition-transform duration-300 z-[1100] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-[#78C6A3] text-white p-4">
          <h2 className="text-xl font-bold">FRA Dashboard</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-green-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">
          <ul className="space-y-4">
            <li>
              <h3 className="text-lg font-semibold text-black">Weather</h3>
              <div className="flex flex-col space-y-2 mt-2">
                {weather ? (
                  <>
                    <div className="bg-[#78C6A3] rounded-xl text-white p-3">
                      <h2 className="text-xl">{weather.name}</h2>
                      <p>🌡 Temp: {weather.main.temp} °C</p>
                    </div>
                    <div className="bg-[#78C6A3] text-white rounded-xl p-3">
                      <p>☁ {weather.weather[0].description}</p>
                      <p>💨 Wind: {weather.wind.speed} m/s</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#78C6A3] text-xl text-white rounded-xl p-3">
                    <p>Pick a State to see weather</p>
                  </div>
                )}
              </div>
            </li>

            <li>
              <h3 className="text-lg font-semibold text-black mt-4">FRA Claims - {selectedRegion || "India"}</h3>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {fraStats ? (
                  <>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Claims Received (Individual)</h4>
                      <p className="text-2xl">{fraStats.claims_received.individual.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Claims Received (Community)</h4>
                      <p className="text-2xl">{fraStats.claims_received.community.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Claims Received (Total)</h4>
                      <p className="text-2xl">{fraStats.claims_received.total.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Titles Distributed (Individual)</h4>
                      <p className="text-2xl">{fraStats.titles_distributed.individual.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Titles Distributed (Community)</h4>
                      <p className="text-2xl">{fraStats.titles_distributed.community.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Titles Distributed (Total)</h4>
                      <p className="text-2xl">{fraStats.titles_distributed.total.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Claims Rejected</h4>
                      <p className="text-2xl">{fraStats.claims_rejected !== null ? fraStats.claims_rejected.toLocaleString() : "NA"}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Claims Disposed</h4>
                      <p className="text-2xl">{fraStats.claims_disposed.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                      <h4 className="font-bold">Claims Pending</h4>
                      <p className="text-2xl">{fraStats.claims_pending.toLocaleString()}</p>
                    </div>
                    <div className="text-black rounded-xl p-3 shadow bg-[#78C6A3] col-span-2">
                      <h4 className="font-bold">% Claims Disposed</h4>
                      <p className="text-2xl">{fraStats.percent_disposed}%</p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-black rounded-xl p-3 shadow bg-[#78C6A3]">
                    <h4 className="font-bold">Select a state to view FRA data</h4>
                    <p className="text-sm">FRA data is available at state level</p>
                  </div>
                )}
              </div>
            </li>

            <li>
              <h3 className="text-lg font-semibold text-black mt-4">Legend</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#4CAF50] mr-2 rounded-sm"></div>
                  <span>High Approval Rate (&gt;70%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#FFC107] mr-2 rounded-sm"></div>
                  <span>Medium Approval Rate (40-70%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#F44336] mr-2 rounded-sm"></div>
                  <span>Low Approval Rate (&lt;40%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#e5e7eb] mr-2 rounded-sm"></div>
                  <span>No Data Available</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* The Map */}
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

        {/* States GeoJSON */}
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

        {/* Adjust map to selected region */}
        <MapActions
          selectedRegion={selectedRegion}
          features={[...stateFeatures, ...districtFeatures]}
        />
      </MapContainer>
    </div>
  );
}
