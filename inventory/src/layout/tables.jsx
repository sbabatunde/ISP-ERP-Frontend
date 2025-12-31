import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Tables({
  header,
  description,
  tableHeaders,
  data = [],
  loading,
  actionItems = [],
}) {
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Helper function to format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "₦0.00";
    return `₦${Number(value).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const filteredData =
    data && data.length > 0
      ? data.filter((row) =>
          tableHeaders.some((header) =>
            String(getNestedValue(row, header.key) ?? "")
              .toLowerCase()
              .includes(search.toLowerCase()),
          ),
        )
      : [];

  // Calculate totals for number and currency columns
  const calculateTotals = () => {
    const totals = {};

    tableHeaders.forEach((header) => {
      if (header.type === "number" || header.type === "currency") {
        const sum = filteredData.reduce((acc, row) => {
          const value = getNestedValue(row, header.key);
          const numValue = parseFloat(value) || 0;
          return acc + numValue;
        }, 0);
        totals[header.key] = sum;
      }
    });

    return totals;
  };

  const totals = calculateTotals();
  const hasTotals = Object.keys(totals).length > 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

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

  const rowVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.005,
      backgroundColor: "rgba(var(--muted), 0.3)",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    tap: { scale: 0.995 },
  };

  const searchVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(var(--primary), 0.1)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full space-y-6"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="flex-1 space-y-3"
        >
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-pink-400 leading-tight"
            >
              {header}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
              className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-primary to-primary/60 rounded-full origin-left"
            />
          </div>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl font-medium"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Search Input with Icon */}
        <motion.div
          variants={searchVariants}
          whileFocus="focus"
          className="relative sm:w-80"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-lg blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          />
          <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search all columns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-20 bg-transparent border-0 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all duration-200 placeholder:text-muted-foreground/70"
            />
            {search && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full"
              >
                {filteredData.length} results
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Table Container */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                {tableHeaders.map((headerData, index) => (
                  <motion.th
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      {headerData.label}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <Filter className="h-3 w-3" />
                      </motion.button>
                    </div>
                  </motion.th>
                ))}
                <motion.th
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + tableHeaders.length * 0.05 }}
                  className="w-[80px] text-center font-semibold text-muted-foreground uppercase text-[11px]"
                >
                  Actions
                </motion.th>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence mode="wait">
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length + 1}
                      className="h-64 text-center"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-3"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Loader2 className="h-8 text-pink-500 w-8 animate-spin" />
                        </motion.div>
                        <p className="text-muted-foreground">Loading data...</p>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((row, rowIndex) => (
                    <motion.tr
                      key={rowIndex}
                      variants={rowVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      whileHover="hover"
                      whileTap="tap"
                      onMouseEnter={() => setSelectedRow(rowIndex)}
                      onMouseLeave={() => setSelectedRow(null)}
                      className={`group border-b border-border transition-colors ${
                        selectedRow === rowIndex ? "bg-muted/20" : ""
                      }`}
                      layout
                    >
                      {tableHeaders.map((header, cellIdx) => (
                        <motion.td
                          key={cellIdx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            delay: rowIndex * 0.05 + cellIdx * 0.02,
                          }}
                          className="px-6 py-4 text-sm font-medium text-foreground/80"
                        >
                          {getNestedValue(row, header.key)}
                        </motion.td>
                      ))}

                      <motion.td
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: rowIndex * 0.05 + tableHeaders.length * 0.02,
                        }}
                        className="text-center"
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:border-border hover:bg-background transition-all mx-auto"
                            >
                              <MoreHorizontal className="cursor-pointer h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </motion.button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            as={motion.div}
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            align="end"
                            className="w-[160px]"
                          >
                            {actionItems.map((action, i) => {
                              const Icon = action.icon?.name;
                              return (
                                <DropdownMenuItem
                                  key={i}
                                  onClick={() => action.onClick(row)}
                                  className={`cursor-pointer ${
                                    action.variant === "danger"
                                      ? "text-destructive focus:text-destructive"
                                      : ""
                                  }`}
                                  asChild
                                >
                                  <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center"
                                  >
                                    {Icon && (
                                      <Icon
                                        className={`mr-2 h-4 w-4 ${action.icon.style}`}
                                      />
                                    )}
                                    <span>{action.label}</span>
                                  </motion.div>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.td>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length + 1}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <Search className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-lg font-medium">No results found</p>
                        {search && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm"
                          >
                            Try adjusting your search
                          </motion.p>
                        )}
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>

            {/* Totals Footer Row */}
            {hasTotals && filteredData.length > 0 && (
              <motion.tfoot
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted/30 border-t-2 border-border"
              >
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="font-semibold text-foreground"
                >
                  {tableHeaders.map((header, cellIdx) => (
                    <motion.td
                      key={`total-${cellIdx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.5 + cellIdx * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="px-6 py-4 text-sm font-bold text-foreground border-t border-border"
                    >
                      {header.type === "number" &&
                      totals[header.key] !== undefined ? (
                        <span className="text-primary">
                          {Number(totals[header.key]).toLocaleString()}
                        </span>
                      ) : header.type === "currency" &&
                        totals[header.key] !== undefined ? (
                        <span className="text-green-600 font-bold">
                          {formatCurrency(totals[header.key])}
                        </span>
                      ) : cellIdx === 0 ? (
                        <span className="text-muted-foreground font-semibold">
                          TOTAL
                        </span>
                      ) : null}
                    </motion.td>
                  ))}
                  {/* Empty cell for actions column */}
                  <motion.td
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.5 + tableHeaders.length * 0.05,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="text-center border-t border-border"
                  ></motion.td>
                </motion.tr>
              </motion.tfoot>
            )}
          </Table>
        </div>
      </motion.div>

      {/* Pagination/Info Footer */}
      {filteredData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between text-sm text-muted-foreground"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredData.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{data.length}</span>{" "}
            entries
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 rounded-md border border-border hover:bg-muted transition-colors"
            >
              Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 rounded-md border border-border hover:bg-muted transition-colors"
            >
              Next
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Tables;
