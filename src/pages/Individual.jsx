import React, { useState, useEffect } from 'react';
import indiaStateData from "../assets/india_state_data.json";
const stateData = indiaStateData;
const Individual = () => {
  
  const [currentSection, setCurrentSection] = useState(1);
  const [memberCount, setMemberCount] = useState(1);
  const [claimantDetails, setClaimantDetails] = useState({
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
    anyOtherInformation: ''
  });
  const [formData, setFormData] = useState({
    claimantName: '',
    spouseName: '',
    parentName: '',
    address: '',
    state: '',
    district: '',
    tehsil: '',
    gramPanchayat: '',
    village: '',
    scheduledTribe: '',
    traditionalForestDweller: '',
    familyMembers: [{ name: '', age: '' }],
    habitationLand: '',
    cultivationLand: '',
    disputedLands: '',
    pattasLeases: '',
    rehabilitationLand: '',
    displacedLand: '',
    forestVillageLand: '',
    traditionalRights: '',
    evidence: '',
    additionalInfo: '',
    declaration: false
  });
  const [filePreviews, setFilePreviews] = useState({
    stCertificate: [],
    spouseStCertificate: [],
    evidenceFiles: []
  });
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
    
    setFormData(prev => ({
      ...prev,
      tehsil: '',
      gramPanchayat: '',
      village: ''
    }));
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [formData.district]);

  
  useEffect(() => {
    if (formData.state && formData.district && formData.tehsil && 
        indiaStateData[formData.state]?.districts[formData.district]?.talukas[formData.tehsil]) {
      setFilteredPanchayats(Object.keys(indiaStateData[formData.state].districts[formData.district].talukas[formData.tehsil].panchayats));
    } else {
      setFilteredPanchayats([]);
    }
    
    setFormData(prev => ({
      ...prev,
      gramPanchayat: '',
      village: ''
    }));
    setFilteredVillages([]);
  }, [formData.tehsil]);

  
  useEffect(() => {
    if (formData.state && formData.district && formData.tehsil && formData.gramPanchayat && 
        indiaStateData[formData.state]?.districts[formData.district]?.talukas[formData.tehsil]?.panchayats[formData.gramPanchayat]) {
      setFilteredVillages(indiaStateData[formData.state].districts[formData.district].talukas[formData.tehsil].panchayats[formData.gramPanchayat]);
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
       
        traditionalForestDweller: value === 'no' ? 'yes' : prev.traditionalForestDweller
      }));
    } else if (name === 'traditionalForestDweller') {
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

 
  const handleFamilyMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index][field] = value;
    setFormData(prev => ({
      ...prev,
      familyMembers: updatedMembers
    }));
  };

  
  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: '', age: '' }]
    }));
    setMemberCount(prev => prev + 1);
  };

  
  const removeFamilyMember = (index) => {
    if (formData.familyMembers.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
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
      if (!formData.claimantName) newErrors.claimantName = 'Please enter claimant name';
      if (!formData.parentName) newErrors.parentName = 'Please enter parent name';
      if (!formData.address) newErrors.address = 'Please enter your address';
      if (!formData.state) newErrors.state = 'Please select state';
      if (!formData.district) newErrors.district = 'Please select district';
      if (!formData.village) newErrors.village = 'Please select village';
      if (!formData.gramPanchayat) newErrors.gramPanchayat = 'Please select gram panchayat';
      if (!formData.tehsil) newErrors.tehsil = 'Please select tehsil/taluka';
      if (!formData.scheduledTribe) newErrors.scheduledTribe = 'Please select an option';
      if (!formData.traditionalForestDweller) newErrors.traditionalForestDweller = 'Please select an option';
      
      
      formData.familyMembers.forEach((member, index) => {
        if (!member.name) newErrors[`memberName-${index}`] = 'Please enter name';
        if (!member.age) newErrors[`memberAge-${index}`] = 'Please enter age';
      });
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
    
    
    alert('Form submitted successfully! Your claim has been received and will be processed.');
    
    // Reset form
    setFormData({
      claimantName: '',
      spouseName: '',
      parentName: '',
      address: '',
      state: '',
      district: '',
      tehsil: '',
      gramPanchayat: '',
      village: '',
      scheduledTribe: '',
      traditionalForestDweller: '',
      familyMembers: [{ name: '', age: '' }],
      habitationLand: '',
      cultivationLand: '',
      disputedLands: '',
      pattasLeases: '',
      rehabilitationLand: '',
      displacedLand: '',
      forestVillageLand: '',
      traditionalRights: '',
      evidence: '',
      additionalInfo: '',
      declaration: false
    });
    
    setFilePreviews({
      stCertificate: [],
      spouseStCertificate: [],
      evidenceFiles: []
    });
    
    setCurrentSection(1);
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
                  name="claimantName"
                  value={formData.claimantName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.claimantName ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
                {errors.claimantName && <p className="text-red-600 text-sm mt-1">{errors.claimantName}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  2. Name of the Spouse:
                </label>
                <input
                  type="text"
                  name="spouseName"
                  value={formData.spouseName}
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
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.parentName ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
                {errors.parentName && <p className="text-red-600 text-sm mt-1">{errors.parentName}</p>}
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
                  name="tehsil"
                  value={formData.tehsil}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.tehsil ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!formData.district}
                >
                  <option value="">Select Tehsil/Taluka</option>
                  {filteredTalukas.map(taluka => (
                    <option key={taluka} value={taluka}>{taluka}</option>
                  ))}
                </select>
                {errors.tehsil && <p className="text-red-600 text-sm mt-1">{errors.tehsil}</p>}
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
                  disabled={!formData.tehsil}
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
                      name="traditionalForestDweller"
                      value="yes"
                      checked={formData.traditionalForestDweller === 'yes'}
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                      disabled={formData.scheduledTribe === 'yes'}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="traditionalForestDweller"
                      value="no"
                      checked={formData.traditionalForestDweller === 'no'}
                      onChange={handleInputChange}
                      className="text-green-600 focus:ring-green-500"
                      disabled={formData.scheduledTribe === 'yes'}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.traditionalForestDweller && <p className="text-red-600 text-sm mt-1">{errors.traditionalForestDweller}</p>}
                
                {formData.traditionalForestDweller === 'yes' && formData.scheduledTribe !== 'yes' && (
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
                <label className="block text-green-900 font-medium mb-1">
                  11. Other Family Members (with age):
                </label>
                
                {formData.familyMembers.map((member, index) => (
                  <div key={index} className="border border-green-300 p-4 rounded-lg mb-3 relative">
                    {formData.familyMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(index)}
                        className="absolute top-2 right-2 text-red-600 text-xl"
                      >
                        ×
                      </button>
                    )}
                    
                    <div className="mb-3">
                      <label className="block text-green-900 font-medium mb-1">
                        Name: <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                        className={`w-full p-2 border rounded-lg ${errors[`memberName-${index}`] ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                      />
                      {errors[`memberName-${index}`] && <p className="text-red-600 text-sm mt-1">{errors[`memberName-${index}`]}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-green-900 font-medium mb-1">
                        Age: <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={member.age}
                        onChange={(e) => handleFamilyMemberChange(index, 'age', e.target.value)}
                        min="0"
                        className={`w-full p-2 border rounded-lg ${errors[`memberAge-${index}`] ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                      />
                      {errors[`memberAge-${index}`] && <p className="text-red-600 text-sm mt-1">{errors[`memberAge-${index}`]}</p>}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm"
                >
                  Add Another Family Member
                </button>
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
                  1. Extent of Forest Land Occupied:
                </label>
                
                <div className="mb-3">
                  <label className="block text-green-900 font-medium mb-1">
                    a) For Habitation (in acres):
                  </label>
                  <input
                    type="number"
                    name="habitationLand"
                    value={formData.habitationLand}
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
                    name="cultivationLand"
                    value={formData.cultivationLand}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  2. Disputed Lands, if any:
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
                  3. Pattas/Leases/Grants, if any:
                </label>
                <textarea
                  name="pattasLeases"
                  value={formData.pattasLeases}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  4. Land for In Situ Rehabilitation or Alternative Land, if any:
                </label>
                <textarea
                  name="rehabilitationLand"
                  value={formData.rehabilitationLand}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  5. Land from Where Displaced Without Compensation:
                </label>
                <textarea
                  name="displacedLand"
                  value={formData.displacedLand}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  6. Extent of Land in Forest Villages, if any (in acres):
                </label>
                <input
                  type="number"
                  name="forestVillageLand"
                  value={formData.forestVillageLand}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  7. Any Other Traditional Right, if any:
                </label>
                <textarea
                  name="traditionalRights"
                  value={formData.traditionalRights}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  8. Evidence in Support:
                </label>
                <textarea
                  name="evidence"
                  value={formData.evidence}
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
                  9. Any Other Information:
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
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
                <p><strong>Name:</strong> {formData.claimantName || 'Not provided'}</p>
                <p><strong>Spouse Name:</strong> {formData.spouseName || 'Not provided'}</p>
                <p><strong>Parent Name:</strong> {formData.parentName || 'Not provided'}</p>
                <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
                <p><strong>State:</strong> {formData.state || 'Not provided'}</p>
                <p><strong>District:</strong> {formData.district || 'Not provided'}</p>
                <p><strong>Village:</strong> {formData.village || 'Not provided'}</p>
                <p><strong>Gram Panchayat:</strong> {formData.gramPanchayat || 'Not provided'}</p>
                <p><strong>Tehsil/Taluka:</strong> {formData.tehsil || 'Not provided'}</p>
                <p><strong>Scheduled Tribe:</strong> {formData.scheduledTribe || 'Not provided'}</p>
               
                <h3 className="text-lg font-medium text-green-800 mt-4 mb-2">Family Members</h3>
                {formData.familyMembers.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {formData.familyMembers.map((member, index) => (
                      <li key={index}>{member.name} ({member.age} years)</li>
                    ))}
                  </ul>
                ) : (
                  <p>No family members added</p>
                )}
                
                <h3 className="text-lg font-medium text-green-800 mt-4 mb-2">Land Details</h3>
                <p><strong>Land for Habitation:</strong> {formData.habitationLand || '0'} acres</p>
                <p><strong>Land for Cultivation:</strong> {formData.cultivationLand || '0'} acres</p>
                <p><strong>Disputed Lands:</strong> {formData.disputedLands || 'None'}</p>
                <p><strong>Forest Village Land:</strong> {formData.forestVillageLand || '0'} acres</p>
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