import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios'; // Ensure this is your custom axios instance

const EquipmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    unit_cost: '',
    equipment_type_id: '',
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  // Fetch equipment types from the API on component mount
  useEffect(() => {
    const fetchEquipmentType = async () => {
      try {
        const response = await apiClient.get("/inventory/equipment-type/list");
        // Check the expected response format, e.g., response.data.type should be an array.
        if (response.data && response.data.type) {
          setEquipmentTypes(response.data.type);
          console.log('Equipment types:', response.data.type);
        } else {
          console.error('Unexpected response format:', response.data);
          setErrors({ general: "Unexpected response format when fetching equipment types." });
        }
      } catch (err) {
        console.error("Error fetching equipment types:", err);
        setErrors({ general: "Failed to fetch equipment types." });
      }
    };

    fetchEquipmentType();
  }, []);

  // Update text/number inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    // Prepare FormData for file upload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('model', formData.model);
    data.append('unit_cost', formData.unit_cost);
    data.append('equipment_type_id', formData.equipment_type_id);

    // Append multiple image files
    for (let i = 0; i < images.length; i++) {
      data.append(`images[${i}]`, images[i]);
    }

    try {
      await apiClient.post('/inventory/equipment', data, {
        // headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Equipment created successfully!');
      // Optionally reset the form
      setFormData({
        name: '',
        model: '',
        unit_cost: '',
        equipment_type_id: '',
      });
      setImages([]);
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add Equipment</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Display a general error if errors is a string or errors.general exists */}
      {typeof errors === 'string' && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors}
        </div>
      )}
      {errors.general && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && <p className="mt-1 text-red-600 text-sm">{errors.name[0]}</p>}
        </div>

        {/* Model Field */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text"
            name="model"
            id="model"
            value={formData.model}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.model && <p className="mt-1 text-red-600 text-sm">{errors.model[0]}</p>}
        </div>

        {/* Unit Cost Field */}
        <div>
          <label htmlFor="unit_cost" className="block text-sm font-medium text-gray-700">
            Unit Cost
          </label>
          <input
            type="number"
            step="0.01"
            name="unit_cost"
            id="unit_cost"
            value={formData.unit_cost}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.unit_cost && <p className="mt-1 text-red-600 text-sm">{errors.unit_cost[0]}</p>}
        </div>

        {/* Equipment Type Field */}
        <div>
          <label htmlFor="equipment_type_id" className="block text-sm font-medium text-gray-700">
            Equipment Type
          </label>
          <select
            name="equipment_type_id"
            id="equipment_type_id"
            value={formData.equipment_type_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an equipment type</option>
            {equipmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.type})
              </option>
            ))}
          </select>
          {errors.equipment_type_id && (
            <p className="mt-1 text-red-600 text-sm">{errors.equipment_type_id[0]}</p>
          )}
        </div>

        {/* Images Field */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            name="images"
            id="images"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
          {errors['images.*'] && (
            <p className="mt-1 text-red-600 text-sm">{errors['images.*'][0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;
