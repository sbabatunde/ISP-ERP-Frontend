import React, { useState } from "react";
import ExcelJS from "exceljs";
import { format, parseISO } from "date-fns";

const ExcelReport = ({
  data,
  headers,
  reportTitle,
  fileName,
  groupByMonth = false,
  dateField = "Date",
}) => {
  const [loading, setLoading] = useState(false);

  const generateExcel = async () => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    setLoading(true);

    try {
      const workbook = new ExcelJS.Workbook();

      if (groupByMonth) {
        // Group data by year and month
        const grouped = {};

        data.forEach((item) => {
          try {
            const date = parseISO(item[dateField]);
            const year = format(date, "yyyy");
            const month = format(date, "MMMM");

            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][month]) grouped[year][month] = [];

            grouped[year][month].push(item);
          } catch (error) {
            console.warn("Invalid date format for item:", item);
            // If date parsing fails, add to "Unknown" category
            if (!grouped["Unknown"]) grouped["Unknown"] = {};
            if (!grouped["Unknown"]["Unknown"])
              grouped["Unknown"]["Unknown"] = [];
            grouped["Unknown"]["Unknown"].push(item);
          }
        });

        // Create sheets for each year
        Object.entries(grouped).forEach(([year, months]) => {
          const sheet = workbook.addWorksheet(`${year} Data`);

          // Define columns
          sheet.columns = headers.map((h) => ({
            header: h.label,
            key: h.key,
            width: h.width || 15,
          }));

          // Add year title
          const yearTitleRow = sheet.addRow([`${reportTitle} - ${year}`]);
          yearTitleRow.font = { size: 16, bold: true };
          sheet.mergeCells(
            `A${yearTitleRow.number}:${String.fromCharCode(65 + headers.length - 1)}${yearTitleRow.number}`,
          );

          sheet.addRow([]); // spacing

          // Process each month within the year
          const monthNames = Object.keys(months).sort((a, b) => {
            if (a === "Unknown") return 1;
            if (b === "Unknown") return -1;

            const monthOrder = [
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
            return monthOrder.indexOf(a) - monthOrder.indexOf(b);
          });

          monthNames.forEach((month, index) => {
            const monthData = months[month];

            // Add month header
            const monthHeaderRow = sheet.addRow([`${month} ${year}`]);
            monthHeaderRow.font = { size: 14, bold: true };
            sheet.mergeCells(
              `A${monthHeaderRow.number}:${String.fromCharCode(65 + headers.length - 1)}${monthHeaderRow.number}`,
            );

            // Add data rows for this month
            monthData.forEach((item) => {
              const rowData = { ...item };
              // Format numeric columns with Naira symbol
              headers.forEach((header) => {
                if (header.type === "number" && rowData[header.key]) {
                  rowData[header.key] =
                    `₦${Number(rowData[header.key]).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                }
              });
              sheet.addRow(rowData);
            });

            // Calculate and add monthly total for all numeric columns
            const numericHeaders = headers.filter((h) => h.type === "number");
            if (numericHeaders.length > 0) {
              const totalRowData = { [headers[0].key]: `${month} TOTAL` };

              numericHeaders.forEach((numericHeader) => {
                const monthlyTotal = monthData.reduce(
                  (sum, r) => sum + Number(r[numericHeader.key] || 0),
                  0,
                );
                totalRowData[numericHeader.key] =
                  `₦${monthlyTotal.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              });

              const totalRow = sheet.addRow(totalRowData);
              totalRow.font = { bold: true };
              totalRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE6E6FA" }, // Light lavender background
              };
            }

            // Add empty row between months (except after the last month)
            if (index < monthNames.length - 1) {
              sheet.addRow([]);
            }
          });

          // Add overall year total at the end
          const numericHeaders = headers.filter((h) => h.type === "number");
          if (numericHeaders.length > 0) {
            sheet.addRow([]); // spacing

            const yearTotalRowData = {
              [headers[0].key]: `${year} GRAND TOTAL`,
            };

            numericHeaders.forEach((numericHeader) => {
              const yearTotal = Object.values(months)
                .flat()
                .reduce((sum, r) => sum + Number(r[numericHeader.key] || 0), 0);
              yearTotalRowData[numericHeader.key] =
                `₦${yearTotal.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            });

            const yearTotalRow = sheet.addRow(yearTotalRowData);
            yearTotalRow.font = { size: 12, bold: true };
            yearTotalRow.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF98FB98" }, // Pale green background
            };
          }
        });
      } else {
        // Original simple export without grouping
        const sheet = workbook.addWorksheet("Report");

        /* =======================
           DEFINE COLUMNS
        ======================== */
        sheet.columns = headers.map((h) => ({
          header: h.label,
          key: h.key,
          width: h.width || 15,
        }));

        /* =======================
           TITLE ROW
        ======================== */
        const titleRow = sheet.addRow([reportTitle]);
        titleRow.font = { size: 16, bold: true };

        sheet.mergeCells(
          `A${titleRow.number}:${String.fromCharCode(
            65 + headers.length - 1,
          )}${titleRow.number}`,
        );

        sheet.addRow([]); // spacing

        /* =======================
           DATA ROWS
        ======================== */
        data.forEach((item) => {
          const rowData = { ...item };
          // Format numeric columns with Naira symbol
          headers.forEach((header) => {
            if (header.type === "number" && rowData[header.key]) {
              rowData[header.key] =
                `₦${Number(rowData[header.key]).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
          });
          sheet.addRow(rowData);
        });

        /* =======================
           TOTALS (GENERIC)
        ======================== */
        const numericHeaders = headers.filter((h) => h.type === "number");

        if (numericHeaders.length > 0) {
          sheet.addRow([]);

          const totalRowData = { [headers[0].key]: "TOTAL" };

          numericHeaders.forEach((numericHeader) => {
            const total = data.reduce(
              (sum, row) => sum + Number(row[numericHeader.key] || 0),
              0,
            );
            totalRowData[numericHeader.key] =
              `₦${total.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          });

          const totalRow = sheet.addRow(totalRowData);
          totalRow.font = { bold: true };
        }
      }

      /* =======================
         EXPORT FILE
      ======================== */
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${fileName}.xlsx`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel export failed", err);
      alert("Failed to generate Excel file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generateExcel}
      disabled={loading}
      className="px-5 cursor-pointer py-3 bg-green-600 text-white rounded-md disabled:opacity-50"
    >
      {loading ? "Generating..." : "Export Excel"}
    </button>
  );
};

export default ExcelReport;
