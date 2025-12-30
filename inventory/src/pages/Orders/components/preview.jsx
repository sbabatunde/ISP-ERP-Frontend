import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useLocation } from "react-router-dom";

function Preview({ procurement }) {
  const componentRef = useRef();
  const location = useLocation();

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  }
  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    pageStyle: "print",
  });
  const [formItems, setFormItems] = useState(
    Array(6).fill({
      quantity: "",
      description: "",
      unit_cost: "",
      total_cost: "",
    }),
  );
  console.log(formItems);
  const total = formItems.reduce((acc, item) => {
    const totalCost = parseFloat(item.total_cost) || 0;
    return acc + totalCost;
  }, 0);

  function calculateTotalCost(quantity, unit_cost) {
    const qty = parseFloat(quantity) || 0;
    const unit = parseFloat(unit_cost) || 0;
    return qty * unit;
  }
  function updateForm(e, index) {
    const { name, value } = e.target;

    setFormItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      if (name === "quantity" || name === "unit_cost") {
        const qty = name === "quantity" ? value : updated[index].quantity;
        const unit = name === "unit_cost" ? value : updated[index].unit_cost;
        updated[index].total_cost =
          parseFloat(qty || 0) * parseFloat(unit || 0);
      }
      return updated;
    });
  }

  return (
    <>
      <div
        ref={componentRef}
        className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md print:p-2 print:shadow-none print:max-w-full"
      >
        {/* Header Section */}

        <div className="mb-6 border-b pb-4 print:mb-4 print:pb-2">
          <h1 className="text-2xl font-bold text-center text-gray-800 print:text-xl">
            SYSCODES COMMUNICATIONS LIMITED
          </h1>
          <h3 className="text-lg font-semibold text-center text-gray-600 mt-2 print:text-base">
            Requisition Form
          </h3>
        </div>
        {/* Supplier and Delivery Info */}
        <div className="grid grid-cols-2 gap-6 mb-6 print:gap-4 print:mb-4">
          <section className="space-y-4 print:space-y-2">
            <div className="space-y-2">
              <p className="font-medium text-gray-700 text-base print:text-sm">
                Date:{" "}
                <span className="font-normal ml-2">
                  {procurement?.created_at.split("T")[0]}
                </span>
              </p>
            </div>

            <div className="space-y-3 print:space-y-1">
              <h4 className="font-medium text-gray-700 text-base print:text-sm">
                Supplier Details:
              </h4>
              <div className="ml-4 space-y-2 print:space-y-1">
                <p className="text-gray-600 text-sm">
                  Supplier Name:{" "}
                  <span className="ml-2 font-bold">
                    {procurement?.supplier.name}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Supplier Address:{" "}
                  <span className="ml-2 font-bold">
                    {procurement?.supplier.address}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Supplier Phone:{" "}
                  <span className="ml-2 font-bold">
                    {procurement?.supplier.contact_phone}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Supplier Email:{" "}
                  <span className="ml-2 font-bold">
                    {procurement?.supplier.contact_email}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-1">
            <div className="space-y-3 print:space-y-1">
              <p className="font-medium text-gray-700 text-base print:text-sm">
                Delivery Address:
                <input
                  type="text"
                  className="border-b border-gray-300 p-1 text-sm w-full max-w-xs print:max-w-full print:p-0"
                  value={procurement?.delivery_address}
                />
              </p>
              <p className="font-medium text-gray-700 text-base print:text-sm">
                Type of Purchase:
                <input
                  type="text"
                  className="border-b border-gray-300 p-1 text-sm w-full max-w-xs print:max-w-full print:p-0"
                  value={procurement?.equipment_type?.name}
                />
              </p>
            </div>

            <div className="space-y-3 print:space-y-1">
              <h4 className="font-medium text-gray-700 text-base print:text-sm">
                Approvals:
              </h4>
              <div className="ml-4 space-y-2 print:space-y-1">
                <p className="text-gray-600 text-sm">
                  Admin/Acct: <span className="ml-2">________________</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Sales Mgmt: <span className="ml-2">________________</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Client Services:{" "}
                  <span className="ml-2">________________</span>
                </p>
              </div>
            </div>
          </section>
        </div>
        {/* Requisition Details */}
        <div className="mb-6 print:mb-4">
          <p className="font-medium text-gray-700 text-base mb-4 print:text-sm print:mb-2">
            Requisition Dept:
            <input
              type="text"
              className="border-b border-gray-300 p-1 text-sm uppercase w-full max-w-xs print:max-w-full print:p-0"
              value={procurement?.requisition_dept}
            />
          </p>

          <Table className="border print:text-xs">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 w-24">
                  Quantity
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Items Description
                </TableHead>
                <TableHead className="font-semibold text-gray-700 w-32">
                  Unit Price
                </TableHead>
                <TableHead className="font-semibold text-gray-700 w-32">
                  Total Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {location.pathname === "/requisition-form"
                ? [...Array(6).keys()].map((item, index) => (
                    <TableRow className="py-1 print:py-0.5">
                      <TableCell className="font-medium">
                        <input
                          type="text"
                          className="border-b text-center border-gray-300 p-0.5 text-sm w-full max-w-xs print:max-w-full print:p-0.5"
                          name="quantity"
                          onChange={(e) => updateForm(e, index)}
                          value={formItems[index].quantity}
                        />
                      </TableCell>
                      <TableCell className=" overflow-hidden mx-auto">
                        <input
                          type="text"
                          className="border-b border-gray-300 p-0.5 text-sm w-full  print:max-w-full print:p-0.5"
                          name="description"
                          onChange={(e) => updateForm(e, index)}
                          value={formItems[index].description}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          className="border-b border-gray-300 p-0.5 text-sm w-full max-w-xs print:max-w-full print:p-0.5"
                          name="unit_cost"
                          onChange={(e) => updateForm(e, index)}
                          value={formItems[index].unit_cost}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          className="border-b border-gray-300 p-0.5 text-sm w-full max-w-xs print:max-w-full print:p-0.5"
                          name="total_cost"
                          onChange={(e) => updateForm(e, index)}
                          value={formItems[index].total_cost}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : procurement?.procurement_items?.map((item) => {
                    const equipment = procurement?.equipment?.find(
                      (eq) => eq.id === item.equipment_id,
                    );
                    const description = equipment?.equipment_type?.description;
                    return (
                      <TableRow className="py-1 print:py-0.5">
                        <TableCell className="font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="max-w-[200px] overflow-hidden mx-auto">
                          {description}
                        </TableCell>
                        <TableCell>{formatCurrency(item.unit_cost)}</TableCell>
                        <TableCell>{formatCurrency(item.total_cost)}</TableCell>
                      </TableRow>
                    );
                  })}
              <TableRow className="bg-gray-50">
                <TableCell
                  colSpan={3}
                  className="text-right font-semibold py-1 print:py-0.5"
                >
                  Total:
                </TableCell>
                <TableCell
                  className={`font-semibold ${total === 0 ? "print: hidden" : ""}`}
                >
                  {location.pathname === "/requisition-form"
                    ? formatCurrency(total)
                    : formatCurrency(procurement?.total_cost)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-4 print:mt-2">
            <table className="w-full border-t border-gray-200 print:text-xs">
              {[
                "Requested by",
                "Procured by",
                "Vetted by (Acct/Admin)",
                "Approved by (Management)",
                "Received by",
              ].map((label) => (
                <tr key={label} className="border-b border-gray-200">
                  <td className="w-1/3 py-1 print:py-0.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700">{label}:</span>
                      <span className="mt-1 h-8 print:h-6 border-b border-gray-400">
                        Signature
                      </span>
                    </div>
                  </td>
                  <td className="w-1/3 py-1 print:py-0.5">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Name</span>
                      <span className="mt-1 h-8 print:h-6 border-b border-gray-400"></span>
                    </div>
                  </td>
                  <td className="w-1/3 py-1 print:py-0.5">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Date</span>
                      <span className="mt-1 h-8 print:h-6 border-b border-gray-400"></span>
                    </div>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 flex justify-end text-sm text-gray-500 print:mt-4 print:pt-2 print:text-xs">
        <button
          onClick={reactToPrintFn}
          className="bg-pink-500 hover:bg-pink-600 cursor-pointer text-white px-4 py-2 rounded-md"
        >
          Print
        </button>
      </div>
    </>
  );
}

export default Preview;
