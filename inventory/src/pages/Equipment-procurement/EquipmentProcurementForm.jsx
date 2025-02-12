import { useEffect, useState } from "react";
import apiClient from "../../api/axios";

export default function EquipmentProcurementForm() {
  const [formData, setFormData] = useState({
    name: "",
    equipment_type_id: "",
    serial_numbers: [],
    status: "in-store",
    logistics: ""
  });
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [serialNumberData, setSerialNumberData] = useState({ serial_number: "", model: "", cost: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchEquipmentTypes = async () => {
      try {
        const response = await apiClient.get("/inventory/equipment-type/list");
        if (response.data && response.data.type) {
          setEquipmentTypes(response.data.type);
        }
      } catch (err) {
        setError("Failed to fetch equipment types.");
      }
    };
    fetchEquipmentTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSerialChange = (e) => {
    setSerialNumberData({ ...serialNumberData, [e.target.name]: e.target.value });
  };

  const addSerialNumber = () => {
    if (serialNumberData.serial_number && serialNumberData.model && serialNumberData.cost) {
      setFormData({
        ...formData,
        serial_numbers: [...formData.serial_numbers, serialNumberData],
      });
      setSerialNumberData({ serial_number: "", model: "", cost: "" });
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await apiClient.post("/equipment/store", formData);
      setSuccess("Equipment added successfully!");
      setFormData({
        name: "",
        equipment_type_id: "",
        serial_numbers: [],
        status: "in-store",
        logistics: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add equipment.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add Equipment</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Equipment Type</label>
            <select name="equipment_type_id" value={formData.equipment_type_id} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-lg">
              <option value="">Select Equipment Type</option>
              {equipmentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Logistics</label>
            <input type="text" name="logistics" value={formData.logistics} onChange={handleChange} className="mt-1 p-2 w-full border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Numbers</label>
            <button type="button" onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white p-2 rounded-lg">Add Equipment Details</button>
            <ul className="mt-2">
              {formData.serial_numbers.map((item, index) => (
                <li key={index} className="text-gray-700">{item.serial_number} - {item.model} - ${item.cost}</li>
              ))}
            </ul>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg">Submit</button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Add Equipment Details</h3>
            <input type="text" name="serial_number" value={serialNumberData.serial_number} onChange={handleSerialChange} placeholder="Serial Number" className="mt-2 p-2 w-full border rounded-lg" />
            <input type="text" name="model" value={serialNumberData.model} onChange={handleSerialChange} placeholder="Model Number" className="mt-2 p-2 w-full border rounded-lg" />
            <input type="number" name="cost" value={serialNumberData.cost} onChange={handleSerialChange} placeholder="Cost" className="mt-2 p-2 w-full border rounded-lg" />
            <div className="flex justify-between mt-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 text-white p-2 rounded-lg">Cancel</button>
              <button onClick={addSerialNumber} className="bg-blue-500 text-white p-2 rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
