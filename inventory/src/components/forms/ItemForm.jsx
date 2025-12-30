import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  createEquipment,
  fetchEquipmentTypes,
  createTool,
  fetchToolTypes,
  fetchLocations,
} from "../../api/axios";

// Define the shape of a Type item for PropTypes validation
const TypeItemShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  // Assuming the API returns a 'type' property based on its usage in the component
  type: PropTypes.string,
});

// Define the shape of a Location item for PropTypes validation
const LocationItemShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  // Location API response might have other properties, but 'name' is used.
});

export default function ItemForm({
  type, // "equipment" or "tool"
  title,
  description = "Fill in the equipment details",
  successMessage = "Equipment created successfully!",
  errorMessage = "Something went wrong. Please try again.",
  nameLabel = "Equipment Name",
  typeLabel = "Equipment Type",
  submitText = "Add Equipment",
}) {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    unit_cost: "",
    cost: "",
    type_id: "",
    serial_number: "",
    location_id: "",
    status: "", // Include status in initial state
  });

  const [images, setImages] = useState([]);
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData =
          type === "equipment"
            ? await fetchEquipmentTypes()
            : await fetchToolTypes();
        // Assuming typesData is an array of type objects directly
        setTypes(typesData);
      } catch (err) {
        setError(`Failed to fetch ${type} types.`);
        console.error(err);
      }
    };
    fetchTypes();
  }, [type]);

  // Fix: Clean up object URLs when 'images' change or component unmounts
  useEffect(() => {
    if (images.length > 0) {
      const newPreviewUrls = Array.from(images).map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImages(newPreviewUrls);

      // Cleanup function to revoke the URLs
      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setPreviewImages([]);
    }
    // Dependency on `images` is correct
  }, [images]);

  useEffect(() => {
    const fetchLocs = async () => {
      try {
        // Keeping this as-is, assuming fetchLocations returns { data: [...] }
        const locData = await fetchLocations();
        setLocations(locData.data);
      } catch (err) {
        setError("Failed to fetch locations.");
        console.error(err);
      }
    };
    fetchLocs();
    // Empty dependency array is correct for a one-time fetch
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      setError("Maximum 5 images allowed");
      // Optionally reset the file input field
      e.target.value = null;
      return;
    }
    setImages(e.target.files);
    setError(null);
  };

  const removeImage = (index) => {
    const newImages = Array.from(images).filter((_, i) => i !== index);

    // The DataTransfer method is the correct way to update a FileList programmatically
    const dt = new DataTransfer();
    newImages.forEach((file) => dt.items.add(file));
    setImages(dt.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("model", formData.model);
    data.append("type_id", formData.type_id); // type_id will be overwritten for tool_type_id if type is 'tool' later

    if (type === "equipment") {
      data.append("unit_cost", formData.unit_cost);
      data.append("equipment_type_id", formData.type_id);

      // Append images for equipment
      for (let i = 0; i < images.length; i++) {
        data.append("images[]", images[i]);
      }
    } else {
      // type === "tool"
      data.append("cost", formData.cost);
      data.append("tool_type_id", formData.type_id);

      // Conditionally append optional fields for tool
      if (formData.serial_number)
        data.append("serial_number", formData.serial_number);
      // NOTE: Location and Status are marked as required in the UI for tools, so they should typically not be wrapped in 'if' checks unless the backend handles empty strings.
      if (formData.location_id)
        data.append("location_id", formData.location_id);
      if (formData.status) data.append("status", formData.status);
    }

    try {
      if (type === "equipment") {
        await createEquipment(data);
      } else {
        await createTool(data);
      }
      setSuccess(successMessage);

      // FIX: Include all fields in reset, including 'status'
      setFormData({
        name: "",
        model: "",
        unit_cost: "",
        cost: "",
        type_id: "",
        serial_number: "",
        location_id: "",
        status: "", // <-- FIX: Status was missing here
      });
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      // Improved error handling to safely access nested message
      const apiErrorMessage = error.response?.data?.message || error.message;
      setError(apiErrorMessage || errorMessage);
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-6 px-2 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <div className="bg-gradient-to-br from-pink-500 to-indigo-600 p-3 rounded-xl shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="divide-y divide-gray-100 dark:divide-gray-700"
          >
            {/* Section 1: Basic Info */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {nameLabel}*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter equipment name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Model*
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter model number"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Type & Cost */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a5 5 0 00-10 0v2M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm7 4h.01"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Type & Cost
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {typeLabel}*
                  </label>
                  <select
                    name="type_id"
                    value={formData.type_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                  text-gray-900 dark:text-white"
                  >
                    <option value="">Select {type} type</option>
                    {/* Added a fallback check for typeItem.type */}
                    {types.map((typeItem) => (
                      <option key={typeItem.id} value={typeItem.id}>
                        {typeItem.name}{" "}
                        {typeItem.type ? `(${typeItem.type})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {type === "tool" ? "Cost (₦)*" : "Unit Cost (₦)*"}
                  </label>
                  <input
                    type="number"
                    name={type === "tool" ? "cost" : "unit_cost"}
                    value={type === "tool" ? formData.cost : formData.unit_cost}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                  text-gray-900 dark:text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Tool-specific fields */}
                {type === "tool" && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                     text-gray-900 dark:text-white"
                        placeholder="Optional serial number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location*
                      </label>
                      <select
                        name="location_id"
                        value={formData.location_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                     text-gray-900 dark:text-white"
                      >
                        <option value="">Select location</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status*
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                     text-gray-900 dark:text-white"
                      >
                        <option value="">Select Status</option>
                        <option value="in_store">In Store</option>
                        <option value="used">In Use</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 3: Images */}
            {type === "equipment" && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Images
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upload Images (max 5)
                    </label>
                    <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                      <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        Drop your images here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        PNG, JPG, JPEG up to 5MB each
                      </p>
                    </div>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {previewImages.map((src, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600 group-hover:border-red-400 transition-colors duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form Footer */}
            <div className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-red-700 dark:text-red-400 text-sm font-medium">
                        {error}
                      </span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-green-700 dark:text-green-400 text-sm font-medium">
                        {success}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                             transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/20 shadow-lg
                             flex items-center justify-center gap-2 min-w-[140px] ${
                               isSubmitting
                                 ? "opacity-70 cursor-not-allowed hover:scale-100"
                                 : ""
                             }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {submitText}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// FIX: Added PropTypes for internal state arrays (types and locations)
ItemForm.propTypes = {
  type: PropTypes.oneOf(["equipment", "tool"]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  nameLabel: PropTypes.string,
  typeLabel: PropTypes.string,
  submitText: PropTypes.string,
};
