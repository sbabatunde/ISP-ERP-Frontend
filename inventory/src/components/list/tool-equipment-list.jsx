import React, { useState, useEffect } from "react";
import { fetchEquipmentByLocation } from "../../api/axios";
import { Edit, Trash2, Plus, Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tables from "@/layout/tables";

export default function ProductTypeList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch and flatten equipment from locations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchEquipmentByLocation(); // fetch your nested locations data
        const data = Array.isArray(res) ? res : res?.data || [];

        const equipmentItems = data
          .flatMap((location) => location.equipment_items)
          .map((item) => ({
            ...item.equipment,
            location_name:
              item.location?.name || location.location_name || "Unknown",
          }))
          .filter(Boolean);

        setItems(equipmentItems);
        setFilteredItems(equipmentItems);
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter by search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const q = searchTerm.toLowerCase();
    const result = items.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.model?.toLowerCase().includes(q) ||
        item.equipment_type?.type?.toLowerCase().includes(q) ||
        item.location_name?.toLowerCase().includes(q),
    );
    setFilteredItems(result);
  }, [searchTerm, items]);

  // Action items for each row
  const actionItems = [
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => console.log("Edit", row),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => console.log("Delete", row),
      variant: "danger",
    },
  ];

  // Table headers
  const tableHeaders = [
    { key: "name", label: "Equipment Name" },
    { key: "model", label: "Model" },
    { key: "equipment_type.type", label: "Category" }, // nested property
    { key: "location_name", label: "Location" },
    { key: "unit_cost", label: "Unit Cost" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Equipment Inventory</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search equipment..."
            className="border rounded px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => navigate("/equipment-form")}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
      ) : (
        <Tables
          header="Equipment Inventory"
          description="List of all equipment across locations"
          tableHeaders={tableHeaders}
          data={filteredItems}
          actionItems={actionItems}
        />
      )}
    </div>
  );
}
