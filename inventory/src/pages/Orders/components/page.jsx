import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Search,
  Printer,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function Page({ title, orders, loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  function handleDate(date) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  function getStatusBadge(status) {
    const statusMap = {
      pending: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        text: "text-amber-600 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
      },
      approved: {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-600 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
      },
      shipped: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800",
      },
      cancelled: {
        bg: "bg-rose-50 dark:bg-rose-900/20",
        text: "text-rose-600 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
      },
    };
    const statusData = statusMap[status?.toLowerCase()] || {
      bg: "bg-gray-50 dark:bg-gray-800",
      text: "text-gray-600 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-700",
    };
    return `${statusData.bg} ${statusData.text} ${statusData.border}`;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  const filteredOrders = orders.filter(
    (order) =>
      order?.id?.toString().includes(searchTerm) ||
      order?.status?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      order?.total_cost?.toString().includes(searchTerm),
  );

  useEffect(() => {
    setTotal(
      filteredOrders.reduce((acc, order) => acc + Number(order.total_cost), 0),
    );
  }, [filteredOrders]);

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-950 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "order" : "orders"} • Total value:{" "}
            {formatCurrency(total)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-10 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400 focus:border-pink-300 dark:focus:border-pink-600 transition-all duration-200 h-10 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 dark:from-pink-700 dark:to-pink-600 dark:hover:from-pink-800 dark:hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/30 dark:hover:shadow-pink-700/30 flex items-center gap-2 transition-all duration-300 h-10 rounded-lg"
            onClick={() => navigate("/create-order")}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Order</span>
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-900">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider pl-6">
                #
              </TableHead>
              <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                Details
              </TableHead>
              <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-right text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                Amount
              </TableHead>
              <TableHead className="text-right text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow
                    key={index}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    <TableCell className="pl-6 py-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 ml-auto" />
                        <Skeleton className="h-3 w-16 ml-auto" />
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={`border-t border-gray-100 dark:border-gray-800 transition-all duration-150 ${hoveredRow === order.id ? "bg-gray-50 dark:bg-gray-800/30" : "bg-white dark:bg-gray-900"}`}
                  onMouseEnter={() => setHoveredRow(order.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100 py-4 pl-6">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {order.id}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {handleDate(order?.created_at)}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={`${getStatusBadge(order?.status)} px-3 py-1 text-xs font-medium rounded-full border uppercase tracking-wide`}
                    >
                      {order?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-gray-900 dark:text-gray-100 font-medium py-4">
                    <div className="flex flex-col items-end">
                      <span>{formatCurrency(Number(order.total_cost))}</span>
                      {order.items && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() =>
                          navigate(`/procurement-details/${order.id}`)
                        }
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 rounded-full flex items-center justify-center ${hoveredRow === order.id ? "bg-gray-100 dark:bg-gray-800" : "bg-transparent"} transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800`}
                        aria-label="View order details"
                      >
                        <Eye className="h-4 w-4 text-pink-600 dark:text-gray-300" />
                      </Button>
                      {order.status && (
                        <>
                          <div className="relative group">
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                              <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded whitespace-nowrap shadow-md">
                                Requisition
                                <div className="absolute w-2 h-2 bg-gray-800 dark:bg-gray-200 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45"></div>
                              </div>
                            </div>

                            {/* Button with animated hover effect */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`
      h-9 w-9 p-0 rounded-full flex items-center justify-center
      bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
      transition-all duration-300 ease-in-out
      group-hover:scale-110 group-hover:shadow-sm
      relative overflow-hidden cursor-pointer 
    `}
                              aria-label="Print requisition form"
                              onClick={() =>
                                navigate(`/requisition-form/${order.id}`)
                              }
                            >
                              {/* Printer icon with subtle animation */}
                              <Printer className="h-4 w-4 text-pink-600 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110" />

                              {/* Ripple effect */}
                              <span className="absolute inset-0 overflow-hidden">
                                <span className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-300 rounded-full"></span>
                              </span>
                            </Button>
                          </div>
                          <div className="relative group">
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                              <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded whitespace-nowrap shadow-md">
                                Voucher
                                <div className="absolute w-2 h-2 bg-gray-800 dark:bg-gray-200 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45"></div>
                              </div>
                            </div>

                            {/* Button with animated hover effect */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`
      h-9 w-9 p-0 rounded-full flex items-center justify-center
      bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
      transition-all duration-300 ease-in-out
      group-hover:scale-110 group-hover:shadow-sm
      relative overflow-hidden cursor-pointer
    `}
                              aria-label="Print requisition form"
                              onClick={() =>
                                navigate(`/voucher-form/${order.id}`)
                              }
                            >
                              {/* Printer icon with subtle animation */}
                              <Printer className="h-4 w-4 text-pink-600 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110" />

                              {/* Ripple effect */}
                              <span className="absolute inset-0 overflow-hidden">
                                <span className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-300 rounded-full"></span>
                              </span>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative mb-6">
                      <div className="absolute -inset-4 rounded-full bg-gray-100 dark:bg-gray-800/50 opacity-60"></div>
                      <Search className="relative h-12 w-12 text-gray-300 dark:text-gray-700" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No orders found
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
                      {searchTerm
                        ? "No orders match your search criteria. Try adjusting your search term."
                        : "There are currently no orders available. Create a new order to get started."}
                    </p>
                    {!searchTerm && (
                      <Button
                        className="mt-6 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-lg h-10"
                        onClick={() => navigate("/create-order")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Order
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Summary Footer */}
        {filteredOrders.length > 0 && !loading && (
          <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 px-6 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {filteredOrders.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {orders.length}
                </span>{" "}
                orders
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-xs">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Amount:
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
