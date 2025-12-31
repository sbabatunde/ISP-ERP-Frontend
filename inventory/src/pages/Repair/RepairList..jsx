import React from "react";
import Tables from "@/layout/tables";
import { useState, useEffect } from "react";
import { fetchRepairList } from "../../api/axios";
import { MdReadMore } from "react-icons/md";
import { Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
function RepairList() {
  const [repairs, setRepairs] = useState([]);
  console.log(repairs);
  const [loading, setLoading] = useState(false);
  async function getSuppliers() {
    try {
      setLoading(true);
      const res = await fetchRepairList();
      const data = Array.isArray(res) ? res : (res?.data ?? []);
      setRepairs(data.data.data);
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
      key: "equipment.name",
      label: "Name",
      sortable: false,
    },
    {
      key: "equipment.model",
      label: "Model",
      sortable: false,
    },
    {
      key: "repair_date",
      label: "Repair Date",
      sortable: false,
    },
    {
      key: "repair_description",
      label: "Repair Description",
      sortable: false,
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
          header={"Repair List"}
          description={"Manage all repairs and information"}
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

export default RepairList;
