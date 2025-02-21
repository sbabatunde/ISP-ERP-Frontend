import { useEffect, useState } from "react";
import apiClient from "../../api/axios";

export default function EquipmentProcurementForm() {
  const [formData, setFormData] = useState({
    supplier_id: "",
    procurement_date: "",
    logistics: "",
    total_cost: 0,
    equipment: [],
  });

  const [serialNumberData, setSerialNumberData] = useState({
    id: "",
    serial_numbers: [],
    model_number: "",
    unit_cost: "",
    total_cost_equipment: "",
    quantity: "",
    unit: "",
    current_serial_number: "",
  });

  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEquipmentTypes = async () => {
      try {
        const response = await apiClient.get("/inventory/equipment-type/list");
        if (response.data && response.data.type) {
          setEquipmentTypes(response.data.type);
          console.log(response.data)
        }
      } catch (err) {
        setError("Failed to fetch equipment types.");
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await apiClient.get("/inventory/suppliers/list");
        const data = response.data?.data || [];
        setSuppliers(data);
      } catch (err) {
        setError("Failed to fetch suppliers.");
      }
    };

    fetchEquipmentTypes();
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSerialChange = (e) => {
    setSerialNumberData({ ...serialNumberData, [e.target.name]: e.target.value });
  };

  const addSerialNumber = () => {
    if (serialNumberData.current_serial_number) {
      setSerialNumberData({
        ...serialNumberData,
        serial_numbers: [
          ...serialNumberData.serial_numbers,
          serialNumberData.current_serial_number,
        ],
        current_serial_number: "",
      });
    }
  };

  const addEquipment = () => {
    // Validate required fields
    if (
      serialNumberData.id &&
      serialNumberData.serial_numbers.length > 0 &&
      serialNumberData.model_number &&
      serialNumberData.unit_cost &&
      serialNumberData.total_cost_equipment &&
      serialNumberData.quantity &&
      serialNumberData.unit
    ) {
      const newEquipment = { ...serialNumberData };
      const updatedEquipment = [...formData.equipment, newEquipment];
      // Calculate the new total cost by summing the unit_cost of each equipment (convert to number)
      const newTotalCost = updatedEquipment.reduce(
        (sum, equipment) => sum + Number(equipment.unit_cost),
        0
      );
      setFormData({
        ...formData,
        equipment: updatedEquipment,
        total_cost: newTotalCost,
      });
      setSerialNumberData({
        id: "",
        serial_numbers: [],
        model_number: "",
        unit_cost: "",
        total_cost_equipment: "",
        quantity: "",
        unit: "",
        current_serial_number: "",
      });
      setIsModalOpen(false);
    } else {
      setError("Please fill in all equipment details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await apiClient.post("/inventory/procurements/", formData);
      setSuccess("Equipment added successfully!");
      setFormData({
        supplier_id: "",
        procurement_date: "",
        logistics: "",
        total_cost: 0,
        equipment: [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add equipment.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Procurement
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700">Supplier</label>
            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Procurement Date</label>
              <input
                type="date"
                name="procurement_date"
                value={formData.procurement_date}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Logistics</label>
              <input
                type="text"
                name="logistics"
                value={formData.logistics}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Total Cost</label>
              <input
                type="number"
                name="total_cost"
                value={formData.total_cost}
                readOnly
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700">Equipment</label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Add Equipment Details
            </button>
            <ul className="list-disc pl-5">
              {formData.equipment.map((item, index) => (
                <li key={index}>
                  {item.model_number} - {item.serial_numbers.join(", ")} - $
                  {item.unit_cost}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Equipment Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">
                  Equipment Type
                </label>
                <select
                  name="id"
                  value={serialNumberData.id}
                  onChange={handleSerialChange}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  <option value="">Select Equipment Type</option>
                  {equipmentTypes.map((eqType) => (
                    <option key={eqType.id} value={eqType.id}>
                      {eqType.name} ({eqType.type})
                    </option>
                  ))}
                </select>
              </div>
              {["model_number", "unit_cost", "total_cost_equipment", "quantity", "unit"].map(
                (field) => (
                  <input
                    key={field}
                    type={
                      field.includes("cost") || field === "quantity"
                        ? "number"
                        : "text"
                    }
                    name={field}
                    value={serialNumberData[field]}
                    onChange={handleSerialChange}
                    placeholder={field.replace(/_/g, " ").toUpperCase()}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                )
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="current_serial_number"
                  value={serialNumberData.current_serial_number}
                  onChange={handleSerialChange}
                  placeholder="SERIAL NUMBER"
                  className="w-full border rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={addSerialNumber}
                  className="bg-green-500 text-white p-2 rounded-lg"
                >
                  Add Serial
                </button>
              </div>
              <ul className="list-disc pl-5">
                {serialNumberData.serial_numbers.map((sn, index) => (
                  <li key={index}>{sn}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white p-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addEquipment}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Add Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
