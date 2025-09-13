import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { fetchAllProcurements } from "@/api/axios";
import {
  Download,
  FileText,
  TrendingUp,
  Package,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProcurementReports() {
  const [data, setData] = useState([]);
  const [reportData, setReportData] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAllProcurements();
        setData(result);
      } catch (error) {
        console.error("Error fetching procurements:", error);
      }
    };
    fetchData();
  }, []);

  // Transform and group data by year
  useEffect(() => {
    const groupedData = {};

    data.forEach((procurement) => {
      const procurementDate = new Date(procurement.procurement_date);
      const year = procurementDate.getFullYear().toString();

      if (!groupedData[year]) {
        groupedData[year] = [];
      }

      const procurementItems =
        procurement.procurement_items &&
        procurement.procurement_items.length > 0
          ? procurement.procurement_items
          : []; // Handle procurements with no items

      // If no items, create a single entry for the procurement
      if (procurementItems.length === 0) {
        const transformedItem = {
          date: procurement.procurement_date,
          month: procurementDate.toLocaleString("en-US", { month: "long" }),
          supplier: procurement.supplier?.name || "N/A",
          equipment_name: "No items",
          equipment_type: "N/A",
          description: "No equipment items",
          quantity: 0,
          unit_cost: 0,
          logistics: parseFloat(procurement.logistics) || 0,
          total_cost: parseFloat(procurement.total_cost) || 0,
          status: procurement.status,
          procurementId: procurement.id,
        };
        groupedData[year].push(transformedItem);
      } else {
        // Process each item in the procurement
        procurementItems.forEach((item, index) => {
          const equipmentDetails =
            procurement.equipment.find((eq) => eq.id === item.equipment_id) ||
            {};
          const equipmentTypeDetails = equipmentDetails.equipment_type || {};

          const transformedItem = {
            date: procurement.procurement_date,
            month: procurementDate.toLocaleString("en-US", { month: "long" }),
            supplier: procurement.supplier?.name || "N/A",
            equipment_name: equipmentDetails.name || "N/A",
            equipment_type: equipmentTypeDetails.name || "N/A",
            description: equipmentTypeDetails.description || "N/A",
            quantity: parseFloat(item.quantity) || 0,
            unit_cost: parseFloat(item.unit_cost) || 0,
            logistics: parseFloat(procurement.logistics) || 0,
            total_cost: parseFloat(procurement.total_cost) || 0,
            status: procurement.status,
            procurementId: procurement.id,
            // Add merge range for procurement-level fields
            ...(index === 0 &&
              procurementItems.length > 1 && {
                mergeRange: {
                  start: groupedData[year].length + 6, // 6 for header/title rows
                  end: groupedData[year].length + 5 + procurementItems.length,
                },
              }),
          };

          groupedData[year].push(transformedItem);
        });
      }
    });

    setReportData(groupedData);
  }, [data]);

  // Handle the Excel export logic
  const handleExport = async () => {
    const years = Object.keys(reportData);
    if (years.length === 0) {
      alert("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Inventory Management System";
      workbook.lastModifiedBy = "Inventory Management System";
      workbook.created = new Date();
      workbook.modified = new Date();

      // Sort years in chronological order
      const orderedYears = years.sort((a, b) => parseInt(a) - parseInt(b));

      // Calculate year-over-year comparisons
      const yearlyComparisons = {};
      orderedYears.forEach((year, index) => {
        const yearlyData = reportData[year];
        const uniqueProcurements = yearlyData.reduce((acc, item) => {
          if (!acc[item.procurementId]) {
            acc[item.procurementId] = {
              total_cost: item.total_cost,
              logistics: item.logistics,
            };
          }
          return acc;
        }, {});

        const yearlyTotalCost = Object.values(uniqueProcurements).reduce(
          (sum, proc) => sum + (parseFloat(proc.total_cost) || 0),
          0,
        );
        const yearlyLogisticsTotal = Object.values(uniqueProcurements).reduce(
          (sum, proc) => sum + (parseFloat(proc.logistics) || 0),
          0,
        );
        const yearlyGrandTotal = yearlyTotalCost + yearlyLogisticsTotal;

        yearlyComparisons[year] = {
          totalItems: yearlyData.length,
          totalCost: yearlyTotalCost,
          logisticsTotal: yearlyLogisticsTotal,
          grandTotal: yearlyGrandTotal,
          percentageChange: 0,
        };

        // Calculate percentage change from previous year
        if (index > 0) {
          const previousYear = orderedYears[index - 1];
          const previousTotal = yearlyComparisons[previousYear].grandTotal;
          if (previousTotal > 0) {
            yearlyComparisons[year].percentageChange =
              ((yearlyGrandTotal - previousTotal) / previousTotal) * 100;
          }
        }
      });

      for (const year of orderedYears) {
        const yearlyData = reportData[year];
        const worksheet = workbook.addWorksheet(`Procurement Report ${year}`);

        // Add main company header
        worksheet.mergeCells("A1:K1");
        const companyHeader = worksheet.getCell("A1");
        companyHeader.value = "SYSCODES COMMUNICATIONS LIMITED";
        companyHeader.font = {
          bold: true,
          size: 24,
          color: { argb: "FF1A237E" },
        };
        companyHeader.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(1).height = 40;

        // Add EQUIPMENT PURCHASED subtitle
        worksheet.mergeCells("A2:K2");
        const reportSubHeader = worksheet.getCell("A2");
        reportSubHeader.value = `EQUIPMENT PURCHASED - ${year}`;
        reportSubHeader.font = {
          bold: true,
          size: 16,
          color: { argb: "FF3F51B5" },
        };
        reportSubHeader.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        worksheet.getRow(2).height = 30;

        worksheet.mergeCells("A3:K3");
        const dateRow = worksheet.getCell("A3");
        dateRow.value = `Report generated on: ${new Date().toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )}`;
        dateRow.font = { italic: true, size: 10 };
        dateRow.alignment = { horizontal: "center" };

        worksheet.mergeCells("A4:K4");
        worksheet.getRow(4).height = 5; // Spacer row

        // Sort data by month and date for better organization
        const sortedYearlyData = yearlyData.sort((a, b) => {
          const monthsOrder = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const monthA = monthsOrder.indexOf(a.month);
          const monthB = monthsOrder.indexOf(b.month);

          if (monthA !== monthB) {
            return monthA - monthB;
          }

          // If same month, sort by date
          return new Date(a.date) - new Date(b.date);
        });

        // Define columns with headers
        const columns = [
          { header: "Date", key: "date", width: 15 },
          { header: "Month", key: "month", width: 12 },
          { header: "Supplier", key: "supplier", width: 25 },
          { header: "Equipment Name", key: "equipment_name", width: 25 },
          { header: "Equipment Type", key: "equipment_type", width: 20 },
          { header: "Description", key: "description", width: 40 },
          { header: "Quantity", key: "quantity", width: 12 },
          { header: "Unit Cost", key: "unit_cost", width: 15 },
          { header: "Logistics", key: "logistics", width: 15 },
          { header: "Total Cost", key: "total_cost", width: 18 },
          { header: "Status", key: "status", width: 15 },
        ];
        worksheet.columns = columns;

        // Style header row
        const headerRow = worksheet.getRow(5);
        headerRow.height = 30;

        // Set header values
        columns.forEach((col, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = col.header;
          cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" }, // Blue
          };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "medium", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "medium", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });

        // Add the transformed data rows
        sortedYearlyData.forEach((rowData, index) => {
          const row = worksheet.addRow(rowData);
          row.height = 25;

          // Alternate row colors for better readability
          if (row.number % 2 === 0) {
            row.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF8F9FA" },
              };
            });
          }

          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFDDE2E6" } },
              left: { style: "thin", color: { argb: "FFDDE2E6" } },
              bottom: { style: "thin", color: { argb: "FFDDE2E6" } },
              right: { style: "thin", color: { argb: "FFDDE2E6" } },
            };

            // Format numeric columns (Quantity=7, Unit Cost=8, Total Cost=10)
            if ([7, 8, 10].includes(colNumber)) {
              if (
                cell.value !== null &&
                cell.value !== undefined &&
                cell.value !== "N/A"
              ) {
                const numValue = parseFloat(cell.value);
                if (!isNaN(numValue)) {
                  cell.value = numValue;
                  if (colNumber === 10) {
                    // Total Cost column - format as currency with 2 decimal places
                    cell.numFmt = '"₦"#,##0.00';
                  } else if (colNumber === 8) {
                    // Unit Cost column - format as currency with 2 decimal places
                    cell.numFmt = '"₦"#,##0.00';
                  } else {
                    // Quantity column - format as number with no decimal places
                    cell.numFmt = "#,##0";
                  }
                }
              }
              cell.alignment = { horizontal: "right", vertical: "middle" };
            } else {
              cell.alignment = { vertical: "middle", wrapText: true };
            }

            // Style status column with color coding (column 11)
            if (colNumber === 11 && cell.value) {
              const status = cell.value.toString().toLowerCase();
              if (status === "approved") {
                cell.font = { color: { argb: "FF059669" }, bold: true };
              } else if (status === "pending") {
                cell.font = { color: { argb: "FFD97706" }, bold: true };
              } else if (status === "rejected") {
                cell.font = { color: { argb: "FFDC2626" }, bold: true };
              }
              cell.alignment = { horizontal: "center", vertical: "middle" };
            }

            // Format date column (column 1)
            if (colNumber === 1 && cell.value) {
              try {
                const dateValue = new Date(cell.value);
                if (!isNaN(dateValue.getTime())) {
                  cell.value = dateValue;
                  cell.numFmt = "dd/mm/yyyy";
                  cell.alignment = { horizontal: "center", vertical: "middle" };
                }
              } catch (error) {
                // Keep original value if date parsing fails
              }
            }

            // Format month column (column 2) - center align
            if (colNumber === 2) {
              cell.alignment = { horizontal: "center", vertical: "middle" };
            }

            // Format logistics column (column 9) - currency format
            if (colNumber === 9 && cell.value && cell.value !== "N/A") {
              const numValue = parseFloat(cell.value);
              if (!isNaN(numValue)) {
                cell.value = numValue;
                cell.numFmt = '"₦"#,##0.00';
                cell.alignment = { horizontal: "right", vertical: "middle" };
              }
            }
          });
        });

        // Merge cells where applicable (for procurement-level fields)
        sortedYearlyData.forEach((row, index) => {
          const rowNumber = index + 6;
          if (row.mergeRange) {
            const { start, end } = row.mergeRange;
            // Merge procurement-level fields: Date, Month, Supplier, Logistics, Total Cost, Status
            worksheet.mergeCells(`A${start}:A${end}`);
            worksheet.mergeCells(`B${start}:B${end}`);
            worksheet.mergeCells(`C${start}:C${end}`);
            worksheet.mergeCells(`I${start}:I${end}`); // Logistics column
            worksheet.mergeCells(`J${start}:J${end}`); // Total Cost column
            worksheet.mergeCells(`K${start}:K${end}`); // Status column

            // Center content in merged cells
            ["A", "B", "C", "I", "J", "K"].forEach((col) => {
              const cell = worksheet.getCell(`${col}${start}`);
              cell.alignment = { horizontal: "center", vertical: "middle" };
            });
          }
        });

        // Add monthly summaries within the year
        const monthsInYear = [
          ...new Set(sortedYearlyData.map((item) => item.month)),
        ].sort((a, b) => {
          const monthsOrder = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
        });

        // Add monthly summaries section
        const lastDataRow = worksheet.rowCount;
        let currentRow = lastDataRow + 3;

        // Add section header
        worksheet.mergeCells(`A${currentRow}:K${currentRow}`);
        const monthlySummaryHeader = worksheet.getCell(`A${currentRow}`);
        monthlySummaryHeader.value = `MONTHLY SUMMARY FOR ${year}`;
        monthlySummaryHeader.font = {
          bold: true,
          size: 14,
          color: { argb: "FF1A237E" },
        };
        monthlySummaryHeader.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        worksheet.getRow(currentRow).height = 30;
        currentRow++;

        // Add monthly summary headers
        const monthlyHeaderRow = worksheet.getRow(currentRow);
        monthlyHeaderRow.height = 25;

        const monthlyHeaders = [
          "Month",
          "Items Count",
          "Total Cost",
          "Logistics Total",
          "Grand Total",
          "Month vs Prev",
          "Cumulative Total",
        ];
        monthlyHeaders.forEach((header, index) => {
          const cell = monthlyHeaderRow.getCell(index + 1);
          cell.value = header;
          cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF1A237E" },
          };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "medium", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "medium", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });
        currentRow++;

        // Calculate and add monthly summaries with trend analysis
        let cumulativeTotal = 0;
        let previousMonthTotal = 0;

        monthsInYear.forEach((month, monthIndex) => {
          const monthData = sortedYearlyData.filter(
            (item) => item.month === month,
          );
          const uniqueProcurementsInMonth = monthData.reduce((acc, item) => {
            if (!acc[item.procurementId]) {
              acc[item.procurementId] = {
                total_cost: item.total_cost,
                logistics: item.logistics,
                items_count: 1,
              };
            } else {
              acc[item.procurementId].items_count++;
            }
            return acc;
          }, {});

          const monthItemsCount = monthData.length;
          const monthTotalCost = Object.values(
            uniqueProcurementsInMonth,
          ).reduce((sum, proc) => sum + (parseFloat(proc.total_cost) || 0), 0);
          const monthLogisticsTotal = Object.values(
            uniqueProcurementsInMonth,
          ).reduce((sum, proc) => sum + (parseFloat(proc.logistics) || 0), 0);
          const monthGrandTotal = monthTotalCost + monthLogisticsTotal;

          // Calculate percentage change from previous month
          let percentageChange = 0;
          if (monthIndex > 0 && previousMonthTotal > 0) {
            percentageChange =
              ((monthGrandTotal - previousMonthTotal) / previousMonthTotal) *
              100;
          }

          // Update cumulative total
          cumulativeTotal += monthGrandTotal;

          const monthSummaryRow = worksheet.getRow(currentRow);
          monthSummaryRow.height = 25;

          // Month name
          monthSummaryRow.getCell(1).value = month;
          monthSummaryRow.getCell(1).font = { bold: true };
          monthSummaryRow.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Items count
          monthSummaryRow.getCell(2).value = monthItemsCount;
          monthSummaryRow.getCell(2).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Total cost
          monthSummaryRow.getCell(3).value = monthTotalCost;
          monthSummaryRow.getCell(3).numFmt = '"₦"#,##0.00';
          monthSummaryRow.getCell(3).alignment = {
            horizontal: "right",
            vertical: "middle",
          };

          // Logistics total
          monthSummaryRow.getCell(4).value = monthLogisticsTotal;
          monthSummaryRow.getCell(4).numFmt = '"₦"#,##0.00';
          monthSummaryRow.getCell(4).alignment = {
            horizontal: "right",
            vertical: "middle",
          };

          // Grand total
          monthSummaryRow.getCell(5).value = monthGrandTotal;
          monthSummaryRow.getCell(5).numFmt = '"₦"#,##0.00';
          monthSummaryRow.getCell(5).font = {
            bold: true,
            color: { argb: "FF059669" },
          };
          monthSummaryRow.getCell(5).alignment = {
            horizontal: "right",
            vertical: "middle",
          };

          // Percentage change from previous month
          if (monthIndex === 0) {
            monthSummaryRow.getCell(6).value = "N/A";
            monthSummaryRow.getCell(6).font = {
              italic: true,
              color: { argb: "FF6B7280" },
            };
          } else {
            monthSummaryRow.getCell(6).value = percentageChange;
            monthSummaryRow.getCell(6).numFmt = '0.0"%";0.0"%";"0%"';
            if (percentageChange > 0) {
              monthSummaryRow.getCell(6).font = {
                bold: true,
                color: { argb: "FFDC2626" },
              }; // Red for increase
            } else if (percentageChange < 0) {
              monthSummaryRow.getCell(6).font = {
                bold: true,
                color: { argb: "FF059669" },
              }; // Green for decrease
            } else {
              monthSummaryRow.getCell(6).font = {
                bold: true,
                color: { argb: "FF6B7280" },
              }; // Gray for no change
            }
          }
          monthSummaryRow.getCell(6).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Cumulative total
          monthSummaryRow.getCell(7).value = cumulativeTotal;
          monthSummaryRow.getCell(7).numFmt = '"₦"#,##0.00';
          monthSummaryRow.getCell(7).font = {
            bold: true,
            color: { argb: "FF1A237E" },
          };
          monthSummaryRow.getCell(7).alignment = {
            horizontal: "right",
            vertical: "middle",
          };

          // Add borders to all cells
          for (let col = 1; col <= 7; col++) {
            const cell = monthSummaryRow.getCell(col);
            cell.border = {
              top: { style: "thin", color: { argb: "FFDDE2E6" } },
              left: { style: "thin", color: { argb: "FFDDE2E6" } },
              bottom: { style: "thin", color: { argb: "FFDDE2E6" } },
              right: { style: "thin", color: { argb: "FFDDE2E6" } },
            };
          }

          // Update for next iteration
          previousMonthTotal = monthGrandTotal;
          currentRow++;
        });

        // Add yearly summary row
        const summaryRow = worksheet.getRow(currentRow + 1);

        // Calculate totals for the year (sum unique procurements)
        const uniqueProcurements = yearlyData.reduce((acc, item) => {
          if (!acc[item.procurementId]) {
            acc[item.procurementId] = {
              total_cost: item.total_cost,
              logistics: item.logistics,
            };
          }
          return acc;
        }, {});

        const yearlyTotalCost = Object.values(uniqueProcurements).reduce(
          (sum, proc) => sum + (parseFloat(proc.total_cost) || 0),
          0,
        );

        const yearlyLogisticsTotal = Object.values(uniqueProcurements).reduce(
          (sum, proc) => sum + (parseFloat(proc.logistics) || 0),
          0,
        );

        const yearlyGrandTotal = yearlyTotalCost + yearlyLogisticsTotal;

        // Add yearly summary section
        currentRow += 2;

        // Yearly summary header
        worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
        const yearlySummaryHeader = worksheet.getCell(`A${currentRow}`);
        yearlySummaryHeader.value = `YEARLY SUMMARY FOR ${year}`;
        yearlySummaryHeader.font = {
          bold: true,
          size: 14,
          color: { argb: "FF1A237E" },
        };
        yearlySummaryHeader.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        worksheet.getRow(currentRow).height = 30;
        currentRow++;

        // Use the already calculated totals from analytics section

        // Add yearly summary data
        const yearlySummaryRow = worksheet.getRow(currentRow);
        yearlySummaryRow.height = 25;

        // Total items
        yearlySummaryRow.getCell(1).value = `Total Items:`;
        yearlySummaryRow.getCell(1).font = { bold: true };
        yearlySummaryRow.getCell(2).value = yearlyData.length;
        yearlySummaryRow.getCell(2).font = { bold: true };
        yearlySummaryRow.getCell(2).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        // Total cost
        yearlySummaryRow.getCell(3).value = yearlyTotalCost;
        yearlySummaryRow.getCell(3).numFmt = '"₦"#,##0.00';
        yearlySummaryRow.getCell(3).font = { bold: true };
        yearlySummaryRow.getCell(3).alignment = {
          horizontal: "right",
          vertical: "middle",
        };

        // Logistics total
        yearlySummaryRow.getCell(4).value = yearlyLogisticsTotal;
        yearlySummaryRow.getCell(4).numFmt = '"₦"#,##0.00';
        yearlySummaryRow.getCell(4).font = { bold: true };
        yearlySummaryRow.getCell(4).alignment = {
          horizontal: "right",
          vertical: "middle",
        };

        // Grand total
        yearlySummaryRow.getCell(5).value = yearlyGrandTotal;
        yearlySummaryRow.getCell(5).numFmt = '"₦"#,##0.00';
        yearlySummaryRow.getCell(5).font = {
          bold: true,
          color: { argb: "FF059669" },
          size: 14,
        };
        yearlySummaryRow.getCell(5).alignment = {
          horizontal: "right",
          vertical: "middle",
        };

        // Add borders to yearly summary
        for (let col = 1; col <= 5; col++) {
          const cell = yearlySummaryRow.getCell(col);
          cell.border = {
            top: { style: "medium", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "medium", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        }

        // Freeze panes for easier navigation
        worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 5 }];
      }

      // Add year-over-year comparison worksheet if multiple years
      if (orderedYears.length > 1) {
        const comparisonWorksheet = workbook.addWorksheet(
          "Year-over-Year Comparison",
        );

        // Company header
        comparisonWorksheet.mergeCells("A1:F1");
        const companyHeader = comparisonWorksheet.getCell("A1");
        companyHeader.value = "SYSCODES COMMUNICATIONS LIMITED";
        companyHeader.font = {
          bold: true,
          size: 24,
          color: { argb: "FF1A237E" },
        };
        companyHeader.alignment = { horizontal: "center", vertical: "middle" };
        comparisonWorksheet.getRow(1).height = 40;

        // Report title
        comparisonWorksheet.mergeCells("A2:F2");
        const reportTitle = comparisonWorksheet.getCell("A2");
        reportTitle.value = "YEAR-OVER-YEAR PROCUREMENT COMPARISON";
        reportTitle.font = {
          bold: true,
          size: 16,
          color: { argb: "FF3F51B5" },
        };
        reportTitle.alignment = { horizontal: "center", vertical: "middle" };
        comparisonWorksheet.getRow(2).height = 30;

        // Headers
        const comparisonHeaders = [
          "Year",
          "Total Items",
          "Total Cost",
          "Logistics Total",
          "Grand Total",
          "YoY Change",
        ];
        const headerRow = comparisonWorksheet.getRow(4);
        headerRow.height = 30;

        comparisonHeaders.forEach((header, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = header;
          cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" },
          };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "medium", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "medium", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });

        // Add data rows
        orderedYears.forEach((year, index) => {
          const dataRow = comparisonWorksheet.getRow(index + 5);
          dataRow.height = 25;
          const comparison = yearlyComparisons[year];

          // Year
          dataRow.getCell(1).value = year;
          dataRow.getCell(1).font = { bold: true };
          dataRow.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Total Items
          dataRow.getCell(2).value = comparison.totalItems;
          dataRow.getCell(2).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Total Cost
          dataRow.getCell(3).value = comparison.totalCost;
          dataRow.getCell(3).numFmt = '"₦"#,##0.00';
          dataRow.getCell(3).alignment = {
            horizontal: "right",
            vertical: "middle",
          };

          // Logistics Total
          dataRow.getCell(4).value = comparison.logisticsTotal;
          dataRow.getCell(4).numFmt = '"₦"#,##0.00';
          dataRow.getCell(4).alignment = {
            horizontal: "right",
            vertical: "middle",
          };

          // Grand Total
          dataRow.getCell(5).value = comparison.grandTotal;
          dataRow.getCell(5).numFmt = '"₦"#,##0.00';
          dataRow.getCell(5).font = { bold: true, color: { argb: "FF059669" } };
          dataRow.getCell(5).alignment = {
            horizontal: "right",
            vertical: "middle",
          };

          // YoY Change
          if (index === 0) {
            dataRow.getCell(6).value = "N/A";
            dataRow.getCell(6).font = {
              italic: true,
              color: { argb: "FF6B7280" },
            };
          } else {
            dataRow.getCell(6).value = comparison.percentageChange;
            dataRow.getCell(6).numFmt = '0.0"%";0.0"%";"0%"';
            if (comparison.percentageChange > 0) {
              dataRow.getCell(6).font = {
                bold: true,
                color: { argb: "FFDC2626" },
              };
            } else if (comparison.percentageChange < 0) {
              dataRow.getCell(6).font = {
                bold: true,
                color: { argb: "FF059669" },
              };
            } else {
              dataRow.getCell(6).font = {
                bold: true,
                color: { argb: "FF6B7280" },
              };
            }
          }
          dataRow.getCell(6).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Add borders
          for (let col = 1; col <= 6; col++) {
            const cell = dataRow.getCell(col);
            cell.border = {
              top: { style: "thin", color: { argb: "FFDDE2E6" } },
              left: { style: "thin", color: { argb: "FFDDE2E6" } },
              bottom: { style: "thin", color: { argb: "FFDDE2E6" } },
              right: { style: "thin", color: { argb: "FFDDE2E6" } },
            };
          }
        });

        // Set column widths
        comparisonWorksheet.getColumn(1).width = 12;
        comparisonWorksheet.getColumn(2).width = 15;
        comparisonWorksheet.getColumn(3).width = 18;
        comparisonWorksheet.getColumn(4).width = 18;
        comparisonWorksheet.getColumn(5).width = 20;
        comparisonWorksheet.getColumn(6).width = 15;

        // Freeze panes
        comparisonWorksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 4 }];
      }

      // Export the Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Procurement_Report_By_Year.xlsx`);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("There was an error exporting the Excel file.");
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate totals for display
  const allReportItems = Object.values(reportData).flat();
  const totalItems = allReportItems.length;
  const totalValue = Object.values(reportData).reduce((sum, yearlyItems) => {
    // Sum the total_cost and logistics for each unique procurement in each year
    const uniqueProcurementsInYear = yearlyItems.reduce((acc, item) => {
      if (!acc[item.procurementId]) {
        acc[item.procurementId] = {
          total_cost: item.total_cost,
          logistics: item.logistics,
        };
      }
      return acc;
    }, {});

    const yearlyTotal = Object.values(uniqueProcurementsInYear).reduce(
      (yearlySum, proc) =>
        yearlySum +
        (parseFloat(proc.total_cost) || 0) +
        (parseFloat(proc.logistics) || 0),
      0,
    );
    return sum + yearlyTotal;
  }, 0);

  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-lg rounded-xl h-full">
      <CardHeader className="pb-3 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
              Procurement Reports
            </CardTitle>
            <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
              Export procurement data by year
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
            <Package className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {totalItems}
            </p>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Value</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              ₦{(totalValue / 1000).toFixed(0)}K
            </p>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Years</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {Object.keys(reportData).length}
            </p>
          </div>
        </div>

        {Object.keys(reportData).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Summary:
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.entries(reportData)
                .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB))
                .map(([year, items]) => {
                  const uniqueProcurementsInYear = items.reduce((acc, item) => {
                    if (!acc[item.procurementId]) {
                      acc[item.procurementId] = {
                        total_cost: item.total_cost,
                        logistics: item.logistics,
                      };
                    }
                    return acc;
                  }, {});

                  const yearTotal = Object.values(
                    uniqueProcurementsInYear,
                  ).reduce(
                    (sum, proc) =>
                      sum +
                      (parseFloat(proc.total_cost) || 0) +
                      (parseFloat(proc.logistics) || 0),
                    0,
                  );

                  const monthsInYear = [
                    ...new Set(items.map((item) => item.month)),
                  ].length;

                  return (
                    <div
                      key={year}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-700/30 rounded text-xs"
                    >
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {year}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          ({items.length} items, {monthsInYear} months)
                        </span>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ₦{(yearTotal / 1000).toFixed(0)}K
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <Button
          onClick={handleExport}
          disabled={isExporting || totalItems === 0}
          className="w-full h-9 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-200"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </>
          )}
        </Button>

        {totalItems === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            No data available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
