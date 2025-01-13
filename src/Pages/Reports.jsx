import { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import axiosInstance from "../services/axiosInstance";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Reports = () => {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    setData([]);
    const fetchCustomers = async () => {
      const response = await axiosInstance.get("/customers");
      if (response.status == 200) {
        setCustomers(response.data.customers);
      }
    };
    fetchCustomers();
  }, [reportType]);

  const fetchReport = async () => {
    try {
      const response = await axiosInstance.get(
        `/reports/${reportType}?startDate=${startDate}&endDate=${endDate}&customerName=${selectedCustomer}`
      );
      console.log(response.data[reportType]);
      setData(response.data[reportType]);
    } catch (error) {
      console.error("Error Occurred:", error);
      alert("Failed to fetch the report. Please try again.");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const reportTitle =
      reportType === "customerLedger"
        ? `Customer Ledger - ${selectedCustomer}`
        : "Sales Report";

    if (reportType === "sales") {
      doc.text(reportTitle, 14, 10);
      const rows = data.flatMap((sale, index) =>
        sale.items.map((item, itemIndex) => [
          itemIndex === 0 ? index + 1 : "",
          itemIndex === 0 ? new Date(sale.date).toLocaleDateString("in") : "",
          itemIndex === 0 ? sale.customer.name : "",
          item.item.name,
          item.quantity,
          `INR ${item.price.toFixed(2)}`,
          `INR ${(item.quantity * item.price).toFixed(2)}`,
          itemIndex === 0 ? `INR ${sale.total.toFixed(2)}` : "",
        ])
      );
      doc.autoTable({
        head: [
          [
            "Sr. No.",
            "Date",
            "Customer",
            "Item Name",
            "Quantity",
            "Price",
            "Subtotal",
            "Total",
          ],
        ],
        body: rows,
      });
    }

    if (reportType === "customerLedger") {
      doc.text(reportTitle, 14, 10);
      const rows = data.flatMap((entry, index) =>
        entry.items.map((item, itemIndex) => [
          itemIndex === 0 ? index + 1 : "",
          itemIndex === 0 ? new Date(entry.date).toLocaleDateString("in") : "",
          item.item.name,
          item.quantity,
          `INR ${item.price.toFixed(2)}`,
          `INR ${(item.quantity * item.price).toFixed(2)}`,
          itemIndex === 0 ? `INR ${entry.total.toFixed(2)}` : "",
        ])
      );
      doc.autoTable({
        head: [
          [
            "Sr. No.",
            "Date",
            "Item Name",
            "Quantity",
            "Price",
            "Subtotal",
            "Total",
          ],
        ],
        body: rows,
      });
    }

    doc.save(`${reportType}-report.pdf`);
  };

  const exportToExcel = () => {
    const headers =
      reportType === "sales"
        ? [
            "Sr. No.",
            "Date",
            "Customer",
            "Item Name",
            "Quantity",
            "Price",
            "Subtotal",
            "Total",
          ]
        : [
            "Sr. No.",
            "Date",
            "Item Name",
            "Quantity",
            "Price",
            "Subtotal",
            "Total",
          ];

    const rows =
      reportType === "sales"
        ? data.flatMap((sale, index) =>
            sale.items.map((item, itemIndex) => [
              itemIndex === 0 ? index + 1 : "",
              itemIndex === 0
                ? new Date(sale.date).toLocaleDateString("in")
                : "",
              itemIndex === 0 ? sale.customer.name : "",
              item.item.name,
              item.quantity,
              item.price.toFixed(2),
              (item.quantity * item.price).toFixed(2),
              itemIndex === 0 ? sale.total.toFixed(2) : "",
            ])
          )
        : data.flatMap((entry, index) =>
            entry.items.map((item, itemIndex) => [
              itemIndex === 0 ? index + 1 : "",
              itemIndex === 0
                ? new Date(entry.date).toLocaleDateString("in")
                : "",
              item.item.name,
              item.quantity,
              item.price.toFixed(2),
              (item.quantity * item.price).toFixed(2),
              itemIndex === 0 ? entry.total.toFixed(2) : "",
            ])
          );

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}-report.xlsx`);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        {data.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={exportToPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded inline-flex items-center justify-center min-w-[100px] transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-flex items-center justify-center min-w-[100px] transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 border rounded mr-2"
          >
            <option value="sales">Sales Report</option>
            <option value="customerLedger">Customer Ledger</option>
          </select>

          {reportType === "sales" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded mr-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded mr-2"
              />
            </>
          )}

          {reportType === "customerLedger" && (
            <div>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="p-2 border rounded mr-2"
              >
                <option value="" disabled>
                  -- Select a Customer --
                </option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={fetchReport}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={
              (reportType === "sales" && (!startDate || !endDate)) ||
              (reportType === "customerLedger" && !selectedCustomer)
            }
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {reportType === "sales" && data.length > 0 && (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Sr. No.</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Customer</th>
                <th className="border border-gray-300 px-4 py-2">Item Name</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Subtotal</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sale, index) =>
                sale.items.map((item, itemIndex) => (
                  <tr key={`${sale._id}-${itemIndex}`} className="text-center">
                    {itemIndex === 0 && (
                      <>
                        <td
                          className="border border-gray-300 px-4 py-2"
                          rowSpan={sale.items.length}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="border border-gray-300 px-4 py-2"
                          rowSpan={sale.items.length}
                        >
                          {new Date(sale.date).toLocaleDateString("in")}
                        </td>
                        <td
                          className="border border-gray-300 px-4 py-2"
                          rowSpan={sale.items.length}
                        >
                          {sale.customer.name}
                        </td>
                      </>
                    )}
                    <td className="border border-gray-300 px-4 py-2">
                      {item.item.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      INR {item.price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      INR {(item.quantity * item.price).toFixed(2)}
                    </td>
                    {itemIndex === 0 && (
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={sale.items.length}
                      >
                        INR {sale.total.toFixed(2)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {console.log(data)}
        {reportType === "customerLedger" && data.length > 0 && (
          <>
            {/* <h3 className="font-bold p-2">Customer: {selectedCustomer}</h3> */}
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Sr. No.</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Item Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Subtotal</th>
                  <th className="border border-gray-300 px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) =>
                  entry.items.map((item, itemIndex) => (
                    <tr
                      key={`${entry._id}-${itemIndex}`}
                      className="text-center"
                    >
                      {itemIndex === 0 && (
                        <>
                          <td
                            className="border border-gray-300 px-4 py-2"
                            rowSpan={entry.items.length}
                          >
                            {index + 1}
                          </td>
                          <td
                            className="border border-gray-300 px-4 py-2"
                            rowSpan={entry.items.length}
                          >
                            {new Date(entry.date).toLocaleDateString("in")}
                          </td>
                        </>
                      )}
                      <td className="border border-gray-300 px-4 py-2">
                        {item.item.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        INR {item.price.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        INR {(item.quantity * item.price).toFixed(2)}
                      </td>
                      {itemIndex === 0 && (
                        <td
                          className="border border-gray-300 px-4 py-2"
                          rowSpan={entry.items.length}
                        >
                          INR {entry.total.toFixed(2)}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {data.length === 0 && (
          <p className="text-center text-gray-500">No data to display</p>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
