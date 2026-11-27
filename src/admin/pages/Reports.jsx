
import React, { useEffect, useMemo, useState } from "react";

const REPORTS = [
    {
        id: "medicines",
        title: "Pharmacy Medicine Report",
        description: "Medicine stock and details",
        icon: "💊",
        storageKeys: ["pharmacyMedicines"],
    },
    {
        id: "sales",
        title: "Pharmacy Sales Report",
        description: "Sales transaction details",
        icon: "💰",
        storageKeys: ["pharmacySales"],
    },
    {
        id: "radiology",
        title: "Radiology Report",
        description: "Radiology report entries",
        icon: "🩻",
        storageKeys: ["radiologyReportEntries"],
    },
    {
        id: "departments",
        title: "Department Report",
        description: "Hospital departments",
        icon: "🏥",
        storageKeys: ["hospitalDepartments"],
    },
    {
        id: "doctors",
        title: "Doctor Report",
        description: "Registered doctors",
        icon: "👨‍⚕️",
        storageKeys: ["hospitalDoctors"],
    },
    {
        id: "users",
        title: "User Report",
        description: "System users",
        icon: "👥",
        storageKeys: ["hospitalUsers"],
    },
    {
        id: "patients",
        title: "Patient Report",
        description: "Registered patients",
        storageKeys: [
            "patients",
            "hospitalPatients",
            "receptionPatients",
            "registeredPatients",
            "patientData",
        ],
    },
];

const DEFAULT_DEPARTMENTS = [
    { name: "Reception" },
    { name: "Doctor" },
    { name: "Pharmacy" },
    { name: "Radiology" },
    { name: "Laboratory" },
    { name: "Billing" },
];

function readStorage(key) {
    try {
        const saved = localStorage.getItem(key);
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Storage error:", key, error);
        return [];
    }
}

function readFirstAvailable(keys) {
    for (const key of keys) {
        const data = readStorage(key);

        if (data.length > 0) {
            return { data, sourceKey: key };
        }
    }

    return { data: [], sourceKey: keys[0] };
}

function getReportData(report) {
    const result = readFirstAvailable(report.storageKeys);

    if (report.id === "departments" && result.data.length === 0) {
        return {
            data: DEFAULT_DEPARTMENTS,
            sourceKey: "Default departments",
        };
    }

    if (report.id === "patients" && result.data.length === 0) {
        return {
            data: readStorage("doctorMedicalRecords"),
            sourceKey: "doctorMedicalRecords",
        };
    }

    return result;
}

// Convert expiry date to DD.MM.YYYY
function formatDate(dateValue) {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return String(dateValue);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

// Convert field names to readable labels
function formatLabel(key) {
    const labels = {
        name: "Name",
        category: "Category",
        batch: "Batch",
        expiry: "Expiry Date",
        price: "Price",
        id: "ID",
        quantity: "Quantity",
        stock: "Stock",
        patientName: "Patient Name",
        reportId: "Report ID",
        doctorName: "Doctor Name",
        department: "Department",
        createdAt: "Date",
        date: "Date",
        paymentMethod: "Payment Method",
        total: "Total Amount",
    };

    return (
        labels[key] ||
        key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (letter) => letter.toUpperCase())
    );
}

