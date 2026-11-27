
import React from "react";
import {
    Building2,
    Stethoscope,
    Users,
    UserRound,
    Activity,
    ArrowUpRight,
    Pill,
    Scan,
    TestTube,
    Receipt,
    Monitor,
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

export default function AdminDashboard() {
    const { doctors, users, departments } = useAdmin();

    // Change this key to match your existing patient storage key.
    const patients = JSON.parse(
        localStorage.getItem("patients") || "[]"
    );

    return (
        <>
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
                    value={Array.isArray(patients) ? patients.length : 0}
                    icon={UserRound}
                    color="orange"
                />
            </div>

            <section className="admin-panel">
                <div className="section-heading">
                    <div>
                        <h3>Department Overview</h3>
                        <p>All hospital departments</p>
                    </div>
                </div>

                <div className="department-grid">
                    {departments.map((department) => {
                        const Icon =
                            departmentIcons[department.name] || Building2;

                        return (
                            <div className="department-card" key={department.id}>
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
                            </div>
                        );
                    })}
                </div>
            </section>

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
                                {[...doctors].reverse().slice(0, 5).map((doctor) => (
                                    <tr key={doctor.doctorId}>
                                        <td>{doctor.doctorId}</td>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.specialization}</td>
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

            <section className="admin-panel">
                <h3>System Information</h3>
                <div className="system-info">
                    <div>
                        <strong>Departments</strong>
                        <span>{departments.filter(d => d.status === "Active").length} Active</span>
                    </div>
                    <div>
                        <strong>Doctor Profiles</strong>
                        <span>{doctors.length} Registered</span>
                    </div>
                    <div>
                        <strong>User Accounts</strong>
                        <span>{users.length} Created</span>
                    </div>
                </div>
            </section>
        </>
    );
}
