import { useEffect, useState } from "react";
import apiClient from "../../api/axios";

export default function EquipmentProcurementForm() {
  const [formData, setFormData] = useState({
    name: "",
    equipment_type_id: "",
    serial_number: "",
    model: "",
    cost: "",
    status: "in-store",
  });
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchEquipmentTypes = async () => {
      try {
        const response = await apiClient.get("/inventory/equipment-type/list");
        if (response.data && response.data.type) {
          setEquipmentTypes(response.data.type);
          console.log("Fetched Equipment Types:", response.data.type);
        } else {
          console.warn("No equipment types found.");
        }
      } catch (err) {
        console.error("Error fetching equipment types:", err);
        setError("Failed to fetch equipment types.");
      }
    };

    fetchEquipmentTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.post("/equipment/store", formData);
      console.log("Response:", response.data);
      setSuccess("Equipment added successfully!");
      setFormData({
        name: "",
        equipment_type_id: "",
        serial_number: "",
        model: "",
        cost: "",
        status: "in-store",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
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
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Equipment Name"
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Equipment Type</label>
            <select
              name="equipment_type_id"
              value={formData.equipment_type_id}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            >
              <option value="">Select Equipment Type</option>
              {equipmentTypes.length > 0 ? (
                equipmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {`${type.id} - ${type.name}`}
                  </option>
                ))
              ) : (
                <option disabled>Loading equipment types...</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="Enter Serial Number"
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Enter Equipment Model"
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Enter Cost of Equipment"
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            >
              <option value="in-store">In-Store</option>
              <option value="installed">Installed</option>
              <option value="swapped">Swapped</option>
              <option value="retrieved">Retrieved</option>
              <option value="damaged">Damaged</option>
              <option value="missing">Missing</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
