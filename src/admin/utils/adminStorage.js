
export const STORAGE_KEYS = {
    doctors: "hospitalDoctors",
    users: "hospitalUsers",
    departments: "hospitalDepartments",
    roles: "hospitalRoles",
    settings: "hospitalSettings",
};

export const DEFAULT_DEPARTMENTS = [
    { id: 1, name: "Reception", description: "Patient registration and appointments", status: "Active" },
    { id: 2, name: "Doctor", description: "Consultations and medical records", status: "Active" },
    { id: 3, name: "Pharmacy", description: "Medicines and inventory", status: "Active" },
    { id: 4, name: "Radiology", description: "Scanning and imaging reports", status: "Active" },
    { id: 5, name: "Laboratory", description: "Lab tests and sample management", status: "Active" },
    { id: 6, name: "Billing", description: "Invoices and payments", status: "Active" },
];

export const DEFAULT_ROLES = [
    { id: 1, name: "Super Admin", department: "All Departments", permissions: ["all"] },
    { id: 2, name: "Doctor", department: "Doctor", permissions: ["patients", "prescriptions", "medical-records"] },
    { id: 3, name: "Reception", department: "Reception", permissions: ["patients", "appointments"] },
    { id: 4, name: "Pharmacy", department: "Pharmacy", permissions: ["medicines", "inventory", "sales"] },
    { id: 5, name: "Radiology", department: "Radiology", permissions: ["scan-requests", "reports"] },
    { id: 6, name: "Laboratory", department: "Laboratory", permissions: ["lab-requests", "samples", "reports"] },
    { id: 7, name: "Billing", department: "Billing", permissions: ["invoices", "payments"] },
];

export function getData(key, fallback = []) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.error("Storage read error:", error);
        return fallback;
    }
}

export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("hospital-data-updated"));
}

export function getInitialData(key, fallback) {
    const saved = localStorage.getItem(key);

    if (saved === null) {
        saveData(key, fallback);
        return fallback;
    }

    return getData(key, fallback);
}

export function generateId(prefix) {
    return `${prefix}${Date.now().toString().slice(-8)}`;
}
