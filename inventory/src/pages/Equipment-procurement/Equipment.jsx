import { useState, useEffect } from "react";
import { createEquipment, fetchEquipmentTypes } from "../../api/axios";

export default function EquipmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    images: [],
    unit_cost: "",
    equipment_type_id: "",
  });
  const [images, setImages] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await fetchEquipmentTypes();
        setEquipmentTypes(types);
      } catch (err) {
        setError("Failed to fetch equipment types.");
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const newPreviewUrls = [];
      Array.from(images).forEach((file) => {
        newPreviewUrls.push(URL.createObjectURL(file));
      });
      setPreviewImages(newPreviewUrls);
      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setPreviewImages([]);
    }
  }, [images]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setImages(e.target.files);
    setError(null);
  };

  const removeImage = (index) => {
    const newImages = Array.from(images).filter((_, i) => i !== index);
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
    data.append("unit_cost", formData.unit_cost);
    data.append("equipment_type_id", formData.equipment_type_id);
    for (let i = 0; i < images.length; i++) {
      data.append("images[]", images[i]);
    }

    try {
      await createEquipment(data);
      setSuccess("Equipment created successfully!");
      setFormData({
        name: "",
        model: "",
        unit_cost: "",
        equipment_type_id: "",
      });
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-pink-100 dark:bg-indigo-900/50 p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-pink-600 dark:text-indigo-400"
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
        <div>
          <h1 className="text-xl font-semibold dark:text-white">
            Add New Equipment
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fill in the equipment details
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="divide-y divide-slate-200 dark:divide-slate-700"
        >
          {/* Section 1: Basic Info */}
          <div className="p-5 space-y-4">
            <h2 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                  Equipment Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                  Model Number*
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Type & Cost */}
          <div className="p-5 space-y-4">
            <h2 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
                  d="M17 9V7a5 5 0 00-10 0v2M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm7 4h.01"
                />
              </svg>
              Type & Cost
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                  Equipment Type*
                </label>
                <select
                  name="equipment_type_id"
                  value={formData.equipment_type_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                >
                  <option value="">Select equipment type</option>
                  {equipmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                  Unit Cost (₦)*
                </label>
                <input
                  type="number"
                  name="unit_cost"
                  value={formData.unit_cost}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Images */}
          <div className="p-5 space-y-4">
            <h2 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Images
            </h2>
            <div>
              <label className="block text-sm mb-2 text-slate-600 dark:text-slate-400">
                Upload Images (max 5)
              </label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                accept="image/*"
              />
              {previewImages.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className="h-24 w-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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

          {/* Form Footer */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/30 flex flex-col sm:flex-row justify-between gap-3">
            <div className="space-y-1">
              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {success}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2 min-w-[120px] ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
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
                "Add Equipment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
