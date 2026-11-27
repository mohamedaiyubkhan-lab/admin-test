
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function DoctorManagement() {
    const { doctors, setDoctors } = useAdmin();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const filteredDoctors = doctors.filter((doctor) =>
        [
            doctor.name,
            doctor.doctorId,
            doctor.email,
            doctor.specialization,
        ].some((value) =>
            String(value || "").toLowerCase().includes(search.toLowerCase())
        )
    );

    const deleteDoctor = (id) => {
        if (!window.confirm("Delete this doctor profile?")) return;

        setDoctors((previous) =>
            previous.filter((doctor) => doctor.doctorId !== id)
        );
    };

    return (
        <section className="admin-panel">
            <div className="section-heading">
                <div>
                    <h3>Doctor Management</h3>
                    <p>Create, view, update and manage doctor profiles.</p>
                </div>

                <button
                    className="admin-primary-btn"
                    onClick={() => navigate("/admin/doctors/create")}
                >
                    <Plus size={18} /> Add New Doctor
                </button>
            </div>

            <div className="admin-search">
                <Search size={19} />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by doctor name, ID, email or specialization..."
                />
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Doctor ID</th>
                            <th>Doctor Name</th>
                            <th>Specialization</th>
                            <th>Qualification</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredDoctors.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="empty-state">
                                    No doctor profiles found.
                                </td>
                            </tr>
                        ) : (
                            filteredDoctors.map((doctor) => (
                                <tr key={doctor.doctorId}>
                                    <td>{doctor.doctorId}</td>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.qualification}</td>
                                    <td>{doctor.phone}</td>
                                    <td>{doctor.department}</td>
                                    <td>
                                        <span
                                            className={
                                                doctor.status === "Active"
                                                    ? "status-active"
                                                    : "status-inactive"
                                            }
                                        >
                                            {doctor.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="table-action"
                                            title="View"
                                            onClick={() =>
                                                navigate(`/admin/doctors/edit/${doctor.doctorId}`)
                                            }
                                        >
                                            <Eye size={17} />
                                        </button>

                                        <button
                                            className="table-action"
                                            title="Edit"
                                            onClick={() =>
                                                navigate(`/admin/doctors/edit/${doctor.doctorId}`)
                                            }
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            className="table-action delete-action"
                                            title="Delete"
                                            onClick={() => deleteDoctor(doctor.doctorId)}
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
