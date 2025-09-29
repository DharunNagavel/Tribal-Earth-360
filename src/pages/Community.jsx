import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import indiaStateData from "../assets/india_state_data.json";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Zod schema definition
const communityFormSchema = z.object({
  // Section 1: Claimant Community
  FDSTcommunity: z.enum(['yes', 'no'], {
    required_error: 'Please select FDST community',
  }),
  OTFDcommunity: z.enum(['yes', 'no'], {
    required_error: 'Please select OTFD community',
  }),

  // Section 2: Location Details
  state: z.string().min(1, 'Please select state'),
  district: z.string().min(1, 'Please select district'),
  taluka: z.string().min(1, 'Please select tehsil/taluka'),
  grampanchayat: z.string().min(1, 'Please select gram panchayat'),
  village: z.string().min(1, 'Please select village'),

  // Section 3: Community Rights
  communityrightssuchasnistar: z.string().optional(),
  rightsoverminorforestproduce: z.string().optional(),
  uses: z.string().optional(),
  grazing: z.string().optional(),
  traditionalresourceaccessfornomadicandpastoralist: z.string().optional(),
  communitytenuresofhabitatandhabitation: z.string().optional(),
  righttoaccessbiodiversity: z.string().optional(),
  othertraditionalrights: z.string().optional(),
  evidenceinsupport: z.string().optional(),
  anyotherinformation: z.string().optional(),

  // Declaration
  declaration: z.boolean().refine(val => val === true, {
    message: 'You must accept the declaration',
  }),
}).refine(
  (data) => {
    // Custom validation: At least one of FDSTcommunity or OTFDcommunity must be 'yes'
    return data.FDSTcommunity === 'yes' || data.OTFDcommunity === 'yes';
  },
  {
    message: 'You must be either a FDST community or OTFD community',
    path: ['FDSTcommunity'],
  }
);

