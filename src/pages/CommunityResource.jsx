import React, { useState } from "react";

const CommunityResource = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.declaration) {
      setErrors({ declaration: "You must accept the declaration" });
      return;
    }
    alert("Community Forest Rights Form submitted successfully!");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-5">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-3xl m-40">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-green-800 mb-2">
          Community Resource Rights (CFR) Form
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* 1. Village/Gram Sabha */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              1. Village / Gram Sabha:
            </label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* 2. Gram Panchayat */}
          <div className="mb-4">
            <label className="block font-medium mb-1">2. Gram Panchayat:</label>
            <input
              type="text"
              name="gramPanchayat"
              value={formData.gramPanchayat}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* 3. Tehsil/Taluka */}
          <div className="mb-4">
            <label className="block font-medium mb-1">3. Tehsil / Taluka:</label>
            <input
              type="text"
              name="tehsil"
              value={formData.tehsil}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* 4. District */}
          <div className="mb-4">
            <label className="block font-medium mb-1">4. District:</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* 5. Members */}
          <div className="mb-4">
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
              (Attach as separate sheet, with Scheduled Tribe / OTFD status next
              to each member)
            </p>
          </div>

          {/* 6. Khasra */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              6. Khasra / Compartment No(s):
            </label>
            <input
              type="text"
              name="khasra"
              value={formData.khasra}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* 7. Bordering Villages */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              7. Bordering Villages:
            </label>
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
              (Include info regarding sharing of resources/responsibilities with
              any other villages)
            </p>
          </div>

          {/* 8. Evidence */}
          <div className="mb-6">
            <label className="block font-medium mb-1">
              8. List of Evidence in Support:
            </label>
            <textarea
              name="evidence"
              placeholder="Attach supporting documents"
              value={formData.evidence}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* Declaration */}
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleInputChange}
                className="text-green-600 focus:ring-green-500 rounded"
              />
              <span className="ml-2">
                I hereby declare that the information provided is true to the
                best of my knowledge and belief.
              </span>
            </label>
            {errors.declaration && (
              <p className="text-red-600 text-sm mt-1">{errors.declaration}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg"
            >
              Submit Claim
            </button>
          </div>
        </form>

        
      </div>
    </div>
  );
};

export default CommunityResource;
