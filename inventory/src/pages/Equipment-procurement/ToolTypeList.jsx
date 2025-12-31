// import React from "react";
// import ProductTypeList from "@/components/list/tool-equipment-list";
// function ToolList() {
//   return (
//     <>
//       <ProductTypeList type="tool" />
//     </>
//   );
// }

// export default ToolList;

import React from "react";
import Tables from "@/layout/tables";
import { useState, useEffect } from "react";
import { fetchToolTypes } from "../../api/axios";
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

function ToolList() {
  const [data, setData] = useState([]);
  console.log(data);
  const [loading, setLoading] = useState(false);
  async function getSuppliers() {
    try {
      setLoading(true);
      const res = await fetchToolTypes();
      setData(res);
      console.log(res);
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
      key: "tool_items_count",
      label: "Quantity in store",
      sortable: false,
      type: "number",
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
          header={"Tool List"}
          description={"Manage invetory Tools and information"}
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

export default ToolList;
