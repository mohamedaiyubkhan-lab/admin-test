
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
        icon: "👥",
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

const MEDICINE_COLUMNS = [
    "name",
    "category",
    "batch",
    "expiryDate",
    "price",
    "quantity",
];

const SALES_MEDICINE_COLUMNS = [
    "name",
    "category",
    "batch",
    "expiryDate",
    "price",
    "quantity",
];

function readStorage(key) {
    try {
        const saved = localStorage.getItem(key);

        if (!saved) return [];

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;

        // Support object-based storage where records are grouped in an object.
        if (parsed && typeof parsed === "object") {
            if (Array.isArray(parsed.data)) return parsed.data;
            if (Array.isArray(parsed.records)) return parsed.records;
            if (Array.isArray(parsed.patients)) return parsed.patients;
            if (Array.isArray(parsed.items)) return parsed.items;
        }

        return [];
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

    return { data: [], sourceKey: keys[0] || "" };
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
        const doctorRecords = readStorage("doctorMedicalRecords");

        return {
            data: doctorRecords,
            sourceKey: doctorRecords.length
                ? "doctorMedicalRecords"
                : report.storageKeys.join(", "),
        };
    }

    return result;
}

function formatDate(dateValue) {
    if (!dateValue) return "—";

    // Handle YYYY-MM-DD without timezone shifting.
    const dateText = String(dateValue);

    const dateOnlyMatch = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateOnlyMatch) {
        return `${dateOnlyMatch[3]}.${dateOnlyMatch[2]}.${dateOnlyMatch[1]}`;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return dateText;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

function formatLabel(key) {
    const labels = {
        name: "Name",
        medicineName: "Medicine Name",
        category: "Category",
        batch: "Batch",
        expiry: "Expiry Date",
        expiryDate: "Expiry Date",
        price: "Price",
        quantity: "Quantity",
        stock: "Stock",
        patientName: "Patient Name",
        patientId: "Patient ID",
        reportId: "Report ID",
        doctorName: "Doctor Name",
        radiologistName: "Radiologist Name",
        scanName: "Scan Name",
        department: "Department",
        createdAt: "Date",
        date: "Date",
        reportDate: "Report Date",
        paymentMethod: "Payment Method",
        total: "Total Amount",
        status: "Status",
        age: "Age",
        gender: "Gender",
        phone: "Phone",
        email: "Email",
        address: "Address",
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

    if (
        key === "expiry" ||
        key === "expiryDate" ||
        key === "reportDate" ||
        key === "createdAt" ||
        key === "date"
    ) {
        return formatDate(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                typeof item === "object" && item !== null
                    ? JSON.stringify(item)
                    : String(item)
            )
            .join(", ");
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function getMedicineName(medicine) {
    return (
        medicine.name ||
        medicine.medicineName ||
        medicine.productName ||
        medicine.title ||
        ""
    );
}

function getMedicineExpiry(medicine) {
    return (
        medicine.expiryDate ||
        medicine.expiry ||
        medicine.expirationDate ||
        ""
    );
}

function getMedicineQuantity(medicine) {
    return (
        medicine.quantity ??
        medicine.qty ??
        medicine.soldQuantity ??
        medicine.count ??
        ""
    );
}

function normalizeMedicine(medicine) {
    return {
        name: getMedicineName(medicine),
        category: medicine.category || medicine.medicineCategory || "",
        batch: medicine.batch || medicine.batchNumber || "",
        expiryDate: getMedicineExpiry(medicine),
        price:
            medicine.price ??
            medicine.sellingPrice ??
            medicine.unitPrice ??
            "",
        quantity: getMedicineQuantity(medicine),
    };
}

function extractMedicines(sales) {
    const result = [];

    sales.forEach((sale) => {
        if (!sale || typeof sale !== "object") return;

        const possibleArrays = [
            sale.items,
            sale.cart,
            sale.medicines,
            sale.products,
            sale.orderItems,
            sale.saleItems,
        ];

        const medicines = possibleArrays.find(
            (value) => Array.isArray(value) && value.length > 0
        );

        if (medicines) {
            medicines.forEach((medicine) => {
                if (medicine && typeof medicine === "object") {
                    result.push(normalizeMedicine(medicine));
                }
            });

            return;
        }

        if (getMedicineName(sale)) {
            result.push(normalizeMedicine(sale));
        }
    });

    return result;
}

function getColumns(reportId, data) {
    if (reportId === "medicines" || reportId === "sales") {
        return reportId === "sales"
            ? SALES_MEDICINE_COLUMNS
            : MEDICINE_COLUMNS;
    }

    const keys = new Set();

    data.forEach((item) => {
        if (
            item &&
            typeof item === "object" &&
            !Array.isArray(item)
        ) {
            Object.keys(item).forEach((key) => {
                if (
                    key !== "id" &&
                    key !== "_id" &&
                    key !== "password" &&
                    key !== "confirmPassword"
                ) {
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

        const refresh = () => loadReports();

        const events = [
            "storage",
            "hospital-data-updated",
            "doctor-data-updated",
            "pharmacy-data-updated",
            "pharmacy-sales-updated",
            "prescriptions-updated",
            "patients-updated",
            "radiology-data-updated",
            "lab-results-updated",
            "appointments-updated",
        ];

        events.forEach((eventName) => {
            window.addEventListener(eventName, refresh);
        });

        // Refresh when returning to the Reports page/tab.
        window.addEventListener("focus", refresh);

        return () => {
            events.forEach((eventName) => {
                window.removeEventListener(eventName, refresh);
            });

            window.removeEventListener("focus", refresh);
        };
    }, []);

    const currentReport = REPORTS.find(
        (report) => report.id === selectedReport
    );

    const rawData = reportData[selectedReport]?.data || [];
    const sourceKey = reportData[selectedReport]?.sourceKey || "";

    const currentData = useMemo(() => {
        if (selectedReport === "sales") {
            return extractMedicines(rawData);
        }

        if (selectedReport === "medicines") {
            return rawData.map(normalizeMedicine);
        }

        return rawData;
    }, [selectedReport, rawData]);

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

    const columns = getColumns(selectedReport, filteredData);

    const exportCSV = () => {
        if (!filteredData.length) {
            alert("No records available to export.");
            return;
        }

        const exportColumns = getColumns(selectedReport, filteredData);

        const csvRows = [
            exportColumns
                .map((key) => escapeCSV(formatLabel(key)))
                .join(","),

            ...filteredData.map((item) =>
                exportColumns
                    .map((key) =>
                        escapeCSV(formatValue(key, item[key]))
                    )
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
            (currentReport?.title || "report")
                .toLowerCase()
                .replaceAll(" ", "-") + ".csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    return (
        <div className="admin-reports">
            <div className="reports-heading">
                <div>
                    <h2>Reports Management</h2>
                    <p>
                        View and export reports from all hospital departments.
                    </p>
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
                {REPORTS.map((report) => {
                    const cardData =
                        reportData[report.id]?.data || [];

                    const count =
                        report.id === "sales"
                            ? extractMedicines(cardData).length
                            : cardData.length;

                    return (
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
                                <span className="report-icon">
                                    {report.icon}
                                </span>

                                <span className="report-count">
                                    {count}
                                </span>
                            </div>

                            <h3>{report.title}</h3>
                            <p>{report.description}</p>

                            <span className="report-view-link">
                                View Report →
                            </span>
                        </button>
                    );
                })}
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
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <div className="report-total">
                        Total Records:{" "}
                        <strong>{currentData.length}</strong>
                    </div>
                </div>

                <div className="report-table-wrapper">
                    {filteredData.length > 0 && columns.length > 0 ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>

                                    {columns.map((key) => (
                                        <th key={key}>
                                            {formatLabel(key)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr
                                        key={
                                            item.id ||
                                            item._id ||
                                            item.reportId ||
                                            index
                                        }
                                    >
                                        <td>{index + 1}</td>

                                        {columns.map((key) => (
                                            <td key={key}>
                                                {formatValue(
                                                    key,
                                                    item[key]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="report-empty">
                            <div className="report-empty-icon">
                                📋
                            </div>

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
                        Showing {filteredData.length} of{" "}
                        {currentData.length} records
                    </span>

                    <span>Data source: {sourceKey || "No data source"}</span>
                </div>
            </div>
        </div>
    );
}
