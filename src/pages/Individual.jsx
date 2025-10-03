import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import indiaStateData from "../assets/india_state_data.json";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Zod schema definition
const individualFormSchema = z.object({
  // Section 1: Claimant Details
  nameoftheclaimant: z.string().min(1, 'Please enter claimant name'),
  nameofthespouse: z.string().optional(),
  nameofFather: z.string().min(1, 'Please enter parent name'),
  address: z.string().min(1, 'Please enter your address'),
  state: z.string().min(1, 'Please select state'),
  district: z.string().min(1, 'Please select district'),
  taluka: z.string().min(1, 'Please select tehsil/taluka'),
  gramPanchayat: z.string().min(1, 'Please select gram panchayat'),
  village: z.string().min(1, 'Please select village'),
  scheduledTribe: z.enum(['yes', 'no'], {
    required_error: 'Please select an option',
  }),
  otherTraditionalForestDweller: z.enum(['yes', 'no'], {
    required_error: 'Please select an option',
  }),
  name: z.string().min(1, 'Please enter family member name').optional(),
  age: z.string().min(1, 'Please enter family member age').optional().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Age must be a positive number'
  ),
  
  // Section 2: Land Details
  forHabitation: z.string().optional().transform(val => val || '0'),
  forSelfCultivation: z.string().optional().transform(val => val || '0'),
  disputedLands: z.string().optional(),
  pattas: z.string().optional(),
  alternativeLand: z.string().optional(),
  landFromWhereDisplacedWithoutCompensation: z.string().optional(),
  extentOfLandInForestVillages: z.string().optional().transform(val => val || '0'),
  anyOtherTraditionalRight: z.string().optional(),
  evidenceInSupport: z.string().optional(),
  anyOtherInformation: z.string().optional(),
  
  // Declaration
  declaration: z.boolean().refine(val => val === true, {
    message: 'You must accept the declaration',
  }),
}).refine(
  (data) => {
    // Custom validation: At least one of scheduledTribe or otherTraditionalForestDweller must be 'yes'
    return data.scheduledTribe === 'yes' || data.otherTraditionalForestDweller === 'yes';
  },
  {
    message: 'You must be either a Scheduled Tribe or Other Traditional Forest Dweller',
    path: ['scheduledTribe'],
  }
);

