import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import {
  ChevronDown,
  ChevronUp,
  Printer,
  Download,
  Share2,
  Edit,
  Trash2,
  ArrowLeft,
  HardDrive,
  Package,
  Truck,
  Info,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProcurementDetails } from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";

const ProcurementDetails = ({ procurements }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchProcurementDetails(id);
        setProcurement(data);
      } catch (error) {
        console.error("Error fetching procurement details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [expandedSections, setExpandedSections] = useState({
    supplier: true,
    items: true,
    equipment: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "PPpp") : "N/A";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-pink-600 dark:text-pink-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!procurement) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 dark:text-white w-4" />
          Back to Procurements
        </Button>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800">
            <CardTitle>Procurement Not Found</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center bg-white dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center py-12">
              <Info className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Procurement #{id} not found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                The procurement you're looking for doesn't exist or may have
                been removed.
              </p>
              <Button
                className="mt-6 bg-pink-600 hover:bg-pink-700 text-white dark:bg-pink-700 dark:hover:bg-pink-800 dark:text-white"
                onClick={() => navigate(-1)}
              >
                Return to Procurements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 text-gray-900 dark:text-white">
        <ArrowLeft className="h-4 w-4 text-gray-900 dark:text-white" />
        Back to Procurements
      </Button>

      <Card className="overflow-hidden shadow-sm bg-white dark:bg-gray-900 border dark:border-gray-800">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                <FileText className="h-6 w-6 text-pink-600" />
                Procurement #{procurement?.id}
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span>Created on {formatDate(procurement?.created_at)}</span>
                <Badge
                  variant="outline"
                  className="border-pink-200 text-pink-600 dark:border-pink-800 dark:text-pink-300"
                >
                  {procurement?.status || "Pending"}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-white dark:bg-gray-900 border dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <Printer className="h-4 w-4 text-gray-900 dark:text-white" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-white dark:bg-gray-900 border dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <Download className="h-4 w-4 text-gray-900 dark:text-white" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-white dark:bg-gray-900 border dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <Share2 className="h-4 w-4 text-gray-900 dark:text-white" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {/* Summary Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="h-5 w-5 text-pink-600" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Procurement Date
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(procurement?.procurement_date)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-5 w-5 text-pink-600" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Logistics Cost
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(parseFloat(procurement?.logistics))}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive className="h-5 w-5 text-pink-600" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Items Count
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {procurement?.procurement_items?.length || 0}
                </p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-100 dark:border-pink-800">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-pink-600" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Cost
                  </h3>
                </div>
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400 text-gray-900 dark:text-gray-100">
                  {formatCurrency(parseFloat(procurement?.total_cost))}
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Section */}
          <div className="p-6">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => toggleSection("supplier")}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Truck className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                Supplier Information
              </h2>
              {expandedSections.supplier ? (
                <ChevronUp className="h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors" />
              )}
            </div>

            {expandedSections.supplier && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Supplier Name
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {procurement?.supplier?.name}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Contact Person
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {procurement?.supplier?.contact_name}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Contact Email
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {procurement?.supplier?.contact_email}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {procurement?.supplier?.contact_phone}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {procurement?.supplier?.address}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Social Media
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {procurement?.supplier?.socials}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div className="p-6">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => toggleSection("items")}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Package className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                Procurement Items ({procurement?.procurement_items?.length || 0}
                )
              </h2>
              {expandedSections.items ? (
                <ChevronUp className="h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors" />
              )}
            </div>

            {expandedSections.items && (
              <div className="mt-4">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-[40%] text-gray-900 dark:text-gray-100">Item</TableHead>
                      <TableHead className="text-right text-gray-900 dark:text-gray-100">Quantity</TableHead>
                      <TableHead className="text-right text-gray-900 dark:text-gray-100">Unit Cost</TableHead>
                      <TableHead className="text-right text-gray-900 dark:text-gray-100">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procurement?.procurement_items?.map((item) => {
                      const matchedEquipment = procurement?.equipment?.find(
                        (eq) => eq.id === item.equipment_id,
                      );
                      console.log(matchedEquipment);
                      return (
                        <TableRow
                          key={item?.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            <div className="flex items-center gap-3">
                              <HardDrive className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                              {item?.equipment?.equipment_type.name ||
                                "Unknown Equipment"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-gray-900 dark:text-gray-100">
                            {item?.quantity} {item?.unit}
                          </TableCell>
                          <TableCell className="text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(parseFloat(item?.unit_cost))}
                          </TableCell>
                          <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(parseFloat(item?.total_cost))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold">
                      <TableCell colSpan={3} className="text-right text-gray-900 dark:text-gray-100">
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(
                          procurement?.procurement_items?.reduce(
                            (sum, item) => sum + parseFloat(item.total_cost),
                            0,
                          ),
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold">
                      <TableCell colSpan={3} className="text-right text-gray-900 dark:text-gray-100">
                        Logistics
                      </TableCell>
                      <TableCell className="text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(parseFloat(procurement?.logistics))}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-pink-50 dark:bg-pink-900/20 font-bold">
                      <TableCell colSpan={3} className="text-right text-gray-900 dark:text-gray-100">
                        Total
                      </TableCell>
                      <TableCell className="text-right text-pink-600 dark:text-pink-400 text-gray-900 dark:text-gray-100">
                        {formatCurrency(parseFloat(procurement?.total_cost))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Equipment Section */}
          <div className="p-6">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => toggleSection("equipment")}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <HardDrive className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                Equipment Details ({procurement?.equipment?.length || 0})
              </h2>
              {expandedSections.equipment ? (
                <ChevronUp className="h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-pink-600 transition-colors" />
              )}
            </div>

            {expandedSections.equipment && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {procurement?.equipment?.map((equip) => (
                  <Card
                    key={equip?.id}
                    className="overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-900 border dark:border-gray-800"
                  >
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 border-b dark:border-gray-800">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-3 text-gray-900 dark:text-gray-100">
                          <HardDrive className="h-5 w-5 text-pink-600" />
                          {equip?.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        >
                          {equip?.model}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-4 bg-white dark:bg-gray-900">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Unit Cost
                        </h3>
                        <p className="text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(equip?.unit_cost))}</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Quantity
                        </h3>
                        <p className="text-gray-900 dark:text-gray-100">
                          {equip.pivot.quantity} {equip.pivot.unit}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Category
                        </h3>
                        <p className="text-gray-900 dark:text-gray-100">{equip?.category || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Manufacturer
                        </h3>
                        <p className="text-gray-900 dark:text-gray-100">{equip?.manufacturer || "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 bg-gray-50 dark:bg-gray-800/30 border-t dark:border-gray-800 p-6">
          <Button
            variant="outline"
            className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
            onClick={() => console.log("Delete procurement", procurement.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            Delete Procurement
          </Button>
          <Button
            className="gap-2 bg-pink-600 hover:bg-pink-700 text-white dark:bg-pink-700 dark:hover:bg-pink-800 dark:text-white"
            onClick={() => navigate(`/procurements/edit/${procurement.id}`)}
          >
            <Edit className="h-4 w-4" />
            Edit Procurement
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProcurementDetails;
