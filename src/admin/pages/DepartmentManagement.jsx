
import React, { useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function DepartmentManagement() {
    const { departments, setDepartments } = useAdmin();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const emptyForm = {
        name: "",
        description: "",
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);

    const openForm = (department = null) => {
        setEditingId(department?.id || null);
        setForm(department || emptyForm);
        setShowForm(true);
    };

    const saveDepartment = (e) => {
        e.preventDefault();

        if (!form.name.trim()) return;

        if (
            departments.some(
                (d) =>
                    d.name.toLowerCase() === form.name.toLowerCase() &&
                    d.id !== editingId
            )
        ) {
            alert("Department already exists.");
            return;
        }

        if (editingId) {
            setDepartments((previous) =>
                previous.map((d) =>
                    d.id === editingId ? { ...form, id: editingId } : d
                )
            );
        } else {
            setDepartments((previous) => [
                ...previous,
                { ...form, id: Date.now() },
            ]);
        }

        setShowForm(false);
        setForm(emptyForm);
    };

    const deleteDepartment = (id) => {
        if (!window.confirm("Delete this department?")) return;

        setDepartments((previous) =>
            previous.filter((d) => d.id !== id)
        );
    };

    return (
        <section className="admin-panel">
            <div className="section-heading">
                <div>
                    <h3>Department Management</h3>
                    <p>Manage hospital departments and their status.</p>
                </div>

                <button className="admin-primary-btn" onClick={() => openForm()}>
                    <Plus size={18} /> Add Department
                </button>
            </div>

            <div className="department-grid">
                {departments.map((department) => (
                    <div className="department-card" key={department.id}>
                        <div className="department-icon">
                            <Building2 size={25} />
                        </div>

                        <h3>{department.name}</h3>
                        <p>{department.description}</p>

                        <span className={
                            department.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                        }>
                            {department.status}
                        </span>

                        <div className="department-actions">
                            <button className="table-action" onClick={() => openForm(department)}>
                                <Pencil size={17} /> Edit
                            </button>

                            <button className="table-action delete-action" onClick={() => deleteDepartment(department.id)}>
                                <Trash2 size={17} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>{editingId ? "Edit Department" : "Add Department"}</h3>

                        <form onSubmit={saveDepartment}>
                            <div className="form-group">
                                <label>Department Name</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="3"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>

                            <div className="form-footer">
                                <button type="button" className="admin-secondary-btn" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-primary-btn">
                                    Save Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
