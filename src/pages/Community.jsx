import React, { useState } from 'react';

const Community = () => {
  const [formData, setFormData] = useState({
    fdstCommunity: '',
    otfdCommunity: '',
    village: '',
    gramPanchayat: '',
    tehsil: '',
    district: '',
    nistarRights: '',
    minorForestProduce: '',
    communityUses: '',
    grazing: '',
    traditionalAccess: '',
    communityTenures: '',
    biodiversityRights: '',
    otherTraditionalRights: '',
    evidence: '',
    additionalInfo: '',
    declaration: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.declaration) {
      setErrors({ declaration: 'You must accept the declaration' });
      return;
    }
    alert('Community Rights Form submitted successfully!');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-5">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-3xl m-40 ">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
          Community Rights (CR) Form
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Claimant Community */}
          <div className="mb-6 border p-5 rounded-lg bg-green-50">
            <h2 className="font-semibold text-green-700 mb-3">1. Name of the Claimant(s):</h2>
            <div className="mb-3">
              <label className="block font-medium mb-1">FDST community:</label>
              <select
                name="fdstCommunity"
                value={formData.fdstCommunity}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">OTFD community:</label>
              <select
                name="otfdCommunity"
                value={formData.otfdCommunity}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6 border p-5 rounded-lg bg-green-50">
            <h2 className="font-semibold text-green-700 mb-3">Location Details</h2>
            <input
              type="text"
              name="village"
              placeholder="Village"
              value={formData.village}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />
            <input
              type="text"
              name="gramPanchayat"
              placeholder="Gram Panchayat"
              value={formData.gramPanchayat}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />
            <input
              type="text"
              name="tehsil"
              placeholder="Tehsil/Taluka"
              value={formData.tehsil}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* Community Rights */}
          <div className="mb-6 border p-5 rounded-lg bg-green-50">
            <h2 className="font-semibold text-green-700 mb-3">Nature of Community Rights Enjoyed</h2>

            <textarea
              name="nistarRights"
              placeholder="1. Community rights such as nistar, if any"
              value={formData.nistarRights}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="minorForestProduce"
              placeholder="2. Rights over minor forest produce, if any"
              value={formData.minorForestProduce}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="communityUses"
              placeholder="3(a). Uses/entitlements (fish, water bodies), if any"
              value={formData.communityUses}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="grazing"
              placeholder="3(b). Grazing, if any"
              value={formData.grazing}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="traditionalAccess"
              placeholder="3(c). Traditional resource access for nomadic and pastoralist, if any"
              value={formData.traditionalAccess}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="communityTenures"
              placeholder="4. Community tenures of habitat and habitation (PTGs, pre-agricultural)"
              value={formData.communityTenures}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="biodiversityRights"
              placeholder="5. Right to access biodiversity, traditional knowledge, etc."
              value={formData.biodiversityRights}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="otherTraditionalRights"
              placeholder="6. Other traditional right, if any"
              value={formData.otherTraditionalRights}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="evidence"
              placeholder="7. Evidence in support (attach documents if any)"
              value={formData.evidence}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-green-300 rounded-lg"
            />

            <textarea
              name="additionalInfo"
              placeholder="8. Any other information"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded-lg"
            />
          </div>

          {/* Declaration */}
          <div className="mb-4">
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
            {errors.declaration && <p className="text-red-600 text-sm mt-1">{errors.declaration}</p>}
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

export default Community;
