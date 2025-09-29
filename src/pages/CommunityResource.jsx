import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import indiaStateData from "../assets/india_state_data.json";

// Zod schema definition
const communityResourceSchema = z.object({
  // Section 1: Basic Info
  village: z.string().min(1, "Please select village"),
  grampanchayat: z.string().min(1, "Please select gram panchayat"),
  taluka: z.string().min(1, "Please select tehsil/taluka"),
  district: z.string().min(1, "Please select district"),
  state: z.string().min(1, "Please select state"),
  nameofmembersofthegramsabha: z.string().min(1, "Names of Gram Sabha members are required"),
  compartmentno: z.string().min(1, "Compartment number is required"),

  // Section 2: Bordering Villages
  borderingvillages: z.array(z.string()).min(1, "At least one bordering village is required"),

  // Section 3: Evidence & Declaration
  listofevidenceinsupport: z.string().min(1, "List of evidence is required"),
  declaration: z.boolean().refine(val => val === true, {
    message: "You must accept the declaration",
  }),
});

const CommunityResource = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const navigate = useNavigate();
  
  // Location dropdown states
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
    resolver: zodResolver(communityResourceSchema),
    mode: "onChange",
    defaultValues: {
      state: "",
      district: "",
      taluka: "",
      grampanchayat: "",
      village: "",
      nameofmembersofthegramsabha: "",
      compartmentno: "",
      borderingvillages: ["", "", ""],
      listofevidenceinsupport: "",
      declaration: false,
    }
  });

  // Watch form values
  const watchedState = watch("state");
  const watchedDistrict = watch("district");
  const watchedTaluka = watch("taluka");
  const watchedGramPanchayat = watch("grampanchayat");
  const watchedBorderingVillages = watch("borderingvillages");

  // Cascading dropdowns for location
  useEffect(() => {
    if (watchedState && indiaStateData?.[watchedState]) {
      setFilteredDistricts(Object.keys(indiaStateData[watchedState].districts || {}));
    } else {
      setFilteredDistricts([]);
      setValue("district", "");
      setValue("taluka", "");
      setValue("grampanchayat", "");
      setValue("village", "");
    }
    setFilteredTalukas([]);
    setFilteredPanchayats([]);
    setFilteredVillages([]);
  }, [watchedState, setValue]);

  useEffect(() => {
    if (watchedState && watchedDistrict && indiaStateData?.[watchedState]?.districts?.[watchedDistrict]) {
      const districtData = indiaStateData[watchedState].districts[watchedDistrict];
      if (districtData && districtData.taluks) {
        setFilteredTalukas(Object.keys(districtData.taluks));
      } else {
        setFilteredTalukas([]);
      }
    } else {
      setFilteredTalukas([]);
    }
    
    setValue("taluka", "");
    setValue("grampanchayat", "");
    setValue("village", "");
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
      const talukData = indiaStateData[watchedState].districts[watchedDistrict].taluks[watchedTaluka];
      if (talukData && talukData.panchayats) {
        setFilteredPanchayats(Object.keys(talukData.panchayats));
      } else {
        setFilteredPanchayats([]);
      }
    } else {
      setFilteredPanchayats([]);
    }
    
    setValue("grampanchayat", "");
    setValue("village", "");
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
      const panchayatData = indiaStateData[watchedState].districts[watchedDistrict].taluks[watchedTaluka].panchayats[watchedGramPanchayat];
      setFilteredVillages(panchayatData || []);
    } else {
      setFilteredVillages([]);
    }
    
    setValue("village", "");
  }, [watchedGramPanchayat, setValue, watchedState, watchedDistrict, watchedTaluka]);

  // Handle bordering villages changes
  const handleBorderingChange = (index, value) => {
    const updated = [...watchedBorderingVillages];
    updated[index] = value;
    setValue("borderingvillages", updated);
    trigger("borderingvillages");
  };

  // Section-wise validation
  const validateSection = async (sectionNum) => {
    let fieldsToValidate = [];

    if (sectionNum === 1) {
      fieldsToValidate = [
        "state",
        "district", 
        "taluka",
        "grampanchayat",
        "village",
        "nameofmembersofthegramsabha",
        "compartmentno"
      ];
    } else if (sectionNum === 2) {
      fieldsToValidate = ["borderingvillages"];
    } else if (sectionNum === 3) {
      fieldsToValidate = ["listofevidenceinsupport", "declaration"];
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const showSection = async (sectionNum) => {
    if (sectionNum > currentSection) {
      const isValid = await validateSection(currentSection);
      if (!isValid) {
        alert("Please complete all required fields before proceeding.");
        return;
      }
    }
    setCurrentSection(sectionNum);
  };


  const onSubmit = async (data) => {
    try {
      // 1️⃣ Submit form to Node.js backend
      await axios.post(
        "http://localhost:7000/api/v1/patta/communityresource",
        data
      );

      // 3️⃣ Navigate to Displayscheme with AI recommendations
      navigate("/schemes", {
        state: {
          formData: data,
          formType: "communityResources",
        },
      });

      // 4️⃣ Reset form
      setValue("state", "");
      setValue("district", "");
      setValue("taluka", "");
      setValue("grampanchayat", "");
      setValue("village", "");
      setValue("nameofmembersofthegramsabha", "");
      setValue("compartmentno", "");
      setValue("borderingvillages", ["", "", ""]);
      setValue("listofevidenceinsupport", "");
      setValue("declaration", false);
      
      setCurrentSection(1);
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
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
                className={`flex items-center mb-6 md:mb-0 ${
                  step !== 1 ? "md:ml-4" : ""
                }`}
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
                      currentSection === step
                        ? "text-green-800 font-medium"
                        : "text-gray-600"
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section 1 */}
          {currentSection === 1 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6 space-y-4">
              <div>
                <label className="block text-green-900 font-medium mb-1">
                  1. State: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("state")}
                  className={`w-full p-3 border rounded-lg ${
                    errors.state ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
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

              <div>
                <label className="block text-green-900 font-medium mb-1">
                  2. District: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("district")}
                  disabled={!watchedState}
                  className={`w-full p-3 border rounded-lg ${
                    errors.district ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
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

              <div>
                <label className="block text-green-900 font-medium mb-1">
                  3. Tehsil / Taluka: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("taluka")}
                  disabled={!watchedDistrict}
                  className={`w-full p-3 border rounded-lg ${
                    errors.taluka ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
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

              <div>
                <label className="block text-green-900 font-medium mb-1">
                  4. Gram Panchayat: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("grampanchayat")}
                  disabled={!watchedTaluka}
                  className={`w-full p-3 border rounded-lg ${
                    errors.grampanchayat ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
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

              <div>
                <label className="block text-green-900 font-medium mb-1">
                  5. Village / Gram Sabha: <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("village")}
                  disabled={!watchedGramPanchayat}
                  className={`w-full p-3 border rounded-lg ${
                    errors.village ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  <option value="">Select Village</option>
                  {filteredVillages.map((village) => (
                    <option key={village} value={village}>
                      {village}
                    </option>
                  ))}
                </select>
                {errors.village && (
                  <p className="text-red-600 text-sm mt-1">{errors.village.message}</p>
                )}
              </div>

              <div>
                <label className="block text-green-900 font-medium mb-1">
                  6. Name(s) of members of the Gram Sabha: <span className="text-red-600">*</span>
                </label>
                <textarea
                  {...register("nameofmembersofthegramsabha")}
                  placeholder="Attach list with ST/OTFD status"
                  className={`w-full p-3 border rounded-lg ${
                    errors.nameofmembersofthegramsabha ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  rows="3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  (Attach as separate sheet, with Scheduled Tribe / OTFD status next to each member)
                </p>
                {errors.nameofmembersofthegramsabha && (
                  <p className="text-red-600 text-sm mt-1">{errors.nameofmembersofthegramsabha.message}</p>
                )}
              </div>

              <div>
                <label className="block text-green-900 font-medium mb-1">
                  7. Khasra / Compartment No(s): <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("compartmentno")}
                  className={`w-full p-3 border rounded-lg ${
                    errors.compartmentno ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
                {errors.compartmentno && (
                  <p className="text-red-600 text-sm mt-1">{errors.compartmentno.message}</p>
                )}
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

          {/* Section 2 */}
          {currentSection === 2 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6 space-y-4">
              <div>
                <label className="block text-green-900 font-medium mb-2">
                  8. Bordering Villages: <span className="text-red-600">*</span>
                </label>
                {watchedBorderingVillages.map((village, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Bordering Village ${index + 1}`}
                    value={village}
                    onChange={(e) => handleBorderingChange(index, e.target.value)}
                    className={`w-full p-3 mb-2 border rounded-lg ${
                      errors.borderingvillages ? "border-red-500" : "border-green-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  />
                ))}
                <p className="text-xs text-gray-500">
                  (Include info regarding sharing of resources/responsibilities with any other villages)
                </p>
                {errors.borderingvillages && (
                  <p className="text-red-600 text-sm mt-1">{errors.borderingvillages.message}</p>
                )}
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

          {/* Section 3 */}
          {currentSection === 3 && (
            <div className="border border-green-300 rounded-lg p-5 bg-green-50 mb-6 space-y-4">
              <div>
                <label className="block text-green-900 font-medium mb-1">
                  9. List of Evidence in Support: <span className="text-red-600">*</span>
                </label>
                <textarea
                  {...register("listofevidenceinsupport")}
                  placeholder="Attach supporting documents"
                  className={`w-full p-3 border rounded-lg ${
                    errors.listofevidenceinsupport ? "border-red-500" : "border-green-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-400`}
                  rows="3"
                />
                {errors.listofevidenceinsupport && (
                  <p className="text-red-600 text-sm mt-1">{errors.listofevidenceinsupport.message}</p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  {...register("declaration")}
                  className={`mr-2 mt-1 ${
                    errors.declaration ? "text-red-600" : "text-green-600"
                  } focus:ring-green-500 rounded`}
                />
                <label className="text-green-900">
                  I hereby declare that the information provided is true to the best of my knowledge and belief.
                </label>
              </div>
              {errors.declaration && (
                <p className="text-red-600 text-sm mt-1">{errors.declaration.message}</p>
              )}

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
                  disabled={isSubmitting}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Claim"}
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