const Individual = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [filePreviews, setFilePreviews] = useState({
    stCertificate: [],
    spouseStCertificate: [],
    evidenceFiles: []
  });

  const navigate = useNavigate();
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredTalukas, setFilteredTalukas] = useState([]);
  const [filteredPanchayats, setFilteredPanchayats] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(individualFormSchema),
    mode: 'onChange',
    defaultValues: {
      scheduledTribe: undefined,
      otherTraditionalForestDweller: undefined,
      forHabitation: '',
      forSelfCultivation: '',
      extentOfLandInForestVillages: '',
      declaration: false
    }
  });

  // Watch form values for conditional logic
  const watchedState = watch('state');
  const watchedDistrict = watch('district');
  const watchedTaluka = watch('taluka');
  const watchedGramPanchayat = watch('gramPanchayat');
  const watchedScheduledTribe = watch('scheduledTribe');
  const watchedOtherTraditionalForestDweller = watch('otherTraditionalForestDweller');

  // Update location-based dropdowns
  useEffect(() => {
    if (watchedState && indiaStateData[watchedState]) {
      setFilteredDistricts(Object.keys(indiaStateData[watchedState].districts || {}));
    } else {
      setFilteredDistricts([]);
      setValue('district', '');
      setValue('taluka', '');
      setValue('gramPanchayat', '');
      setValue('village', '');
    }
    setFilteredTalukas([]);
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [watchedState, setValue]);

  useEffect(() => {
    if (watchedState && watchedDistrict && indiaStateData[watchedState]?.districts[watchedDistrict]) {
      const districtData = indiaStateData[watchedState].districts[watchedDistrict];
      if (districtData && districtData.taluks) {
        setFilteredTalukas(Object.keys(districtData.taluks));
      } else {
        setFilteredTalukas([]);
      }
    } else {
      setFilteredTalukas([]);
    }
    
    setValue('taluka', '');
    setValue('gramPanchayat', '');
    setValue('village', '');
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [watchedDistrict, setValue, watchedState]);

  useEffect(() => {
    if (watchedState && watchedDistrict && watchedTaluka && 
        indiaStateData[watchedState]?.districts[watchedDistrict]?.taluks[watchedTaluka]) {
      const talukData = indiaStateData[watchedState].districts[watchedDistrict].taluks[watchedTaluka];
      if (talukData && talukData.panchayats) {
        setFilteredPanchayats(Object.keys(talukData.panchayats));
      } else {
        setFilteredPanchayats([]);
      }
    } else {
      setFilteredPanchayats([]);
    }
    
    setValue('gramPanchayat', '');
    setValue('village', '');
    setFilteredVillages([]);
  }, [watchedTaluka, setValue, watchedState, watchedDistrict]);

  useEffect(() => {
    if (watchedState && watchedDistrict && watchedTaluka && watchedGramPanchayat && 
        indiaStateData[watchedState]?.districts[watchedDistrict]?.taluks[watchedTaluka]?.panchayats[watchedGramPanchayat]) {
      const panchayatData = indiaStateData[watchedState].districts[watchedDistrict].taluks[watchedTaluka].panchayats[watchedGramPanchayat];
      setFilteredVillages(panchayatData || []);
    } else {
      setFilteredVillages([]);
    }
    
    setValue('village', '');
  }, [watchedGramPanchayat, setValue, watchedState, watchedDistrict, watchedTaluka]);

  // Handle radio button changes with validation
  const handleRadioChange = (name, value) => {
    setValue(name, value);
    
    // Trigger validation for mutually exclusive fields
    if (name === 'scheduledTribe' && value === 'yes') {
      setValue('otherTraditionalForestDweller', 'no');
      trigger('otherTraditionalForestDweller');
    } else if (name === 'otherTraditionalForestDweller' && value === 'yes') {
      setValue('scheduledTribe', 'no');
      trigger('scheduledTribe');
    }
    
    trigger(name);
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

  const validateSection = async (sectionNum) => {
    let fieldsToValidate = [];

    if (sectionNum === 1) {
      fieldsToValidate = [
        'nameoftheclaimant', 'nameofFather', 'address', 'state', 'district', 
        'taluka', 'gramPanchayat', 'village', 'scheduledTribe', 
        'otherTraditionalForestDweller', 'name', 'age'
      ];
    } else if (sectionNum === 2) {
      fieldsToValidate = [
        'forHabitation', 'forSelfCultivation', 'disputedLands', 'pattas',
        'alternativeLand', 'landFromWhereDisplacedWithoutCompensation',
        'extentOfLandInForestVillages', 'anyOtherTraditionalRight',
        'evidenceInSupport', 'anyOtherInformation'
      ];
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const showSection = async (sectionNum) => {
    if (sectionNum > currentSection) {
      const isValid = await validateSection(currentSection);
      if (!isValid) {
        alert('Please complete all required fields before proceeding.');
        return;
      }
    }

    setCurrentSection(sectionNum);
  };

  const onSubmit = async (data) => {
    if (!data.declaration) {
      alert('You must accept the declaration');
      return;
    }

    try {
      const response = await axios.post("https://tribal-earth-360-bjjy.vercel.app/api/v1/patta/individual", data);
      console.log(response);
      
      navigate("/schemes", { 
        state: { 
          formData: data,
          formType: "individual" 
        } 
      });
    } catch (err) {
      console.log(err);
      alert('Error submitting form. Please try again.');
    }
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

        <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register('nameoftheclaimant')}
                  className={`w-full p-3 border rounded-lg ${errors.nameoftheclaimant ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
                {errors.nameoftheclaimant && <p className="text-red-600 text-sm mt-1">{errors.nameoftheclaimant.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  2. Name of the Spouse:
                </label>
                <input
                  type="text"
                  {...register('nameofthespouse')}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  3. Name of Father/Mother: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register('nameofFather')}
                  className={`w-full p-3 border rounded-lg ${errors.nameofFather ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
                {errors.nameofFather && <p className="text-red-600 text-sm mt-1">{errors.nameofFather.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  4. Address: <span className="text-red-600">*</span>
                </label>
                <textarea
                  {...register('address')}
                  className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  rows="3"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  5. State: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('state')}
                  className={`w-full p-3 border rounded-lg ${errors.state ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select State</option>
                  {Object.keys(indiaStateData).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  6. District: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('district')}
                  className={`w-full p-3 border rounded-lg ${errors.district ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!watchedState}
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  7. Tehsil/Taluka: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('taluka')}
                  className={`w-full p-3 border rounded-lg ${errors.taluka ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!watchedDistrict}
                >
                  <option value="">Select Tehsil/Taluka</option>
                  {filteredTalukas.map(taluka => (
                    <option key={taluka} value={taluka}>{taluka}</option>
                  ))}
                </select>
                {errors.taluka && <p className="text-red-600 text-sm mt-1">{errors.taluka.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  8. Gram Panchayat: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('gramPanchayat')}
                  className={`w-full p-3 border rounded-lg ${errors.gramPanchayat ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!watchedTaluka}
                >
                  <option value="">Select Gram Panchayat</option>
                  {filteredPanchayats.map(panchayat => (
                    <option key={panchayat} value={panchayat}>{panchayat}</option>
                  ))}
                </select>
                {errors.gramPanchayat && <p className="text-red-600 text-sm mt-1">{errors.gramPanchayat.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  9. Village: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('village')}
                  className={`w-full p-3 border rounded-lg ${errors.village ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                  disabled={!watchedGramPanchayat}
                >
                  <option value="">Select Village</option>
                  {filteredVillages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
                {errors.village && <p className="text-red-600 text-sm mt-1">{errors.village.message}</p>}
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
                      checked={watchedScheduledTribe === 'yes'}
                      onChange={() => handleRadioChange('scheduledTribe', 'yes')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="scheduledTribe"
                      value="no"
                      checked={watchedScheduledTribe === 'no'}
                      onChange={() => handleRadioChange('scheduledTribe', 'no')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.scheduledTribe && <p className="text-red-600 text-sm mt-1">{errors.scheduledTribe.message}</p>}
                
                {watchedScheduledTribe === 'yes' && (
                  <>
                    <label className="block text-green-900 font-medium mb-1 mt-3">
                      Attach authenticated copy of Certificate:
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'stCertificate')}
                      className="w-full p-2 border border-green-300 rounded-lg"
                      accept=".pdf"
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
                      checked={watchedOtherTraditionalForestDweller === 'yes'}
                      onChange={() => handleRadioChange('otherTraditionalForestDweller', 'yes')}
                      className="text-green-600 focus:ring-green-500"
                      disabled={watchedScheduledTribe === 'yes'}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="otherTraditionalForestDweller"
                      value="no"
                      checked={watchedOtherTraditionalForestDweller === 'no'}
                      onChange={() => handleRadioChange('otherTraditionalForestDweller', 'no')}
                      className="text-green-600 focus:ring-green-500"
                      disabled={watchedScheduledTribe === 'yes'}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.otherTraditionalForestDweller && <p className="text-red-600 text-sm mt-1">{errors.otherTraditionalForestDweller.message}</p>}
                
                {watchedOtherTraditionalForestDweller === 'yes' && watchedScheduledTribe !== 'yes' && (
                  <>
                    <label className="block text-green-900 font-medium mb-1 mt-3">
                      If Spouse is Scheduled Tribe, attach certificate:
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'spouseStCertificate')}
                      className="w-full p-2 border border-green-300 rounded-lg"
                      accept=".pdf"
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
                      {...register('name')}
                      className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                      placeholder="Enter family member name"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-green-900 font-medium mb-1">
                      Age: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('age')}
                      min="0"
                      className={`w-full p-3 border rounded-lg ${errors.age ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                      placeholder="Enter age"
                    />
                    {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>}
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
                    {...register('forHabitation')}
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
                    {...register('forSelfCultivation')}
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
                  {...register('disputedLands')}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  15. Pattas/Leases/Grants, if any:
                </label>
                <textarea
                  {...register('pattas')}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  16. Land for In Situ Rehabilitation or Alternative Land, if any:
                </label>
                <textarea
                  {...register('alternativeLand')}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  17. Land from Where Displaced Without Compensation:
                </label>
                <textarea
                  {...register('landFromWhereDisplacedWithoutCompensation')}
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
                  {...register('extentOfLandInForestVillages')}
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
                  {...register('anyOtherTraditionalRight')}
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  20. Evidence in Support:
                </label>
                <textarea
                  {...register('evidenceInSupport')}
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
                  {...register('anyOtherInformation')}
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
                <p><strong>Name:</strong> {watch('nameoftheclaimant') || 'Not provided'}</p>
                <p><strong>Spouse Name:</strong> {watch('nameofthespouse') || 'Not provided'}</p>
                <p><strong>Parent Name:</strong> {watch('nameofFather') || 'Not provided'}</p>
                <p><strong>Address:</strong> {watch('address') || 'Not provided'}</p>
                <p><strong>State:</strong> {watch('state') || 'Not provided'}</p>
                <p><strong>District:</strong> {watch('district') || 'Not provided'}</p>
                <p><strong>Village:</strong> {watch('village') || 'Not provided'}</p>
                <p><strong>Gram Panchayat:</strong> {watch('gramPanchayat') || 'Not provided'}</p>
                <p><strong>Tehsil/Taluka:</strong> {watch('taluka') || 'Not provided'}</p>
                <p><strong>Scheduled Tribe:</strong> {watch('scheduledTribe') || 'Not provided'}</p>
                <p><strong>Other Traditional Forest Dweller:</strong> {watch('otherTraditionalForestDweller') || 'Not provided'}</p>
                <p><strong>Family Member Name:</strong> {watch('name') || 'Not provided'}</p>
                <p><strong>Family Member Age:</strong> {watch('age') || 'Not provided'}</p>
                
                <h3 className="text-lg font-medium text-green-800 mt-4 mb-2">Land Details</h3>
                <p><strong>Land for Habitation:</strong> {watch('forHabitation') || '0'} acres</p>
                <p><strong>Land for Cultivation:</strong> {watch('forSelfCultivation') || '0'} acres</p>
                <p><strong>Disputed Lands:</strong> {watch('disputedLands') || 'None'}</p>
                <p><strong>Forest Village Land:</strong> {watch('extentOfLandInForestVillages') || '0'} acres</p>
              </div>
              
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('declaration')}
                    className="text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="ml-2">
                    I hereby declare that the information provided is true to the best of my knowledge and belief.
                  </span>
                </label>
                {errors.declaration && <p className="text-red-600 text-sm mt-1">{errors.declaration.message}</p>}
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
                  disabled={isSubmitting}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-5 rounded-lg"
                >
                  {isSubmitting ? "Submitting...." :"Submit Claim"}
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