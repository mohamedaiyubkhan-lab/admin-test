
import React, { useEffect, useMemo, useState, useCallback } from "react";

import {
    Building2,
    Stethoscope,
    Users,
    UserRound,
    Activity,
    Pill,
    Scan,
    TestTube,
    Receipt,
    Monitor,
    CalendarDays,
    Clock,
    CheckCircle,
    ArrowLeft,
    Search,
    Eye,
    RefreshCw,
} from "lucide-react";

import AdminStatCard from "../components/AdminStatCard";
import { useAdmin } from "../context/AdminContext";

const departmentIcons = {
    Reception: Monitor,
    Doctor: Stethoscope,
    Pharmacy: Pill,
    Radiology: Scan,
    Laboratory: TestTube,
    Billing: Receipt,
};

// Safe LocalStorage reader
const getStorageData = (key) => {
    try {
        const storedData = JSON.parse(
            localStorage.getItem(key) || "[]"
        );

        return Array.isArray(storedData) ? storedData : [];
    } catch (error) {
        console.error(`Error reading ${key}:`, error);
        return [];
    }
};

// Normalize patient information
const normalizePatient = (patient) => {
    const details =
        patient.patientDetails ||
        patient.patientInfo ||
        patient.personalDetails ||
        patient;

    return {
        id:
            details.patientId ||
            details.id ||
            patient.patientId ||
            patient.id ||
            "-",

        name:
            details.patientName ||
            details.name ||
            details.fullName ||
            patient.patientName ||
            patient.patient ||
            patient.name ||
            "-",

        age: details.age || patient.age || "-",

        gender: details.gender || patient.gender || "-",

        phone:
            details.phone ||
            details.mobile ||
            details.phoneNumber ||
            patient.phone ||
            patient.mobile ||
            "-",

        bloodGroup:
            details.bloodGroup ||
            details.bloodType ||
            patient.bloodGroup ||
            patient.bloodType ||
            "-",

        address:
            details.address ||
            patient.address ||
            "-",
    };
};

// Normalize appointment information
const normalizeAppointment = (appointment, index) => {
    return {
        id:
            appointment.appointmentId ||
            appointment.id ||
            index + 1,

        patientName:
            appointment.patientName ||
            appointment.patient ||
            "-",

        patientId:
            appointment.patientId ||
            "-",

        doctor:
            appointment.doctorName ||
            appointment.doctor ||
            "-",

        department:
            appointment.department ||
            "-",

        date:
            appointment.appointmentDate ||
            appointment.date ||
            "-",

        time:
            appointment.appointmentTime ||
            appointment.time ||
            "-",

        status:
            appointment.status ||
            "Pending",
    };
};

