
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const AVAILABLE_PERMISSIONS = [
    "patients",
    "appointments",
    "prescriptions",
    "medical-records",
    "medicines",
    "inventory",
    "sales",
    "scan-requests",
    "lab-requests",
    "samples",
    "reports",
    "invoices",
    "payments",
];

export default function RoleManagement() {
    const { roles, setRoles } = useAdmin();

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        department: "",
        permissions: [],
    });

    const togglePermission = (permission) => {
        setForm((previous) => ({
            ...previous,
            permissions: previous.permissions.includes(permission)
                ? previous.permissions.filter((p) => p !== permission)
                : [...previous.permissions, permission],
        }));
    };

    const saveRole = (e) => {
        e.preventDefault();

        if (roles.some((role) => role.name.toLowerCase() === form.name.toLowerCase())) {
            alert("Role already exists.");
            return;
        }

        setRoles((previous) => [
            ...previous,
            { ...form, id: Date.now() },
        ]);

        setForm({ name: "", department: "", permissions: [] });
        setShowForm(false);
    };

    const deleteRole = (id) => {
        if (!window.confirm("Delete this role?")) return;

        setRoles((previous) => previous.filter((role) => role.id !== id));
    };

    return (
        <section className="admin-panel">
            <div className="section-heading">
                <div>
                    <h3>Roles & Permissions</h3>
                    <p>Configure department access roles.</p>
                </div>

                <button className="admin-primary-btn" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> Create Role
                </button>
            </div>

            <div className="role-grid">
                {roles.map((role) => (
                    <div className="role-card" key={role.id}>
                        <h3>{role.name}</h3>
                        <p>{role.department}</p>

                        <strong>Permissions</strong>
                        <ul>
                            {role.permissions.map((permission) => (
                                <li key={permission}>{permission}</li>
                            ))}
                        </ul>

                        {role.name !== "Super Admin" && (
                            <button className="table-action delete-action" onClick={() => deleteRole(role.id)}>
                                <Trash2 size={17} /> Delete Role
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Create New Role</h3>

                        <form onSubmit={saveRole}>
                            <div className="form-group">
                                <label>Role Name</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    required
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                />
                            </div>

                            <h4>Assign Permissions</h4>

                            <div className="permission-grid">
                                {AVAILABLE_PERMISSIONS.map((permission) => (
                                    <label key={permission} className="permission-item">
                                        <input
                                            type="checkbox"
                                            checked={form.permissions.includes(permission)}
                                            onChange={() => togglePermission(permission)}
                                        />
                                        {permission}
                                    </label>
                                ))}
                            </div>

                            <div className="form-footer">
                                <button type="button" className="admin-secondary-btn" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-primary-btn">
                                    Save Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
