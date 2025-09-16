import React, { useState } from "react";
import indiaData from "../assets/india_state_data.json"; // keep your big JSON file here

const Individual = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([{ name: "", relation: "" }]);

  const [formData, setFormData] = useState({
    claimantName: "",
    spouseName: "",
    parentName: "",
    address: "",
    state: "",
    district: "",
    taluka: "",
    panchayat: "",
    village: "",
  });

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    setFiles([...files, ...uploaded]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Family member handlers
  const handleFamilyChange = (i, field, value) => {
    const members = [...familyMembers];
    members[i][field] = value;
    setFamilyMembers(members);
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", relation: "" }]);
  };

  // Navigation
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, files, familyMembers });
    alert("Form submitted successfully!");
    // Reset
    setFormData({
      claimantName: "",
      spouseName: "",
      parentName: "",
      address: "",
      state: "",
      district: "",
      taluka: "",
      panchayat: "",
      village: "",
    });
    setFiles([]);
    setFamilyMembers([{ name: "", relation: "" }]);
    setCurrentStep(1);
  };

  // Cascading data from india_state_data.json
  const stateOptions = Object.keys(indiaData || {});
  const districtOptions = formData.state ? Object.keys(indiaData[formData.state]?.districts || {}) : [];
  const talukaOptions =
    formData.state && formData.district
      ? Object.keys(indiaData[formData.state]?.districts[formData.district]?.talukas || {})
      : [];
  const panchayatOptions =
    formData.state && formData.district && formData.taluka
      ? Object.keys(
          indiaData[formData.state]?.districts[formData.district]?.talukas[formData.taluka]?.panchayats || {}
        )
      : [];
  const villageOptions =
    formData.state && formData.district && formData.taluka && formData.panchayat
      ? indiaData[formData.state]?.districts[formData.district]?.talukas[formData.taluka]?.panchayats[
          formData.panchayat
        ] || []
      : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Individual Rights Claim Form</h2>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Step 1: Claimant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="claimantName"
                value={formData.claimantName}
                onChange={handleChange}
                placeholder="Claimant Name"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="spouseName"
                value={formData.spouseName}
                onChange={handleChange}
                placeholder="Spouse Name"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Parent Name"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded"
                required
              />
            </div>

            {/* Location cascading */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select State</option>
                {stateOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select District</option>
                {districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                name="taluka"
                value={formData.taluka}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Taluka</option>
                {talukaOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                name="panchayat"
                value={formData.panchayat}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Panchayat</option>
                {panchayatOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Village</option>
                {villageOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Step 2: Family & Documents</h3>

            {/* Family Members */}
            {familyMembers.map((member, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Member Name"
                  value={member.name}
                  onChange={(e) => handleFamilyChange(i, "name", e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="text"
                  placeholder="Relation"
                  value={member.relation}
                  onChange={(e) => handleFamilyChange(i, "relation", e.target.value)}
                  className="border p-2 rounded flex-1"
                />
              </div>
            ))}
            <button type="button" onClick={addFamilyMember} className="text-blue-600 underline mb-4">
              + Add Family Member
            </button>

            {/* File Uploads */}
            <input type="file" multiple onChange={handleFileUpload} className="mb-2" />
            <div>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between border p-2 mb-1">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeFile(idx)} className="text-red-600">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">
                Back
              </button>
              <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Step 3: Review & Submit</h3>
            <pre className="bg-gray-100 p-4 rounded mb-4 text-sm">
              {JSON.stringify({ formData, familyMembers, files: files.map((f) => f.name) }, null, 2)}
            </pre>
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">
                Back
              </button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Individual;
