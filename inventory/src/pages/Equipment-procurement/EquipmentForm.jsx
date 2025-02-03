import React, { useState } from "react";

const equipmentTypes = [
  { id: 1, name: "Excavator", description: "Heavy-duty digging equipment" },
  { id: 2, name: "Bulldozer", description: "Used for pushing material" },
  { id: 3, name: "Crane", description: "Lifting and moving heavy loads" },
];

const EquipmentTypeForm = () => {
const [formData, setFormData] = useState({
    equipmentTypeId: "",
    name: "",
    description: "",
    model: "",
    unit: "",
    image: null,
    status: "Available",
});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    let newErrors = {};

    if (!formData.equipmentTypeId) newErrors.equipmentTypeId = "Equipment type is required.";
    if (!formData.model) newErrors.model = "Model is required.";
    if (!formData.purchaseDate) newErrors.purchaseDate = "Purchase date is required.";
    if (!formData.cost || isNaN(formData.cost) || Number(formData.cost) <= 0) newErrors.cost = "Valid cost is required.";
    if (!formData.status) newErrors.status = "Status is required.";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("equipment_type_id", formData.equipmentTypeId);
    formDataObj.append("description", formData.description)
    formDataObj.append("model", formData.model);
    formDataObj.append("purchase_date", formData.purchaseDate);
    formDataObj.append("unit", formData.unit);
    formDataObj.append("cost", formData.cost);
    formDataObj.append("status", formData.status);
    if (formData.image) {
      formDataObj.append("image", formData.image);
    }

    try {
      const response = await fetch("inventory/equipment-type/store", {
        method: "POST",
        body: formDataObj,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit form");
      }

      setSuccess("Equipment added successfully!");
      setFormData({
        equipmentTypeId: "",
        description: "",
        model: "",
        purchaseDate: "",
        unit: "",
        image: null,
        cost: "",
        status: "Available",
      });
    } catch (error) {
      setErrors({ api: error.message });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Add Equipment</h2>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {errors.api && <p className="text-red-500 mb-4">{errors.api}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
            <label className="block text-gray-700">Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
            />
            {/* {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>} */}
        </div>
        {/* Equipment Type Dropdown */}
        <div>
          <label className="block text-gray-700">Equipment Type</label>
          <select
            name="equipmentTypeId"
            value={formData.equipmentTypeId}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Equipment Type</option>
            {equipmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.description}
              </option>
            ))}
          </select>
          {errors.equipmentTypeId && <p className="text-red-500 text-sm">{errors.equipmentTypeId}</p>}
        </div>

        {/* description */}
        <div>
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2"
          />
          {/* {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>} */}
        </div>

        {/* Model */}
        <div>
          <label className="block text-gray-700">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
        </div>

        {/* Purchase Date */}
        <div>
          <label className="block text-gray-700">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.purchaseDate && <p className="text-red-500 text-sm">{errors.purchaseDate}</p>}
        </div>

        {/* Unit */}
        <div>
          <label className="block text-gray-700">Unit (Optional)</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2"
            placeholder="e.g., meters, liters"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700">Equipment Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="w-full border rounded-lg p-2" />
        </div>

        {/* Cost */}
        <div>
          <label className="block text-gray-700">Cost ($)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2"
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700">Status</label>
          <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-lg p-2">
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Equipment"}
        </button>
      </form>
    </div>
  );
};

export default EquipmentTypeForm;