const Community = () => {
  const [currentSection, setCurrentSection] = useState(1);
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
    formState: { errors,isSubmitting }
  } = useForm({
    resolver: zodResolver(communityFormSchema),
    mode: 'onChange',
    defaultValues: {
      FDSTcommunity: undefined,
      OTFDcommunity: undefined,
      declaration: false
    }
  });

  // Watch form values for conditional logic
  const watchedState = watch('state');
  const watchedDistrict = watch('district');
  const watchedTaluka = watch('taluka');
  const watchedGramPanchayat = watch('grampanchayat');
  const watchedFDSTcommunity = watch('FDSTcommunity');
  const watchedOTFDcommunity = watch('OTFDcommunity');

  // Cascading dropdowns for location
  useEffect(() => {
    if (watchedState && indiaStateData?.[watchedState]) {
      setFilteredDistricts(Object.keys(indiaStateData[watchedState].districts || {}));
    } else {
      setFilteredDistricts([]);
      setValue('district', '');
      setValue('taluka', '');
      setValue('grampanchayat', '');
      setValue('village', '');
    }
    setFilteredTalukas([]);
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [watchedState, setValue]);

  useEffect(() => {
    if (watchedState && watchedDistrict && indiaStateData?.[watchedState]?.districts?.[watchedDistrict]) {
      setFilteredTalukas(Object.keys(indiaStateData[watchedState].districts[watchedDistrict].taluks || {}));
    } else {
      setFilteredTalukas([]);
    }
    setValue('taluka', '');
    setValue('grampanchayat', '');
    setValue('village', '');
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [watchedDistrict, setValue, watchedState]);

  useEffect(() => {
    if (
      watchedState &&
      watchedDistrict &&
      watchedTaluka &&
      indiaStateData?.[watchedState]?.districts?.[watchedDistrict]?.taluks?.[watchedTaluka]
    ) {
      setFilteredPanchayats(Object.keys(
        indiaStateData?.[watchedState]?.districts?.[watchedDistrict]?.taluks?.[watchedTaluka]?.panchayats || {}));
    } else {
      setFilteredPanchayats([]);
    }
    setValue('grampanchayat', '');
    setValue('village', '');
    setFilteredVillages([]);
  }, [watchedTaluka, setValue, watchedState, watchedDistrict]);

  useEffect(() => {
    if (
      watchedState &&
      watchedDistrict &&
      watchedTaluka &&
      watchedGramPanchayat &&
      indiaStateData?.[watchedState]?.districts?.[watchedDistrict]?.taluks?.[watchedTaluka]?.panchayats?.[watchedGramPanchayat]
    ) {
      setFilteredVillages(indiaStateData?.[watchedState]?.districts?.[watchedDistrict]?.taluks?.[watchedTaluka]?.panchayats?.[watchedGramPanchayat] || []);
    } else {
      setFilteredVillages([]);
    }
    setValue('village', '');
  }, [watchedGramPanchayat, setValue, watchedState, watchedDistrict, watchedTaluka]);

  // Handle radio button changes with validation
  const handleRadioChange = (name, value) => {
    setValue(name, value);
    
    // Trigger validation for mutually exclusive fields
    if (name === 'FDSTcommunity' && value === 'yes') {
      setValue('OTFDcommunity', 'no');
      trigger('OTFDcommunity');
    } else if (name === 'OTFDcommunity' && value === 'yes') {
      setValue('FDSTcommunity', 'no');
      trigger('FDSTcommunity');
    }
    
    trigger(name);
  };

  // Section-wise validation
  const validateSection = async (sectionNum) => {
    let fieldsToValidate = [];

    if (sectionNum === 1) {
      fieldsToValidate = ['FDSTcommunity', 'OTFDcommunity'];
    } else if (sectionNum === 2) {
      fieldsToValidate = ['state', 'district', 'taluka', 'grampanchayat', 'village'];
    } else if (sectionNum === 3) {
      fieldsToValidate = ['declaration'];
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
    try {
      const response = await axios.post('http://localhost:7000/api/v1/patta/community', { formData: data });
      console.log(response);
      
      navigate('/schemes', { state: { formData: data, formType: "community" } });
      
      // Reset form
      setValue('FDSTcommunity', undefined);
      setValue('OTFDcommunity', undefined);
      setValue('state', '');
      setValue('district', '');
      setValue('taluka', '');
      setValue('grampanchayat', '');
      setValue('village', '');
      setValue('communityrightssuchasnistar', '');
      setValue('rightsoverminorforestproduce', '');
      setValue('uses', '');
      setValue('grazing', '');
      setValue('traditionalresourceaccessfornomadicandpastoralist', '');
      setValue('communitytenuresofhabitatandhabitation', '');
      setValue('righttoaccessbiodiversity', '');
      setValue('othertraditionalrights', '');
      setValue('evidenceinsupport', '');
      setValue('anyotherinformation', '');
      setValue('declaration', false);
      
      setCurrentSection(1);
    } catch (err) {
      console.log(err);
      alert('Error submitting form. Please try again.');
    }
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section 1: Claimant Community */}
          {currentSection === 1 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-400">1. Name of the Claimant(s)</h2>
              
              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  FDST community: <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="FDSTcommunity"
                      value="yes"
                      checked={watchedFDSTcommunity === 'yes'}
                      onChange={() => handleRadioChange('FDSTcommunity', 'yes')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="FDSTcommunity"
                      value="no"
                      checked={watchedFDSTcommunity === 'no'}
                      onChange={() => handleRadioChange('FDSTcommunity', 'no')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.FDSTcommunity && (
                  <p className="text-red-600 text-sm mt-1">{errors.FDSTcommunity.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  OTFD community: <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="OTFDcommunity"
                      value="yes"
                      checked={watchedOTFDcommunity === 'yes'}
                      onChange={() => handleRadioChange('OTFDcommunity', 'yes')}
                      className="text-green-600 focus:ring-green-500"
                      disabled={watchedFDSTcommunity === 'yes'}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="OTFDcommunity"
                      value="no"
                      checked={watchedOTFDcommunity === 'no'}
                      onChange={() => handleRadioChange('OTFDcommunity', 'no')}
                      className="text-green-600 focus:ring-green-500"
                      disabled={watchedFDSTcommunity === 'yes'}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.OTFDcommunity && (
                  <p className="text-red-600 text-sm mt-1">{errors.OTFDcommunity.message}</p>
                )}
              </div>

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

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  State: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('state')}
                  className={`w-full p-3 border rounded-lg ${errors.state ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select State</option>
                  {Object.keys(indiaStateData || {}).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  District: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('district')}
                  disabled={!watchedState}
                  className={`w-full p-3 border rounded-lg ${errors.district ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  Tehsil/Taluka: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('taluka')}
                  disabled={!watchedDistrict}
                  className={`w-full p-3 border rounded-lg ${errors.taluka ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select Tehsil/Taluka</option>
                  {filteredTalukas.map((taluka) => (
                    <option key={taluka} value={taluka}>
                      {taluka}
                    </option>
                  ))}
                </select>
                {errors.taluka && <p className="text-red-600 text-sm mt-1">{errors.taluka.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  Gram Panchayat: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('grampanchayat')}
                  disabled={!watchedTaluka}
                  className={`w-full p-3 border rounded-lg ${errors.grampanchayat ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select Gram Panchayat</option>
                  {filteredPanchayats.map((panchayat) => (
                    <option key={panchayat} value={panchayat}>
                      {panchayat}
                    </option>
                  ))}
                </select>
                {errors.grampanchayat && (
                  <p className="text-red-600 text-sm mt-1">{errors.grampanchayat.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-green-900 font-medium mb-1">
                  Village: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('village')}
                  disabled={!watchedGramPanchayat}
                  className={`w-full p-3 border rounded-lg ${errors.village ? 'border-red-500' : 'border-green-300'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select Village</option>
                  {filteredVillages.map((village) => (
                    <option key={village} value={village}>
                      {village}
                    </option>
                  ))}
                </select>
                {errors.village && <p className="text-red-600 text-sm mt-1">{errors.village.message}</p>}
              </div>

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

              <div className="mb-4">
                <textarea
                  {...register('communityrightssuchasnistar')}
                  placeholder="1. Community rights such as nistar, if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('rightsoverminorforestproduce')}
                  placeholder="2. Rights over minor forest produce, if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('uses')}
                  placeholder="3(a). Uses/entitlements (fish, water bodies), if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('grazing')}
                  placeholder="3(b). Grazing, if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('traditionalresourceaccessfornomadicandpastoralist')}
                  placeholder="3(c). Traditional resource access for nomadic and pastoralist, if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('communitytenuresofhabitatandhabitation')}
                  placeholder="4. Community tenures of habitat and habitation, if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('righttoaccessbiodiversity')}
                  placeholder="5. Right to access biodiversity, if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('othertraditionalrights')}
                  placeholder="6. Other traditional rights enjoyed, if any"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('evidenceinsupport')}
                  placeholder="7. Evidence in support of rights vested with community"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <textarea
                  {...register('anyotherinformation')}
                  placeholder="8. Any other information relevant to community rights"
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                />
              </div>

              <div className="mt-4 flex items-start">
                <input
                  type="checkbox"
                  {...register('declaration')}
                  className="mr-2 mt-1 text-green-600 focus:ring-green-500 rounded"
                />
                <label className="text-green-900">
                  I declare that the information given above is true to the best of my knowledge and belief.
                </label>
              </div>
              {errors.declaration && (
                <p className="text-red-600 text-sm mt-1">{errors.declaration.message}</p>
              )}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => showSection(2)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg"
                >
                  Previous: Location Details
                </button>
                <button
                disabled={isSubmitting}
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
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