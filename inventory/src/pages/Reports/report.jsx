import React, { useEffect, useState } from "react";
import ExcelReport from "./components/reports";
import {
  fetchVendorReports,
  fetchProcurementReports,
  fetchMovementReports,
  fetchRepairReports,
} from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Download,
  Truck,
  FileSpreadsheet,
  Users,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ComponentHeader from "@/layout/componentHeader";

function ReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [movement, setMovement] = useState([]);
  const [procurement, setProcurement] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [repair, setRepair] = useState([]);
  console.log(repair);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [movementData, procurementData, vendorData, reportData] =
        await Promise.all([
          fetchMovementReports(),
          fetchProcurementReports(),
          fetchVendorReports(),
          fetchRepairReports(),
        ]);

      setMovement(movementData);
      setProcurement(procurementData);
      setVendor(vendorData);
      setRepair(reportData);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const movementHeaders = [
    { label: "Date", key: "Date", width: 15 },
    { label: "Equipment Name", key: "Equipment_Name", width: 25 },
    { label: "Qty", key: "Equipment_Count", width: 10 },
    { label: "From Location", key: "From_Location", width: 20 },
    { label: "To Location", key: "To_Location", width: 20 },
    {
      label: "Logistics Cost",
      key: "Logistics_Cost",
      width: 18,
      type: "number",
    },
    { label: "Moved By", key: "Moved_By", width: 20 },
    { label: "Handled By", key: "Handled_By", width: 20 },
  ];

  const procurementHeaders = [
    { label: "Procurement Date", key: "procurement_date", width: 15 },
    { label: "Supplier Name", key: "supplier_name", width: 20 },
    { label: "Equipment Name", key: "equipment_name", width: 25 },
    { label: "Equipment Type", key: "equipment_type", width: 15 },
    { label: "Quantity", key: "quantity", width: 10 },
    { label: "Unit Price", key: "unit_cost", width: 20, type: "number" },
    {
      label: "Logistics Allocated",
      key: "logistics_allocated",
      width: 20,
      type: "number",
    },
    {
      label: "Total Cost",
      key: "procurement_total",
      width: 15,
      type: "number",
    },
  ];

  const vendorHeaders = [
    { label: "Supplier Name", key: "supplier_name", width: 20 },
    { label: "Contact Name", key: "contact_name", width: 20 },
    { label: "Contact Email", key: "contact_email", width: 25 },
    { label: "Contact Phone", key: "contact_phone", width: 15 },
    { label: "Address", key: "address", width: 30 },
  ];

  const repairHeaders = [
    { label: "Date", key: "Date", width: 15 },
    { label: "Equipment Name", key: "Equipment_Name", width: 25 },
    { label: "Equipment Type", key: "Equipment_Type", width: 15 },
    { label: "Provider", key: "Provider", width: 20 },
    { label: "Repair Cost", key: "Repair_Cost", width: 15, type: "number" },
    { label: "Description", key: "Description", width: 30 },
    {
      label: "Days Since Repair",
      key: "Days_Since_Repair",
      width: 15,
      type: "number",
    },
  ];
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="mt-2 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}

      <ComponentHeader
        header={"Reports Dashboard"}
        description={"  Generate and download comprehensive inventory reports"}
      />

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Movement Report */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>Movement Report</CardTitle>
              </div>
              <Badge variant="outline">{movement.length} records</Badge>
            </div>
            <CardDescription>
              Equipment transfers between locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Track equipment movements with cost analysis
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>Excel format with monthly grouping</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>Includes cost calculations</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <ExcelReport
              data={movement}
              headers={movementHeaders}
              reportTitle="Equipment Movement Report"
              fileName={`equipment-movement-${new Date().getFullYear()}`}
              groupByMonth={true}
              dateField="Date"
              className="w-full"
            />
          </CardFooter>
        </Card>

        {/* Procurement Report */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Procurement Report</CardTitle>
              </div>
              <Badge variant="outline">{procurement.length} records</Badge>
            </div>
            <CardDescription>
              Purchase orders and supplier details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Analyze procurement activities and spending
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>Excel format with supplier data</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>Includes pricing details</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <ExcelReport
              data={procurement}
              headers={procurementHeaders}
              reportTitle="Procurement Activities Report"
              fileName={`procurement-report-${new Date().getFullYear()}`}
              groupByMonth={true}
              dateField="procurement_date"
              className="w-full"
            />
          </CardFooter>
        </Card>

        {/* Vendor Report */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>Vendor Report</CardTitle>
              </div>
              <Badge variant="outline">{vendor.length} records</Badge>
            </div>
            <CardDescription>
              Vendor information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Complete vendor directory with contact information
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>Excel format with all vendor details</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>Contact information included</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <ExcelReport
              data={vendor}
              headers={vendorHeaders}
              reportTitle="Vendor Directory Report"
              fileName={`vendor-report-${new Date().getFullYear()}`}
              groupByMonth={false}
              className="w-full"
            />
          </CardFooter>
        </Card>

        {/* Repair Report */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle>Repair Report</CardTitle>
              </div>
              <Badge variant="outline">{repair.length} records</Badge>
            </div>
            <CardDescription>
              Equipment repair history and costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Track equipment repairs, costs, and maintenance history
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>Excel format with repair details</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>Includes cost tracking</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <ExcelReport
              data={repair}
              headers={repairHeaders}
              reportTitle="Equipment Repair Report"
              fileName={`repair-report-${new Date().getFullYear()}`}
              groupByMonth={true}
              dateField="Date"
              className="w-full"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ReportsDashboard;
