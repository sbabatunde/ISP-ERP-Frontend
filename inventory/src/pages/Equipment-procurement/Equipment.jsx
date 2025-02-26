import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../api/axios';

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

  // Animation variants for the container and form elements
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchEquipmentType = async () => {
      try {
        const response = await apiClient.get('/inventory/equipment-type/list');
        if (response.data && response.data.type) {
          setEquipmentTypes(response.data.type);
          console.log('Equipment types:', response.data.type);
        } else {
          console.error('Unexpected response format:', response.data);
          setErrors({ general: 'Unexpected response format when fetching equipment types.' });
        }
      } catch (err) {
        console.error('Error fetching equipment types:', err);
        setErrors({ general: 'Failed to fetch equipment types.' });
      }
    };

    fetchEquipmentType();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('model', formData.model);
    data.append('unit_cost', formData.unit_cost);
    data.append('equipment_type_id', formData.equipment_type_id);

    for (let i = 0; i < images.length; i++) {
      data.append(`images[${i}]`, images[i]);
    }

    try {
      await apiClient.post('/inventory/equipment', data);
      setSuccess('Equipment created successfully!');
      setFormData({ name: '', model: '', unit_cost: '', equipment_type_id: '' });
      setImages([]);
    } catch (error) {
      console.error('Submission error:', error.response?.data);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-500 p-4"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-2xl rounded-lg p-8 max-w-3xl w-full"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Add Equipment
        </h1>

        {success && (
          <motion.div
            variants={itemVariants}
            className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
          >
            {success}
          </motion.div>
        )}

        {(typeof errors === 'string' || errors.general) && (
          <motion.div
            variants={itemVariants}
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            {typeof errors === 'string' ? errors : errors.general}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-red-600 text-sm">{errors.name[0]}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              name="model"
              id="model"
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.model && (
              <p className="mt-1 text-red-600 text-sm">{errors.model[0]}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.unit_cost && (
              <p className="mt-1 text-red-600 text-sm">{errors.unit_cost[0]}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="equipment_type_id" className="block text-sm font-medium text-gray-700">
              Equipment Type
            </label>
            <select
              name="equipment_type_id"
              id="equipment_type_id"
              value={formData.equipment_type_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <input
              type="file"
              name="images"
              id="images"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-gray-600"
            />
            {errors['images.*'] && (
              <p className="mt-1 text-red-600 text-sm">{errors['images.*'][0]}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Submit
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EquipmentForm;
