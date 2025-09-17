import React, { useState } from "react";

const CommunityResource = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    village: "",
    gramPanchayat: "",
    tehsil: "",
    district: "",
    members: "",
    khasra: "",
    borderingVillages: ["", "", ""],
    evidence: "",
    declaration: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBorderingChange = (index, value) => {
    const updated = [...formData.borderingVillages];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, borderingVillages: updated }));
  };

  // Validate current section before navigation or submit
  const validateSection = (section) => {
    const newErrors = {};
    if (section === 3 && !formData.declaration) {
      newErrors.declaration = "You must accept the declaration";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSection = (section) => {
    if (section > currentSection && !validateSection(currentSection)) {
      alert("Please complete all required fields before proceeding.");
      return;
    }
    setCurrentSection(section);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateSection(currentSection)) return;

    alert("Community Forest Rights Form submitted successfully!");
    setErrors({});
    setFormData({
      village: "",
      gramPanchayat: "",
      tehsil: "",
      district: "",
      members: "",
      khasra: "",
      borderingVillages: ["", "", ""],
      evidence: "",
      declaration: false,
    });
    setCurrentSection(1);
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-5">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-3xl m-40">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
          Community Resource Rights (CFR) Form
        </h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
            <div className="hidden md:block absolute top-4 left-0 w-full h-0.5 bg-gray-300 -z-10" />
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center mb-6 md:mb-0 ${step !== 1 ? "md:ml-4" : ""}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    currentSection >= step ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  {currentSection > step ? "✓" : step}
                </div>
                <div className="ml-3">
                  <div
                    className={`text-sm ${
                      currentSection === step ? "text-green-800 font-medium" : "text-gray-600"
                    }`}
                  >
                    {step === 1 && "Basic Info"}
                    {step === 2 && "Bordering Villages"}
                    {step === 3 && "Evidence & Declaration"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Info */}
          {currentSection === 1 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6 space-y-4">
              <div>
                <label className="block font-medium mb-1">1. Village / Gram Sabha:</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">2. Gram Panchayat:</label>
                <input
                  type="text"
                  name="gramPanchayat"
                  value={formData.gramPanchayat}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">3. Tehsil / Taluka:</label>
                <input
                  type="text"
                  name="tehsil"
                  value={formData.tehsil}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">4. District:</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  5. Name(s) of members of the Gram Sabha:
                </label>
                <textarea
                  name="members"
                  placeholder="Attach list with ST/OTFD status"
                  value={formData.members}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  (Attach as separate sheet, with Scheduled Tribe / OTFD status next to each member)
                </p>
              </div>

              <div>
                <label className="block font-medium mb-1">6. Khasra / Compartment No(s):</label>
                <input
                  type="text"
                  name="khasra"
                  value={formData.khasra}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showSection(2)}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg"
                >
                  Next: Bordering Villages
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Bordering Villages */}
          {currentSection === 2 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6 space-y-4">
              <div>
                <label className="block font-medium mb-2">7. Bordering Villages:</label>
                {formData.borderingVillages.map((village, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`(${index + 1})`}
                    value={village}
                    onChange={(e) => handleBorderingChange(index, e.target.value)}
                    className="w-full p-2 mb-2 border border-green-300 rounded-lg"
                  />
                ))}
                <p className="text-xs text-gray-500">
                  (Include info regarding sharing of resources/responsibilities with any other villages)
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => showSection(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg"
                >
                  Previous: Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => showSection(3)}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg"
                >
                  Next: Evidence & Declaration
                </button>
              </div>
            </div>
          )}

          {/* Section 3: Evidence & Declaration */}
          {currentSection === 3 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6 space-y-4">
              <div>
                <label className="block font-medium mb-1">8. List of Evidence in Support:</label>
                <textarea
                  name="evidence"
                  placeholder="Attach supporting documents"
                  value={formData.evidence}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
              </div>

              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="ml-2">
                    I hereby declare that the information provided is true to the best of my knowledge and belief.
                  </span>
                </label>
                {errors.declaration && (
                  <p className="text-red-600 text-sm mt-1">{errors.declaration}</p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => showSection(2)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg"
                >
                  Previous: Bordering Villages
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg"
                >
                  Submit Claim
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CommunityResource;
