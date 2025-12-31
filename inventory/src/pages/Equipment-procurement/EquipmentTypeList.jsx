import Tables from "@/layout/tables";
import { useState, useEffect } from "react";
import { MdReadMore } from "react-icons/md";
import { Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchEquipmentTypes } from "@/api/axios";
function EquipmentTypeList() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  async function getEquipmentTypes() {
    try {
      setLoading(true);
      const res = await fetchEquipmentTypes();
      console.log(res);
      setData(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getEquipmentTypes();
  }, []);
  const Header = [
    {
      key: "name",
      label: "Name",
      sortable: false,
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
    },
    {
      key: "type",
      label: "Type",
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
      label: "Edit",
      icon: { name: Edit, style: "text-yellow-500" },
      onClick: (row) => console.log("Edit", row),
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
          header={"Equipment Types"}
          description={"Manage all equipment types in your inventory"}
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

export default EquipmentTypeList;
