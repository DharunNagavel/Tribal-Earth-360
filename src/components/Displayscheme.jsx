import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";

export const Displayscheme = () => {
  const location = useLocation();
  const passedFormData = location.state?.formData || null;
  const formType = location.state?.formType || "individual"; // default to individual

  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ---------------- INDIVIDUAL FORM TRANSFORM ----------------
  const transformFormData = (formData) => {
    return {
      "Name of the Claimant": formData.nameoftheclaimant,
      "State": formData.state,
      "Scheduled Tribe": formData.scheduledTribe === "yes" ? "Yes" : "No",
      "Other Traditional Forest Dweller":
        formData.otherTraditionalForestDweller === "yes" ? "Yes" : "No",
      "Age": parseInt(formData.age, 10),
      "For Habitation": formData.forHabitation || "No",
      "For Self-Cultivation": formData.forSelfCultivation || "No",
      "DisputedLands": formData.disputedLands || "No",
      "Pattas": formData.pattas || "No",
      "Land from Where Displaced Without Compensation":
        formData.landFromWhereDisplacedWithoutCompensation || "N/A",
      "Extent of Land in Forest Villages":
        parseFloat(formData.extentOfLandInForestVillages) || 0,
    };
  };

  // ---------------- COMMUNITY FORM TRANSFORM ----------------
  const transformCommunityFormData = (formData) => {
    return {
      "State": formData.state,
      "FDST community": formData.fdstCommunity || "N/A",
      "OTFD community": formData.otfdCommunity || "N/A",
      "Community rights such as nistar": formData.communityRightsNistar || "No",
      "Rights over minor forest produce": formData.rightsOverMfp || "N/A",
      "Uses": formData.uses || "N/A",
      "Grazing": formData.grazing || "No",
      "Traditional resource access for nomadic and pastoralist":
        formData.nomadicAccess || "No",
      "Community tenures of habitat and habitation":
        formData.communityTenure || "No",
      "Right to access biodiversity": formData.biodiversityAccess || "No",
      "Other traditional rights": formData.otherRights || "No",
    };
  };

  // ---------------- COMMUNITY RESOURCES DSS TRANSFORM ----------------
  const transformCommunityResourcesFormData = (formData) => {
    return {
      "Village": formData.village || "N/A",
      "Gram Panchayat": formData.grampanchayat || "N/A",
      "Taluka": formData.taluka || "N/A",
      "District": formData.district || "N/A",
      "Compartment No": formData.compartmentno || "N/A",
      "Bordering Villages": formData.borderingvillages.join(", ") || "N/A",
      "List of Evidence in Support": formData.listofevidenceinsupport || "N/A"
    };
  };

  // ---------------- INDIVIDUAL API CALL ----------------
  const getRecommendations = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });
      const data = await response.json();
      if (data.success) {
        setRecommendedSchemes(data.recommendedSchemes);
        setUserName(data.userName);
      } else {
        setError(data.error || "Failed to get recommendations");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
      console.error("Error:", err);
    }
    setLoading(false);
  };

  // ---------------- COMMUNITY API CALL ----------------
  const getCommunityRecommendations = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/community/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });
      const data = await response.json();
      if (data.success) {
        setRecommendedSchemes(data.recommendedSchemes);
        setUserName(data.community || "Community");
      } else {
        setError(data.error || "Failed to get community recommendations");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
      console.error("Error:", err);
    }
    setLoading(false);
  };

  // ---------------- COMMUNITY RESOURCES DSS API CALL ----------------
  const getCommunityResourcesRecommendations = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/community-resources/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });
      const data = await response.json();
      if (data.success) {
        setRecommendedSchemes(data.recommendedSchemes);
        setUserName(data.communityName || "Community");
      } else {
        setError(data.error || "Failed to get community resources recommendations");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
      console.error("Error:", err);
    }
    setLoading(false);
  };

  // ---------------- RUN ON LOAD ----------------
  useEffect(() => {
    if (passedFormData) {
      if (formType === "community") {
        const transformed = transformCommunityFormData(passedFormData);
        getCommunityRecommendations(transformed);
      } else if (formType === "communityResources") {
        const transformed = transformCommunityResourcesFormData(passedFormData);
        getCommunityResourcesRecommendations(transformed);
      } else {
        const transformed = transformFormData(passedFormData);
        getRecommendations(transformed);
      }
    }
  }, [passedFormData, formType]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl mb-4">Featured Schemes</h1>
        
        {loading && <div className="text-blue-600 mb-4">Analyzing your details...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        
        {!loading && !error && recommendedSchemes.length > 0 && (
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-3">
              Recommended Schemes for {userName}
            </h2>
            <div className="border-2 border-green-400 p-4 rounded-lg">
              {recommendedSchemes.map((scheme, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <h3 className="font-semibold text-green-800">
                    {index + 1}. {scheme.name}
                  </h3>
                  <p className="text-sm text-gray-600">{scheme.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!loading && !error && recommendedSchemes.length === 0 && (
          <div className="text-gray-600">No schemes recommended based on current criteria.</div>
        )}
        
        <button
          onClick={() => {
            if (formType === "community") {
              getCommunityRecommendations(transformCommunityFormData(passedFormData));
            } else if (formType === "communityResources") {
              getCommunityResourcesRecommendations(transformCommunityResourcesFormData(passedFormData));
            } else {
              getRecommendations(transformFormData(passedFormData));
            }
          }}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
};