export default function AdminDashboard() {
    const { doctors, users, departments } = useAdmin();

    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [activeReceptionTab, setActiveReceptionTab] =
        useState("patients");

    const [searchTerm, setSearchTerm] = useState("");

    // Load Reception LocalStorage data
    const loadReceptionData = useCallback(() => {
        setPatients(getStorageData("hospitalPatients"));

        setAppointments(getStorageData("hospital_appointments"));
    }, []);

    // Initial load and automatic synchronization
    useEffect(() => {
        loadReceptionData();

        const handleStorageChange = (event) => {
            if (
                !event ||
                !event.key ||
                event.key === "hospitalPatients" ||
                event.key === "hospital_appointments"
            ) {
                loadReceptionData();
            }
        };

        const handleReceptionUpdate = () => {
            loadReceptionData();
        };

        const handleFocus = () => {
            loadReceptionData();
        };

        window.addEventListener("storage", handleStorageChange);

        window.addEventListener("focus", handleFocus);

        window.addEventListener(
            "appointments-updated",
            handleReceptionUpdate
        );

        window.addEventListener(
            "patients-updated",
            handleReceptionUpdate
        );

        window.addEventListener(
            "reception-data-updated",
            handleReceptionUpdate
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );

            window.removeEventListener("focus", handleFocus);

            window.removeEventListener(
                "appointments-updated",
                handleReceptionUpdate
            );

            window.removeEventListener(
                "patients-updated",
                handleReceptionUpdate
            );

            window.removeEventListener(
                "reception-data-updated",
                handleReceptionUpdate
            );
        };
    }, [loadReceptionData]);

    // Patient information
    const normalizedPatients = useMemo(() => {
        return patients.map(normalizePatient);
    }, [patients]);

    // Appointment information
    const normalizedAppointments = useMemo(() => {
        return appointments.map(normalizeAppointment);
    }, [appointments]);

    // Reception statistics
    const totalPatients = patients.length;

    const totalAppointments = appointments.length;

    const pendingAppointments = normalizedAppointments.filter(
        (appointment) =>
            appointment.status.toLowerCase() === "pending"
    ).length;

    const completedAppointments = normalizedAppointments.filter(
        (appointment) =>
            appointment.status.toLowerCase() === "completed"
    ).length;

    // Search registered patients
    const filteredPatients = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return normalizedPatients;

        return normalizedPatients.filter((patient) => {
            return (
                String(patient.name).toLowerCase().includes(search) ||
                String(patient.id).toLowerCase().includes(search) ||
                String(patient.phone).toLowerCase().includes(search) ||
                String(patient.gender).toLowerCase().includes(search)
            );
        });
    }, [normalizedPatients, searchTerm]);

    // Search appointments
    const filteredAppointments = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return normalizedAppointments;

        return normalizedAppointments.filter((appointment) => {
            return (
                String(appointment.patientName)
                    .toLowerCase()
                    .includes(search) ||

                String(appointment.patientId)
                    .toLowerCase()
                    .includes(search) ||

                String(appointment.doctor)
                    .toLowerCase()
                    .includes(search) ||

                String(appointment.department)
                    .toLowerCase()
                    .includes(search) ||

                String(appointment.status)
                    .toLowerCase()
                    .includes(search)
            );
        });
    }, [normalizedAppointments, searchTerm]);

    // Open Reception overview
    const openReception = () => {
        loadReceptionData();
        setSelectedDepartment("Reception");
        setActiveReceptionTab("patients");
        setSearchTerm("");
    };

    // Back to main overview
    const closeReception = () => {
        setSelectedDepartment(null);
        setActiveReceptionTab("patients");
        setSearchTerm("");
    };

    return (
        <>
            {/* Welcome Section */}

            <div className="admin-welcome">
                <div>
                    <h2>Welcome to Admin Dashboard</h2>

                    <p>
                        Manage your hospital departments, doctors and users
                        from one place.
                    </p>
                </div>

                <Activity size={45} />
            </div>

            {/* Main Statistics */}

            <div className="admin-stats">

                <AdminStatCard
                    title="Total Departments"
                    value={departments.length}
                    icon={Building2}
                    color="blue"
                />

                <AdminStatCard
                    title="Total Doctors"
                    value={doctors.length}
                    icon={Stethoscope}
                    color="green"
                />

                <AdminStatCard
                    title="Total Users"
                    value={users.length}
                    icon={Users}
                    color="purple"
                />

                <AdminStatCard
                    title="Total Patients"
                    value={totalPatients}
                    icon={UserRound}
                    color="orange"
                />

            </div>

            {/* Department Overview */}

            <section className="admin-panel">

                <div className="section-heading">
                    <div>
                        <h3>Department Overview</h3>

                        <p>
                            Select a department to view its information
                        </p>
                    </div>
                </div>

                <div className="department-grid">

                    {departments.map((department) => {
                        const Icon =
                            departmentIcons[department.name] || Building2;

                        return (
                            <div
                                className="department-card"
                                key={department.id}
                                onClick={
                                    department.name === "Reception"
                                        ? openReception
                                        : undefined
                                }
                                role={
                                    department.name === "Reception"
                                        ? "button"
                                        : undefined
                                }
                                tabIndex={
                                    department.name === "Reception"
                                        ? 0
                                        : undefined
                                }
                                onKeyDown={(event) => {
                                    if (
                                        department.name === "Reception" &&
                                        (event.key === "Enter" ||
                                            event.key === " ")
                                    ) {
                                        event.preventDefault();
                                        openReception();
                                    }
                                }}
                                style={{
                                    cursor:
                                        department.name === "Reception"
                                            ? "pointer"
                                            : "default",
                                }}
                            >

                                <div className="department-icon">
                                    <Icon size={26} />
                                </div>

                                <h3>{department.name}</h3>

                                <p>{department.description}</p>

                                <span
                                    className={
                                        department.status === "Active"
                                            ? "status-active"
                                            : "status-inactive"
                                    }
                                >
                                    {department.status}
                                </span>

                                {department.name === "Reception" && (
                                    <div className="department-view-link">
                                        <Eye size={14} />
                                        View Overview
                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>
            </section>

            {/* Reception Department Overview */}

            {selectedDepartment === "Reception" && (

                <section className="admin-panel reception-overview">

                    {/* Reception Header */}

                    <div className="section-heading reception-heading">

                        <div>
                            <h3>
                                <Monitor size={22} />
                                Reception Department Overview
                            </h3>

                            <p>
                                Manage and view registered patients and
                                appointments
                            </p>
                        </div>

                        <div className="reception-header-actions">

                            <button
                                type="button"
                                className="reception-refresh-btn"
                                onClick={loadReceptionData}
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>

                            <button
                                type="button"
                                className="reception-back-btn"
                                onClick={closeReception}
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>

                        </div>

                    </div>

                    {/* Reception Statistics */}

                    <div className="admin-stats reception-stats">

                        <AdminStatCard
                            title="Registered Patients"
                            value={totalPatients}
                            icon={Users}
                            color="blue"
                        />

                        <AdminStatCard
                            title="Total Appointments"
                            value={totalAppointments}
                            icon={CalendarDays}
                            color="purple"
                        />

                        <AdminStatCard
                            title="Pending Appointments"
                            value={pendingAppointments}
                            icon={Clock}
                            color="orange"
                        />

                        <AdminStatCard
                            title="Completed Appointments"
                            value={completedAppointments}
                            icon={CheckCircle}
                            color="green"
                        />

                    </div>

                    {/* Patients / Appointments Tabs */}

                    <div className="reception-tabs">

                        <button
                            type="button"
                            className={
                                activeReceptionTab === "patients"
                                    ? "reception-tab active"
                                    : "reception-tab"
                            }
                            onClick={() => {
                                setActiveReceptionTab("patients");
                                setSearchTerm("");
                                loadReceptionData();
                            }}
                        >
                            <Users size={18} />

                            Patients

                            <span className="reception-tab-count">
                                {totalPatients}
                            </span>
                        </button>

                        <button
                            type="button"
                            className={
                                activeReceptionTab === "appointments"
                                    ? "reception-tab active"
                                    : "reception-tab"
                            }
                            onClick={() => {
                                setActiveReceptionTab("appointments");
                                setSearchTerm("");
                                loadReceptionData();
                            }}
                        >
                            <CalendarDays size={18} />

                            Appointments

                            <span className="reception-tab-count">
                                {totalAppointments}
                            </span>
                        </button>

                    </div>

                    {/* Search Bar */}

                    <div className="reception-search">

                        <Search size={19} />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder={
                                activeReceptionTab === "patients"
                                    ? "Search patient name, ID, phone..."
                                    : "Search patient, doctor, department, status..."
                            }
                        />

                    </div>

                    {/* PATIENTS TAB */}

                    {activeReceptionTab === "patients" && (

                        <div className="reception-content">

                            <div className="section-heading">
                                <div>
                                    <h3>Registered Patients</h3>

                                    <p>
                                        Patient records from Reception
                                    </p>
                                </div>

                                <span className="reception-total-label">
                                    {filteredPatients.length} Records
                                </span>
                            </div>

                            {filteredPatients.length === 0 ? (

                                <div className="empty-state">
                                    {patients.length === 0
                                        ? "No registered patients found in Reception."
                                        : "No patients match your search."}
                                </div>

                            ) : (

                                <div className="table-wrapper">

                                    <table className="admin-table">

                                        <thead>
                                            <tr>
                                                <th>Patient ID</th>
                                                <th>Patient Name</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th>Phone</th>
                                                <th>Doctor</th>
                                                <th>Address</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {filteredPatients.map(
                                                (patient, index) => (

                                                    <tr
                                                        key={`${patient.id}-${index}`}
                                                    >
                                                        <td>
                                                            {patient.id}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {patient.name}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {patient.age}
                                                        </td>

                                                        <td>
                                                            {patient.gender}
                                                        </td>

                                                        <td>
                                                            {patient.phone}
                                                        </td>

                                                        <td>
                                                            {patient.bloodGroup}
                                                        </td>

                                                        <td>
                                                            {patient.address}
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    )}

                    {/* APPOINTMENTS TAB */}

                    {activeReceptionTab === "appointments" && (

                        <div className="reception-content">

                            <div className="section-heading">
                                <div>
                                    <h3>Appointment Management</h3>

                                    <p>
                                        Appointment records from Reception
                                    </p>
                                </div>

                                <span className="reception-total-label">
                                    {filteredAppointments.length} Records
                                </span>
                            </div>

                            {filteredAppointments.length === 0 ? (

                                <div className="empty-state">
                                    {appointments.length === 0
                                        ? "No appointment records found in Reception."
                                        : "No appointments match your search."}
                                </div>

                            ) : (

                                <div className="table-wrapper">

                                    <table className="admin-table">

                                        <thead>
                                            <tr>
                                                <th>Appointment ID</th>
                                                <th>Patient Name</th>
                                                <th>Patient ID</th>
                                                <th>Doctor</th>
                                                <th>Department</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {filteredAppointments.map(
                                                (appointment, index) => (

                                                    <tr
                                                        key={`${appointment.id}-${index}`}
                                                    >
                                                        <td>
                                                            {appointment.id}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {appointment.patientName}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {appointment.patientId}
                                                        </td>

                                                        <td>
                                                            {appointment.doctor}
                                                        </td>

                                                        <td>
                                                            {appointment.department}
                                                        </td>

                                                        <td>
                                                            {appointment.date}
                                                        </td>

                                                        <td>
                                                            {appointment.time}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={
                                                                    appointment.status.toLowerCase() ===
                                                                        "completed"
                                                                        ? "status-active"
                                                                        : "status-inactive"
                                                                }
                                                            >
                                                                {appointment.status}
                                                            </span>
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    )}

                </section>

            )}

            {/* Recently Added Doctors */}

            <section className="admin-panel">

                <div className="section-heading">
                    <div>
                        <h3>Recently Added Doctors</h3>

                        <p>Latest doctor profiles</p>
                    </div>
                </div>

                {doctors.length === 0 ? (

                    <div className="empty-state">
                        No doctors have been registered yet.
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>Doctor ID</th>
                                    <th>Name</th>
                                    <th>Specialization</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {[...doctors]
                                    .reverse()
                                    .slice(0, 5)
                                    .map((doctor, index) => (

                                        <tr
                                            key={doctor.doctorId || index}
                                        >
                                            <td>{doctor.doctorId}</td>

                                            <td>{doctor.name}</td>

                                            <td>
                                                {doctor.specialization}
                                            </td>

                                            <td>{doctor.department}</td>

                                            <td>
                                                <span className="status-active">
                                                    {doctor.status}
                                                </span>
                                            </td>
                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* System Information */}

            <section className="admin-panel">

                <h3>System Information</h3>

                <div className="system-info">

                    <div>
                        <strong>Departments</strong>

                        <span>
                            {
                                departments.filter(
                                    (department) =>
                                        department.status === "Active"
                                ).length
                            } Active
                        </span>
                    </div>

                    <div>
                        <strong>Doctor Profiles</strong>

                        <span>
                            {doctors.length} Registered
                        </span>
                    </div>

                    <div>
                        <strong>User Accounts</strong>

                        <span>
                            {users.length} Created
                        </span>
                    </div>

                    <div>
                        <strong>Reception Patients</strong>

                        <span>
                            {totalPatients} Registered
                        </span>
                    </div>

                    <div>
                        <strong>Reception Appointments</strong>

                        <span>
                            {totalAppointments} Total
                        </span>
                    </div>

                </div>

            </section>

        </>
    );
}
