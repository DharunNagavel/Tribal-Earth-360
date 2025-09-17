import React, { useState, useEffect } from 'react';
import indiaStateData from "../assets/india_state_data.json";

const Community = () => {
  const [currentSection, setCurrentSection] = useState(1);

  const [formData, setFormData] = useState({
    fdstCommunity: '',
    otfdCommunity: '',
    state: '',
    district: '',
    tehsil: '',
    gramPanchayat: '',
    village: '',
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

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredTalukas, setFilteredTalukas] = useState([]);
  const [filteredPanchayats, setFilteredPanchayats] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);

  // Cascading dropdowns for location
  useEffect(() => {
    if (formData.state && indiaStateData[formData.state]) {
      setFilteredDistricts(Object.keys(indiaStateData[formData.state].districts));
    } else {
      setFilteredDistricts([]);
    }
    setFormData(prev => ({
      ...prev,
      district: '',
      tehsil: '',
      gramPanchayat: '',
      village: ''
    }));
    setFilteredTalukas([]);
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [formData.state]);

  useEffect(() => {
    if (formData.state && formData.district && indiaStateData[formData.state]?.districts[formData.district]) {
      setFilteredTalukas(Object.keys(indiaStateData[formData.state].districts[formData.district].talukas));
    } else {
      setFilteredTalukas([]);
    }
    setFormData(prev => ({ ...prev, tehsil: '', gramPanchayat: '', village: '' }));
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [formData.district]);

  useEffect(() => {
    if (
      formData.state &&
      formData.district &&
      formData.tehsil &&
      indiaStateData[formData.state]?.districts[formData.district]?.talukas[formData.tehsil]
    ) {
      setFilteredPanchayats(Object.keys(indiaStateData[formData.state].districts[formData.district].talukas[formData.tehsil].panchayats));
    } else {
      setFilteredPanchayats([]);
    }
    setFormData(prev => ({ ...prev, gramPanchayat: '', village: '' }));
    setFilteredVillages([]);
  }, [formData.tehsil]);

  useEffect(() => {
    if (
      formData.state &&
      formData.district &&
      formData.tehsil &&
      formData.gramPanchayat &&
      indiaStateData[formData.state]?.districts[formData.district]?.talukas[formData.tehsil]?.panchayats[formData.gramPanchayat]
    ) {
      setFilteredVillages(indiaStateData[formData.state].districts[formData.district].talukas[formData.tehsil].panchayats[formData.gramPanchayat]);
    } else {
      setFilteredVillages([]);
    }
    setFormData(prev => ({ ...prev, village: '' }));
  }, [formData.gramPanchayat]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Section-wise validation
  const validateSection = (sectionNum) => {
    const newErrors = {};
    if (sectionNum === 1) {
      if (!formData.fdstCommunity) newErrors.fdstCommunity = 'Please select FDST community';
      if (!formData.otfdCommunity) newErrors.otfdCommunity = 'Please select OTFD community';
    } else if (sectionNum === 2) {
      if (!formData.state) newErrors.state = 'Please select state';
      if (!formData.district) newErrors.district = 'Please select district';
      if (!formData.tehsil) newErrors.tehsil = 'Please select tehsil/taluka';
      if (!formData.gramPanchayat) newErrors.gramPanchayat = 'Please select gram panchayat';
      if (!formData.village) newErrors.village = 'Please select village';
    } else if (sectionNum === 3) {
      // No mandatory fields here, but could add if needed
    }
    if (sectionNum === 3 && !formData.declaration) {
      newErrors.declaration = 'You must accept the declaration';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSection = (sectionNum) => {
    if (sectionNum > currentSection && !validateSection(currentSection)) {
      alert('Please complete all required fields before proceeding.');
      return;
    }
    setCurrentSection(sectionNum);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateSection(currentSection)) return;
    if (!formData.declaration) {
      setErrors({ declaration: 'You must accept the declaration' });
      return;
    }
    alert('Community Rights Form submitted successfully!');
    setErrors({});
    setCurrentSection(1);
    setFormData({
      fdstCommunity: '',
      otfdCommunity: '',
      state: '',
      district: '',
      tehsil: '',
      gramPanchayat: '',
      village: '',
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
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-5">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-3xl m-40">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
          Community Rights (CR) Form
        </h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
            <div className="hidden md:block absolute top-4 left-0 w-full h-0.5 bg-gray-300 -z-10"></div>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center mb-6 md:mb-0 ${step !== 1 ? 'md:ml-4' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    currentSection >= step ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                >
                  {currentSection > step ? '✓' : step}
                </div>
                <div className="ml-3">
                  <div
                    className={`text-sm ${
                      currentSection === step ? 'text-green-800 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {step === 1 && 'Claimant Community'}
                    {step === 2 && 'Location Details'}
                    {step === 3 && 'Community Rights'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Claimant Community */}
          {currentSection === 1 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-400">1. Name of the Claimant(s)</h2>
              <label className="block mb-4">
                FDST community: <span className="text-red-600">*</span>
                <select
                  name="fdstCommunity"
                  value={formData.fdstCommunity}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg mt-1 ${
                    errors.fdstCommunity ? 'border-red-500' : 'border-green-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.fdstCommunity && (
                  <p className="text-red-600 text-sm mt-1">{errors.fdstCommunity}</p>
                )}
              </label>

              <label className="block">
                OTFD community: <span className="text-red-600">*</span>
                <select
                  name="otfdCommunity"
                  value={formData.otfdCommunity}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg mt-1 ${
                    errors.otfdCommunity ? 'border-red-500' : 'border-green-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.otfdCommunity && (
                  <p className="text-red-600 text-sm mt-1">{errors.otfdCommunity}</p>
                )}
              </label>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => showSection(2)}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg"
                >
                  Next: Location Details
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Location Details */}
          {currentSection === 2 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-400">
                2. Location Details
              </h2>

              <label className="block mb-4">
                State: <span className="text-red-600">*</span>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${
                    errors.state ? 'border-red-500' : 'border-green-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select State</option>
                  {Object.keys(indiaStateData).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </label>

              <label className="block mb-4">
                District: <span className="text-red-600">*</span>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!formData.state}
                  className={`w-full p-2 border rounded-lg ${
                    errors.district ? 'border-red-500' : 'border-green-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
              </label>

              <label className="block mb-4">
                Tehsil/Taluka: <span className="text-red-600">*</span>
                <select
                  name="tehsil"
                  value={formData.tehsil}
                  onChange={handleInputChange}
                  disabled={!formData.district}
                  className={`w-full p-2 border rounded-lg ${
                    errors.tehsil ? 'border-red-500' : 'border-green-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select Tehsil/Taluka</option>
                  {filteredTalukas.map((taluka) => (
                    <option key={taluka} value={taluka}>
                      {taluka}
                    </option>
                  ))}
                </select>
                {errors.tehsil && <p className="text-red-600 text-sm mt-1">{errors.tehsil}</p>}
              </label>

              <label className="block mb-4">
                Gram Panchayat: <span className="text-red-600">*</span>
                <select
                  name="gramPanchayat"
                  value={formData.gramPanchayat}
                  onChange={handleInputChange}
                  disabled={!formData.tehsil}
                  className={`w-full p-2 border rounded-lg ${
                    errors.gramPanchayat ? 'border-red-500' : 'border-green-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select Gram Panchayat</option>
                  {filteredPanchayats.map((panchayat) => (
                    <option key={panchayat} value={panchayat}>
                      {panchayat}
                    </option>
                  ))}
                </select>
                {errors.gramPanchayat && (
                  <p className="text-red-600 text-sm mt-1">{errors.gramPanchayat}</p>
                )}
              </label>

              <label className="block mb-4">
                Village: <span className="text-red-600">*</span>
                <select
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  disabled={!formData.gramPanchayat}
                  className={`w-full p-2 border rounded-lg ${
                    errors.village ? 'border-red-500' : 'border-green-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select Village</option>
                  {filteredVillages.map((village) => (
                    <option key={village} value={village}>
                      {village}
                    </option>
                  ))}
                </select>
                {errors.village && <p className="text-red-600 text-sm mt-1">{errors.village}</p>}
              </label>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => showSection(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg"
                >
                  Previous: Claimant Community
                </button>
                <button
                  type="button"
                  onClick={() => showSection(3)}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg"
                >
                  Next: Community Rights
                </button>
              </div>
            </div>
          )}

          {/* Section 3: Community Rights */}
          {currentSection === 3 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-400">
                3. Nature of Community Rights Enjoyed
              </h2>

              <textarea
                name="nistarRights"
                placeholder="1. Community rights such as nistar, if any"
                value={formData.nistarRights}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="minorForestProduce"
                placeholder="2. Rights over minor forest produce, if any"
                value={formData.minorForestProduce}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="communityUses"
                placeholder="3(a). Uses/entitlements (fish, water bodies), if any"
                value={formData.communityUses}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="grazing"
                placeholder="3(b). Grazing, if any"
                value={formData.grazing}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="traditionalAccess"
                placeholder="3(c). Traditional resource access for nomadic and pastoralist, if any"
                value={formData.traditionalAccess}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="communityTenures"
                placeholder="4. Community tenures of habitat and habitation (PTGs, pre-agricultural)"
                value={formData.communityTenures}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="biodiversityRights"
                placeholder="5. Right to access biodiversity, traditional knowledge, etc."
                value={formData.biodiversityRights}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="otherTraditionalRights"
                placeholder="6. Other traditional rights, if any"
                value={formData.otherTraditionalRights}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="evidence"
                placeholder="7. Evidence in support (attach documents if any)"
                value={formData.evidence}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="additionalInfo"
                placeholder="8. Any other information"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="w-full p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <div className="mt-4">
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

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => showSection(2)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg"
                >
                  Previous: Location Details
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

export default Community;
