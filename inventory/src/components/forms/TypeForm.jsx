import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // 👈 Import PropTypes
import {
  createEquipmentType,
  createToolType,
  postEquipmentRepair,
  fetchEquipmentList,
} from "../../api/axios";

export default function TypeForm({
  type = "equipment",
  title = "Create Equipment Type",
  description = "Add a new equipment type/category",
  successMessage = "Category created successfully!",
  errorMessage = "Failed to create category.",
  typeOptions = [
    { value: "outdoor", label: "Outdoor Unit" },
    { value: "indoor", label: "Indoor Unit" },
  ],
  placeholder = "router, radio, dish, etc.",
}) {
  const [formData, setFormData] = useState({});
  console.log(formData);
  const [equipmentOptions, setEquipmentOptions] = useState(typeOptions);
  const [status, setStatus] = useState({
    error: null,
    success: null,
    isSubmitting: false,
  });
  const [touchedFields, setTouchedFields] = useState({});

  const isEquipmentRepair = type === "equipment-repair";

  useEffect(() => {
    const initializeFormData = async () => {
      if (isEquipmentRepair) {
        try {
          const data = await fetchEquipmentList();
          const options = data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setEquipmentOptions(options);
          setFormData({
            repair_cost: "",
            repair_description: "",
            repair_date: new Date().toISOString().split("T")[0],
            equipment_id: options[0]?.value || "",
          });
        } catch (err) {
          console.error("Failed to fetch equipment list:", err);
          setStatus((s) => ({ ...s, error: "Failed to load equipment data." }));
        }
      } else {
        // initialize form data for equipment/tool types
        const initial = { name: "", description: "" };
        if (type === "equipment") {
          // default to the first provided option or 'outdoor'
          initial.type = typeOptions[0]?.value || "outdoor";
        }
        setFormData(initial);
      }
    };
    initializeFormData();
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: null, success: null, isSubmitting: true });
    setTouchedFields({}); // Reset touched fields on submit

    try {
      let apiCall;
      switch (type) {
        case "equipment":
          apiCall = createEquipmentType(formData);
          break;
        case "tool":
          apiCall = createToolType(formData);
          break;
        case "equipment-repair":
          apiCall = postEquipmentRepair(formData);
          break;
        default:
          throw new Error("Invalid form type.");
      }

      await apiCall;
      setStatus({ error: null, success: successMessage, isSubmitting: false }); // Reset form after successful submission

      if (isEquipmentRepair) {
        setFormData({
          repair_cost: "",
          repair_description: "",
          repair_date: new Date().toISOString().split("T")[0],
          equipment_id: equipmentOptions[0]?.value || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          type: typeOptions[0]?.value || "outdoor",
        });
      }
    } catch (err) {
      setStatus({
        error: err.response?.data?.message || errorMessage,
        success: null,
        isSubmitting: false,
      });
    }
  }; // Helper function to check if a field has an error

  const hasError = (fieldName) => {
    return touchedFields[fieldName] && !formData[fieldName];
  };

  return (
    <div className="w-full px-5 min-h-screen py-4">
           {" "}
      <div className="flex items-center gap-3 mb-6">
               {" "}
        <div className="bg-pink-100 dark:bg-pink-900/50 p-3 rounded-lg">
                   {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-pink-600 dark:text-pink-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
                       {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
                     {" "}
          </svg>
                 {" "}
        </div>
               {" "}
        <div>
                   {" "}
          <h1 className="text-2xl font-bold dark:text-white text-slate-800">
                        {title}         {" "}
          </h1>
                   {" "}
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {description}         {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden p-4 md:p-8 w-full shadow-sm">
               {" "}
        <form
          onSubmit={handleSubmit}
          className="divide-y divide-slate-200 dark:divide-slate-700"
        >
                    {/* Section 1: Basic Info */}         {" "}
          <div className="p-5 space-y-6">
                       {" "}
            <h2 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 text-lg">
                           {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                             {" "}
              </svg>
                            Basic Information            {" "}
            </h2>
                       {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {" "}
              {isEquipmentRepair ? (
                <div className="space-y-2">
                                   {" "}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Repair Cost*                  {" "}
                  </label>
                                   {" "}
                  <div className="relative">
                                       {" "}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                           {" "}
                      <span className="text-slate-500 sm:text-sm">₦</span>     
                                   {" "}
                    </div>
                                       {" "}
                    <input
                      type="number"
                      name="repair_cost"
                      value={formData.repair_cost || ""}
                      placeholder="e.g., 15000"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      min="0"
                      step="0.01"
                      className={`pl-7 w-full px-3 py-2.5 text-sm rounded-lg border ${
                        hasError("repair_cost")
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      } bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
                    />
                                     {" "}
                  </div>
                                   {" "}
                  {hasError("repair_cost") && (
                    <p className="text-red-500 text-xs mt-1">
                                            Repair cost is required            
                             {" "}
                    </p>
                  )}
                                 {" "}
                </div>
              ) : (
                <div className="space-y-2">
                                   {" "}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Name*                  {" "}
                  </label>
                                   {" "}
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border ${
                      hasError("name")
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
                  />
                                   {" "}
                  {hasError("name") && (
                    <p className="text-red-500 text-xs mt-1">
                                            Name is required                  
                       {" "}
                    </p>
                  )}
                                 {" "}
                </div>
              )}
                           {" "}
              {isEquipmentRepair && (
                <div className="space-y-2">
                                   {" "}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Repair Date*                  {" "}
                  </label>
                                   {" "}
                  <input
                    type="date"
                    name="repair_date"
                    value={formData.repair_date || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border ${
                      hasError("repair_date")
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
                  />
                                   {" "}
                  {hasError("repair_date") && (
                    <p className="text-red-500 text-xs mt-1">
                                            Repair date is required            
                             {" "}
                    </p>
                  )}
                                 {" "}
                </div>
              )}
                           {" "}
              {type === "equipment" && (
                <div className="space-y-2">
                                   {" "}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Type*                  {" "}
                  </label>
                                   {" "}
                  <select
                    name="type"
                    value={formData.type || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-slate-900 dark:text-white transition-colors"
                  >
                                       {" "}
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                                                {option.label}                 
                           {" "}
                      </option>
                    ))}
                                     {" "}
                  </select>
                                 {" "}
                </div>
              )}
                           {" "}
              {isEquipmentRepair && (
                <div className="space-y-2">
                                   {" "}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Equipment Item*                  {" "}
                  </label>
                                   {" "}
                  <select
                    name="equipment_id"
                    value={formData.equipment_id || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border ${
                      hasError("equipment_id")
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
                  >
                                       {" "}
                    {equipmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                                                {option.label}                 
                           {" "}
                      </option>
                    ))}
                                     {" "}
                  </select>
                                   {" "}
                  {hasError("equipment_id") && (
                    <p className="text-red-500 text-xs mt-1">
                                            Equipment selection is required    
                                     {" "}
                    </p>
                  )}
                                 {" "}
                </div>
              )}
                         {" "}
            </div>
                       {" "}
            <div className="space-y-2">
                           {" "}
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                               {" "}
                {isEquipmentRepair ? "Repair Description*" : "Description*"}   
                         {" "}
              </label>
                           {" "}
              <textarea
                name={isEquipmentRepair ? "repair_description" : "description"}
                value={
                  isEquipmentRepair
                    ? formData.repair_description || ""
                    : formData.description || ""
                }
                onChange={handleChange}
                onBlur={handleBlur}
                required
                rows={4}
                className={`w-full px-3 py-2.5 text-sm rounded-lg border ${
                  hasError(
                    isEquipmentRepair ? "repair_description" : "description",
                  )
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
                placeholder={
                  isEquipmentRepair
                    ? "Describe the repair details..."
                    : "Provide a detailed description..."
                }
              ></textarea>
                           {" "}
              {hasError(
                isEquipmentRepair ? "repair_description" : "description",
              ) && (
                <p className="text-red-500 text-xs mt-1">
                                   {" "}
                  {isEquipmentRepair ? "Repair description" : "Description"} is
                                    required                {" "}
                </p>
              )}
                         {" "}
            </div>
                     {" "}
          </div>
                    {/* Form Footer */}         {" "}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/30 flex flex-col sm:flex-row justify-between gap-4">
                       {" "}
            <div className="space-y-2 flex-1">
                           {" "}
              {status.error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
                                   {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                                       {" "}
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                                     {" "}
                  </svg>
                                    <span>{status.error}</span>             
                   {" "}
                </div>
              )}
                           {" "}
              {status.success && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm flex items-start gap-2">
                                   {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                                       {" "}
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                                     {" "}
                  </svg>
                                    <span>{status.success}</span>             
                   {" "}
                </div>
              )}
                         {" "}
            </div>
                       {" "}
            <div className="flex gap-3">
                           {" "}
              <button
                type="button"
                onClick={() => {
                  if (isEquipmentRepair) {
                    setFormData({
                      repair_cost: "",
                      repair_description: "",
                      repair_date: new Date().toISOString().split("T")[0],
                      equipment_id: equipmentOptions[0]?.value || "",
                    });
                  } else {
                    setFormData({
                      name: "",
                      description: "",
                      type: typeOptions[0]?.value || "outdoor",
                    });
                  }
                  setTouchedFields({});
                  setStatus({
                    error: null,
                    success: null,
                    isSubmitting: false,
                  });
                }}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                                Reset              {" "}
              </button>
                           {" "}
              <button
                type="submit"
                disabled={status.isSubmitting}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg text-white flex items-center justify-center gap-2 min-w-[120px] transition-colors ${
                  status.isSubmitting
                    ? "bg-pink-400 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                }`}
              >
                               {" "}
                {status.isSubmitting ? (
                  <>
                                       {" "}
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                                           {" "}
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                                           {" "}
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                                         {" "}
                    </svg>
                                        Saving...                  {" "}
                  </>
                ) : (
                  <>
                                       {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                                           {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                                         {" "}
                    </svg>
                                        Submit                  {" "}
                  </>
                )}
                             {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </form>
             {" "}
      </div>
         {" "}
    </div>
  );
}

TypeForm.propTypes = {
  // Defines the mode of the form, restricting it to a few specific strings
  type: PropTypes.oneOf(["equipment", "tool", "equipment-repair"]), // All other props are simple strings or an array of specific shapes
  title: PropTypes.string,
  description: PropTypes.string,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  typeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  placeholder: PropTypes.string,
};
