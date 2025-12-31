import React from "react";
import Tables from "@/layout/tables";
import { useState, useEffect } from "react";
import { fetchEquipmentMovementList } from "../../api/axios";
import { MdReadMore } from "react-icons/md";
import { Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
function EquipmentMovementList() {
  const [repairs, setRepairs] = useState([]);
  console.log(repairs);
  const [loading, setLoading] = useState(false);
  async function getSuppliers() {
    try {
      setLoading(true);
      const res = await fetchEquipmentMovementList();
      //   const data = Array.isArray(res) ? res : (res?.data ?? []);
      setRepairs(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getSuppliers();
  }, []);

  const Header = [
    {
      key: "equipments_string",
      label: "Equipments",
      sortable: false,
    },
    {
      key: "from_location.name",
      label: "From Location",
      sortable: false,
    },
    {
      key: "to_location.name",
      label: "To Loaction",
      sortable: false,
    },
    {
      key: "from_location.type",
      label: "Currently with",
      sortable: false,
    },
    {
      key: "logistics_cost",
      label: "Logistic Cost",
      sortable: false,
      type: "currency",
    },
  ];
  const actionItems = [
    {
      label: "View",
      icon: { name: MdReadMore, style: "text-green-500" },
      onClick: (row) => console.log("View", row),
    },

    {
      label: "Delete",
      icon: { name: MdDelete, style: "text-red-500" },
      onClick: (row) => console.log("Delete", row),
      variant: "danger",
    },
  ];
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Tables
          header={"Movement History"}
          description={"Manage Inventory movements information"}
          data={repairs}
          tableHeaders={Header}
          loading={loading}
          emptyMessage="No suppliers found"
          actionItems={actionItems}
        />
      </div>
    </div>
  );
}

export default EquipmentMovementList;
