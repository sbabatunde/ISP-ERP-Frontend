import React, { useState, useEffect } from "react";
import { fetchEquipmentByLocation } from "../../api/axios";
import { Edit, Trash2, Plus, Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tables from "@/layout/tables";

export default function EquipmentList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchEquipmentByLocation();
        const data = Array.isArray(res) ? res : res?.data || [];

        const equipmentItems = data
          .flatMap((location) => location.equipment_items)
          .map((item) => ({
            ...item.equipment,
            location_name:
              item.location?.name || location.location_name || "Unknown",
          }))
          .filter(Boolean);

        setData(equipmentItems);
        setFilteredItems(equipmentItems);
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
  const Header = [
    { key: "name", label: "Equipment Name" },
    { key: "model", label: "Model" },
    { key: "equipment_type.type", label: "Category" }, // nested property
    { key: "location_name", label: "Location" },
    { key: "unit_cost", label: "Unit Cost", type: "currency" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Tables
          header={"Inventory"}
          description={"Manage the inventory information"}
          data={data}
          tableHeaders={Header}
          loading={loading}
          emptyMessage="No suppliers found"
          actionItems={actionItems}
        />
      </div>
    </div>
  );
}
