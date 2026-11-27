
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    STORAGE_KEYS,
    DEFAULT_DEPARTMENTS,
    DEFAULT_ROLES,
    getInitialData,
    saveData,
} from "../utils/adminStorage";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [doctors, setDoctors] = useState(() =>
        getInitialData(STORAGE_KEYS.doctors, [])
    );

    const [users, setUsers] = useState(() =>
        getInitialData(STORAGE_KEYS.users, [])
    );

    const [departments, setDepartments] = useState(() =>
        getInitialData(STORAGE_KEYS.departments, DEFAULT_DEPARTMENTS)
    );

    const [roles, setRoles] = useState(() =>
        getInitialData(STORAGE_KEYS.roles, DEFAULT_ROLES)
    );

    const [settings, setSettings] = useState(() =>
        getInitialData(STORAGE_KEYS.settings, {
            hospitalName: "Hospital Management System",
            phone: "",
            email: "",
            address: "",
        })
    );

    useEffect(() => {
        saveData(STORAGE_KEYS.doctors, doctors);
    }, [doctors]);

    useEffect(() => {
        saveData(STORAGE_KEYS.users, users);
    }, [users]);

    useEffect(() => {
        saveData(STORAGE_KEYS.departments, departments);
    }, [departments]);

    useEffect(() => {
        saveData(STORAGE_KEYS.roles, roles);
    }, [roles]);

    useEffect(() => {
        saveData(STORAGE_KEYS.settings, settings);
    }, [settings]);

    // Listen for changes made in other tabs
    useEffect(() => {
        const refresh = () => {
            setDoctors(getInitialData(STORAGE_KEYS.doctors, []));
            setUsers(getInitialData(STORAGE_KEYS.users, []));
            setDepartments(getInitialData(STORAGE_KEYS.departments, DEFAULT_DEPARTMENTS));
            setRoles(getInitialData(STORAGE_KEYS.roles, DEFAULT_ROLES));
            setSettings(getInitialData(STORAGE_KEYS.settings, {
                hospitalName: "Hospital Management System",
                phone: "",
                email: "",
                address: "",
            }));
        };

        window.addEventListener("storage", refresh);

        return () => window.removeEventListener("storage", refresh);
    }, []);

    const value = {
        doctors,
        setDoctors,
        users,
        setUsers,
        departments,
        setDepartments,
        roles,
        setRoles,
        settings,
        setSettings,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);

    if (!context) {
        throw new Error("useAdmin must be used inside AdminProvider");
    }

    return context;
}
