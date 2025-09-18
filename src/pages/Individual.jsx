import React, { useState, useEffect } from 'react';
import indiaStateData from "../assets/india_state_data.json";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Individual = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    nameoftheclaimant: '',
    nameofthespouse: '',
    nameofFather: '',
    address: '',
    state: '',
    district: '',
    taluka: '',
    gramPanchayat: '',
    village: '',
    scheduledTribe: '',
    otherTraditionalForestDweller: '',
    name: '',
    age: '',
    forHabitation: '',
    forSelfCultivation: '',
    disputedLands: '',
    pattas: '',
    alternativeLand: '',
    landFromWhereDisplacedWithoutCompensation: '',
    extentOfLandInForestVillages: '',
    anyOtherTraditionalRight: '',
    evidenceInSupport: '',
    anyOtherInformation: '',
    declaration: false
  });

  const [filePreviews, setFilePreviews] = useState({
    stCertificate: [],
    spouseStCertificate: [],
    evidenceFiles: []
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredTalukas, setFilteredTalukas] = useState([]);
  const [filteredPanchayats, setFilteredPanchayats] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);

  useEffect(() => {
    if (formData.state && indiaStateData[formData.state]) {
      setFilteredDistricts(Object.keys(indiaStateData[formData.state].districts));
    } else {
      setFilteredDistricts([]);
    }
    
    setFormData(prev => ({
      ...prev,
      district: '',
      taluka: '',
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
    
    setFormData(prev => ({
      ...prev,
      taluka: '',
      gramPanchayat: '',
      village: ''
    }));
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [formData.district]);

  useEffect(() => {
    if (formData.state && formData.district && formData.taluka && 
        indiaStateData[formData.state]?.districts[formData.district]?.talukas[formData.taluka]) {
      setFilteredPanchayats(Object.keys(indiaStateData[formData.state].districts[formData.district].talukas[formData.taluka].panchayats));
    } else {
      setFilteredPanchayats([]);
    }
    
    setFormData(prev => ({
      ...prev,
      gramPanchayat: '',
      village: ''
    }));
    setFilteredVillages([]);
  }, [formData.taluka]);

  useEffect(() => {
    if (formData.state && formData.district && formData.taluka && formData.gramPanchayat && 
        indiaStateData[formData.state]?.districts[formData.district]?.talukas[formData.taluka]?.panchayats[formData.gramPanchayat]) {
      setFilteredVillages(indiaStateData[formData.state].districts[formData.district].talukas[formData.taluka].panchayats[formData.gramPanchayat]);
    } else {
      setFilteredVillages([]);
    }
    
    setFormData(prev => ({
      ...prev,
      village: ''
    }));
  }, [formData.gramPanchayat]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'scheduledTribe') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        otherTraditionalForestDweller: value === 'no' ? 'yes' : prev.otherTraditionalForestDweller
      }));
    } else if (name === 'otherTraditionalForestDweller') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        scheduledTribe: value === 'no' ? 'yes' : prev.scheduledTribe
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileUpload = (e, fileType) => {
    const files = Array.from(e.target.files);
    
    const newPreviews = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    
    setFilePreviews(prev => ({
      ...prev,
      [fileType]: [...prev[fileType], ...newPreviews]
    }));
  };

  const removeFilePreview = (fileType, index) => {
    setFilePreviews(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }));
  };

  const validateSection = (sectionNum) => {
    const newErrors = {};
    
    if (sectionNum === 1) {
      if (!formData.nameoftheclaimant) newErrors.nameoftheclaimant = 'Please enter claimant name';
      if (!formData.nameofFather) newErrors.nameofFather = 'Please enter parent name';
      if (!formData.address) newErrors.address = 'Please enter your address';
      if (!formData.state) newErrors.state = 'Please select state';
      if (!formData.district) newErrors.district = 'Please select district';
      if (!formData.village) newErrors.village = 'Please select village';
      if (!formData.gramPanchayat) newErrors.gramPanchayat = 'Please select gram panchayat';
      if (!formData.taluka) newErrors.taluka = 'Please select tehsil/taluka';
      if (!formData.scheduledTribe) newErrors.scheduledTribe = 'Please select an option';
      if (!formData.otherTraditionalForestDweller) newErrors.otherTraditionalForestDweller = 'Please select an option';
      if (!formData.name) newErrors.name = 'Please enter family member name';
      if (!formData.age) newErrors.age = 'Please enter family member age';
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
    
    if (!formData.declaration) {
      setErrors(prev => ({ ...prev, declaration: 'You must accept the declaration' }));
      return;
    }
    axios.post('http://localhost:7000/api/v1/patta/individual', formData)
    .then((res)=>
      {
        console.log(res);
        alert('Form submitted successfully! Your claim has been received and will be processed.');
        // Reset form
        setFormData({
          nameoftheclaimant: '',
          nameofthespouse: '',
          nameofFather: '',
          address: '',
          state: '',
          district: '',
          taluka: '',
          gramPanchayat: '',
          village: '',
          scheduledTribe: '',
          otherTraditionalForestDweller: '',
          name: '',
          age: '',
          forHabitation: '',
          forSelfCultivation: '',
          disputedLands: '',
          pattas: '',
          alternativeLand: '',
          landFromWhereDisplacedWithoutCompensation: '',
          extentOfLandInForestVillages: '',
          anyOtherTraditionalRight: '',
          evidenceInSupport: '',
          anyOtherInformation: '',
          declaration: false
        });
        
        setFilePreviews({
          stCertificate: [],
          spouseStCertificate: [],
          evidenceFiles: []
        });
        
        setCurrentSection(1);
        navigate('/final');
      })
    .catch((err)=>
      {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-5">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-2xl m-40">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">Individual Rights (IR) Form</h1>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
            <div className="hidden md:block absolute top-4 left-0 w-full h-0.5 bg-gray-300 -z-10"></div>
            
            {[1, 2, 3].map(step => (
              <div key={step} className={`flex items-center mb-6 md:mb-0 ${step !== 1 ? 'md:ml-4' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white 
                  ${currentSection >= step ? 'bg-green-600' : 'bg-gray-400'}`}>
                  {currentSection > step ? '✓' : step}
                </div>
                <div className="ml-3">
                  <div className={`text-sm ${currentSection === step ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                    {step === 1 && 'Claimant Details'}
                    {step === 2 && 'Land Details'}
                    {step === 3 && 'Review & Submit'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Claimant Details */}
          {currentSection === 1 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-400">Claimant Details</h2>
              
              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  1. Name of the Claimant(s): <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nameoftheclaimant"
                  value={formData.nameoftheclaimant}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.nameoftheclaimant ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
                {errors.nameoftheclaimant && <p className="text-red-600 text-sm mt-1">{errors.nameoftheclaimant}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  2. Name of the Spouse:
                </label>
                <input
                  type="text"
                  name="nameofthespouse"
                  value={formData.nameofthespouse}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  3. Name of Father/Mother: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nameofFather"
                  value={formData.nameofFather}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.nameofFather ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
                {errors.nameofFather && <p className="text-red-600 text-sm mt-1">{errors.nameofFather}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  4. Address: <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  rows="3"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  5. State: <span className="text-red-600">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.state ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select State</option>
                  {Object.keys(indiaStateData).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  6. District: <span className="text-red-600">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.district ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!formData.state}
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  7. Tehsil/Taluka: <span className="text-red-600">*</span>
                </label>
                <select
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.taluka ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!formData.district}
                >
                  <option value="">Select Tehsil/Taluka</option>
                  {filteredTalukas.map(taluka => (
                    <option key={taluka} value={taluka}>{taluka}</option>
                  ))}
                </select>
                {errors.taluka && <p className="text-red-600 text-sm mt-1">{errors.taluka}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  8. Gram Panchayat: <span className="text-red-600">*</span>
                </label>
                <select
                  name="gramPanchayat"
                  value={formData.gramPanchayat}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.gramPanchayat ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!formData.taluka}
                >
                  <option value="">Select Gram Panchayat</option>
                  {filteredPanchayats.map(panchayat => (
                    <option key={panchayat} value={panchayat}>{panchayat}</option>
                  ))}
                </select>
                {errors.gramPanchayat && <p className="text-red-600 text-sm mt-1">{errors.gramPanchayat}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  9. Village: <span className="text-red-600">*</span>
                </label>
                <select
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.village ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!formData.gramPanchayat}
                >
                  <option value="">Select Village</option>
                  {filteredVillages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
                {errors.village && <p className="text-red-600 text-sm mt-1">{errors.village}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  10(a). Scheduled Tribe: <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="scheduledTribe"
                      value="yes"
                      checked={formData.scheduledTribe === 'yes'}
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="scheduledTribe"
                      value="no"
                      checked={formData.scheduledTribe === 'no'}
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.scheduledTribe && <p className="text-red-600 text-sm mt-1">{errors.scheduledTribe}</p>}
                
                {formData.scheduledTribe === 'yes' && (
                  <>
                    <label className="block text-green-900 font-medium mb-1 mt-3">
                      Attach authenticated copy of Certificate:
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'stCertificate')}
                      className="w-full p-2 border border-green-300 rounded-lg"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    
                    <div className="mt-2">
                      {filePreviews.stCertificate.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-green-100 p-2 rounded-md mb-1">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFilePreview('stCertificate', index)}
                            className="text-red-600 text-lg"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  10(b). Other Traditional Forest Dweller: <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="otherTraditionalForestDweller"
                      value="yes"
                      checked={formData.otherTraditionalForestDweller === 'yes'}
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                      disabled={formData.scheduledTribe === 'yes'}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="otherTraditionalForestDweller"
                      value="no"
                      checked={formData.otherTraditionalForestDweller === 'no'}
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                      disabled={formData.scheduledTribe === 'yes'}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.otherTraditionalForestDweller && <p className="text-red-600 text-sm mt-1">{errors.otherTraditionalForestDweller}</p>}
                
                {formData.otherTraditionalForestDweller === 'yes' && formData.scheduledTribe !== 'yes' && (
                  <>
                    <label className="block text-green-900 font-medium mb-1 mt-3">
                      If Spouse is Scheduled Tribe, attach certificate:
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'spouseStCertificate')}
                      className="w-full p-2 border border-green-300 rounded-lg"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    
                    <div className="mt-2">
                      {filePreviews.spouseStCertificate.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-green-100 p-2 rounded-md mb-1">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFilePreview('spouseStCertificate', index)}
                            className="text-red-600 text-lg"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-3">
                  11. Other Family Members (with age):
                </label>
                
                <div className="border border-green-200 rounded-lg p-4 bg-green-25">
                  <div className="mb-3">
                    <label className="block text-green-900 font-medium mb-1">
                      Name: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                      placeholder="Enter family member name"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-green-900 font-medium mb-1">
                      Age: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full p-3 border rounded-lg ${errors.age ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                      placeholder="Enter age"
                    />
                    {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 py-2 px-5 rounded-lg cursor-not-allowed opacity-50"
                  disabled
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => showSection(2)}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-5 rounded-lg"
                >
                  Next: Land Details
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Land Details */}
          {currentSection === 2 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-400">Nature of Claim on Land</h2>
              
              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-3">
                  13. Extent of Forest Land Occupied:
                </label>
                
                <div className="mb-3">
                  <label className="block text-green-900 font-medium mb-1">
                    a) For Habitation (in acres):
                  </label>
                  <input
                    type="number"
                    name="forHabitation"
                    value={formData.forHabitation}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-green-900 font-medium mb-1">
                    b) For Self-Cultivation (in acres):
                  </label>
                  <input
                    type="number"
                    name="forSelfCultivation"
                    value={formData.forSelfCultivation}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  14. Disputed Lands, if any:
                </label>
                <textarea
                  name="disputedLands"
                  value={formData.disputedLands}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  15. Pattas/Leases/Grants, if any:
                </label>
                <textarea
                  name="pattas"
                  value={formData.pattas}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  16. Land for In Situ Rehabilitation or Alternative Land, if any:
                </label>
                <textarea
                  name="alternativeLand"
                  value={formData.alternativeLand}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  17. Land from Where Displaced Without Compensation:
                </label>
                <textarea
                  name="landFromWhereDisplacedWithoutCompensation"
                  value={formData.landFromWhereDisplacedWithoutCompensation}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  18. Extent of Land in Forest Villages, if any (in acres):
                </label>
                <input
                  type="number"
                  name="extentOfLandInForestVillages"
                  value={formData.extentOfLandInForestVillages}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  19. Any Other Traditional Right, if any:
                </label>
                <textarea
                  name="anyOtherTraditionalRight"
                  value={formData.anyOtherTraditionalRight}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  20. Evidence in Support:
                </label>
                <textarea
                  name="evidenceInSupport"
                  value={formData.evidenceInSupport}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
                
                <label className="block text-green-900 font-medium mb-1 mt-3">
                  Attach Evidence Files:
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'evidenceFiles')}
                  className="w-full p-2 border border-green-300 rounded-lg"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                />
                
                <div className="mt-2">
                  {filePreviews.evidenceFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-100 p-2 rounded-md mb-1">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFilePreview('evidenceFiles', index)}
                        className="text-red-600 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  21. Any Other Information:
                </label>
                <textarea
                  name="anyOtherInformation"
                  value={formData.anyOtherInformation}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => showSection(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded-lg"
                >
                  Previous: Claimant Details
                </button>
                <button
                  type="button"
                  onClick={() => showSection(3)}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-5 rounded-lg"
                >
                  Next: Review & Submit
                </button>
              </div>
            </div>
          )}

          {/* Section 3: Review and Submit */}
          {currentSection === 3 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-400">Review Your Information</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-green-800 mb-2">Claimant Details</h3>
                <p><strong>Name:</strong> {formData.nameoftheclaimant || 'Not provided'}</p>
                <p><strong>Spouse Name:</strong> {formData.nameofthespouse || 'Not provided'}</p>
                <p><strong>Parent Name:</strong> {formData.nameofFather || 'Not provided'}</p>
                <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
                <p><strong>State:</strong> {formData.state || 'Not provided'}</p>
                <p><strong>District:</strong> {formData.district || 'Not provided'}</p>
                <p><strong>Village:</strong> {formData.village || 'Not provided'}</p>
                <p><strong>Gram Panchayat:</strong> {formData.gramPanchayat || 'Not provided'}</p>
                <p><strong>Tehsil/Taluka:</strong> {formData.taluka || 'Not provided'}</p>
                <p><strong>Scheduled Tribe:</strong> {formData.scheduledTribe || 'Not provided'}</p>
                <p><strong>Other Traditional Forest Dweller:</strong> {formData.otherTraditionalForestDweller || 'Not provided'}</p>
                <p><strong>Family Member Name:</strong> {formData.name || 'Not provided'}</p>
                <p><strong>Family Member Age:</strong> {formData.age || 'Not provided'}</p>
                
                <h3 className="text-lg font-medium text-green-800 mt-4 mb-2">Land Details</h3>
                <p><strong>Land for Habitation:</strong> {formData.forHabitation || '0'} acres</p>
                <p><strong>Land for Cultivation:</strong> {formData.forSelfCultivation || '0'} acres</p>
                <p><strong>Disputed Lands:</strong> {formData.disputedLands || 'None'}</p>
                <p><strong>Forest Village Land:</strong> {formData.extentOfLandInForestVillages || '0'} acres</p>
              </div>
              
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
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => showSection(2)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded-lg"
                >
                  Previous: Land Details
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-5 rounded-lg"
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

export default Individual;