function formatValue(key, value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (key === "expiry" || key === "expiryDate") {
        return formatDate(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                typeof item === "object" ? JSON.stringify(item) : String(item)
            )
            .join(", ");
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

// Handles medicine objects stored directly or nested inside sales records.
function extractMedicines(sales) {
    const result = [];

    sales.forEach((sale) => {
        const possibleArrays = [
            sale.items,
            sale.cart,
            sale.medicines,
            sale.products,
            sale.orderItems,
        ];

        const medicines = possibleArrays.find(Array.isArray);

        if (medicines) {
            medicines.forEach((medicine) => {
                result.push(medicine);
            });
            return;
        }

        // Supports a record that is itself a medicine object.
        if (sale.name && (sale.batch || sale.category || sale.expiry)) {
            result.push(sale);
            return;
        }

        // Supports JSON stored as a string inside a sale field.
        Object.values(sale).forEach((value) => {
            if (typeof value === "string") {
                try {
                    const parsed = JSON.parse(value);

                    if (Array.isArray(parsed)) {
                        parsed.forEach((item) => result.push(item));
                    } else if (
                        parsed &&
                        typeof parsed === "object" &&
                        parsed.name
                    ) {
                        result.push(parsed);
                    }
                } catch {
                    // Ignore ordinary text values.
                }
            }
        });
    });

    return result;
}


function getColumns(data) {
    const keys = new Set();

    data.forEach((item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
            Object.keys(item).forEach((key) => {
                if (key !== "id" && key !== "_id") {
                    keys.add(key);
                }
            });
        }
    });

    return Array.from(keys).slice(0, 10);
}


function escapeCSV(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function Reports() {
    const [selectedReport, setSelectedReport] = useState("medicines");
    const [reportData, setReportData] = useState({});
    const [search, setSearch] = useState("");

    const loadReports = () => {
        const updated = {};

        REPORTS.forEach((report) => {
            updated[report.id] = getReportData(report);
        });

        setReportData(updated);
    };

    useEffect(() => {
        loadReports();

        window.addEventListener("storage", loadReports);
        window.addEventListener("hospital-data-updated", loadReports);
        window.addEventListener("doctor-data-updated", loadReports);

        return () => {
            window.removeEventListener("storage", loadReports);
            window.removeEventListener("hospital-data-updated", loadReports);
            window.removeEventListener("doctor-data-updated", loadReports);
        };
    }, []);

    const currentReport = REPORTS.find(
        (report) => report.id === selectedReport
    );

    const rawData = reportData[selectedReport]?.data || [];
    const sourceKey = reportData[selectedReport]?.sourceKey || "";

    // Pharmacy Sales Report: extract individual medicine objects.
    const currentData =
        selectedReport === "sales"
            ? extractMedicines(rawData)
            : rawData;

    const filteredData = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return currentData;

        return currentData.filter((item) =>
            Object.entries(item || {}).some(([key, value]) =>
                `${formatLabel(key)} ${formatValue(key, value)}`
                    .toLowerCase()
                    .includes(term)
            )
        );
    }, [currentData, search]);

    const columns = getColumns(filteredData);

    const exportCSV = () => {
        if (!filteredData.length) {
            alert("No records available to export.");
            return;
        }

        const exportColumns = getColumns(filteredData);

        const csvRows = [
            exportColumns.map((key) => escapeCSV(formatLabel(key))).join(","),
            ...filteredData.map((item) =>
                exportColumns
                    .map((key) => escapeCSV(formatValue(key, item[key])))
                    .join(",")
            ),
        ];

        const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download =
            currentReport.title.toLowerCase().replaceAll(" ", "-") + ".csv";

        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="admin-reports">
            <div className="reports-heading">
                <div>
                    <h2>Reports Management</h2>
                    <p>View and export reports from all hospital departments.</p>
                </div>

                <button
                    className="reports-refresh-btn"
                    onClick={loadReports}
                    type="button"
                >
                    ↻ Refresh Reports
                </button>
            </div>

            <div className="reports-summary-grid">
                {REPORTS.map((report) => (
                    <button
                        type="button"
                        key={report.id}
                        className={`report-summary-card ${selectedReport === report.id ? "active" : ""
                            }`}
                        onClick={() => {
                            setSelectedReport(report.id);
                            setSearch("");
                        }}
                    >
                        <div className="report-card-top">
                            <span className="report-icon">{report.icon}</span>
                            <span className="report-count">
                                {report.id === "sales"
                                    ? extractMedicines(reportData.sales?.data || []).length
                                    : reportData[report.id]?.data?.length || 0}
                            </span>
                        </div>

                        <h3>{report.title}</h3>
                        <p>{report.description}</p>
                        <span className="report-view-link">View Report →</span>
                    </button>
                ))}
            </div>

            <div className="report-data-section">
                <div className="report-data-heading">
                    <div>
                        <h3>{currentReport?.title}</h3>
                        <p>{currentReport?.description}</p>
                    </div>

                    <button
                        type="button"
                        className="reports-export-btn"
                        onClick={exportCSV}
                    >
                        ↓ Export CSV
                    </button>
                </div>

                <div className="report-toolbar">
                    <input
                        type="text"
                        placeholder="Search report..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <div className="report-total">
                        Total Records: <strong>{currentData.length}</strong>
                    </div>
                </div>

                <div className="report-table-wrapper">
                    {filteredData.length > 0 && columns.length > 0 ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    {columns.map((key) => (
                                        <th key={key}>{formatLabel(key)}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={item.id || item._id || index}>
                                        <td>{index + 1}</td>

                                        {columns.map((key) => (
                                            <td key={key}>
                                                {formatValue(key, item[key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="report-empty">
                            <div className="report-empty-icon">📋</div>
                            <h3>No Records Found</h3>
                            <p>
                                {search
                                    ? "No records match your search."
                                    : "No data is available for this report yet."}
                            </p>
                        </div>
                    )}
                </div>

                <div className="report-footer">
                    <span>
                        Showing {filteredData.length} of {currentData.length} records
                    </span>
                    <span>Data source: {sourceKey}</span>
                </div>
            </div>
        </div>
    );
}
