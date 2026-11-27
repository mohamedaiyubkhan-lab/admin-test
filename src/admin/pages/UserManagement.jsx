
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function UserManagement() {
    const { users, setUsers, departments, roles } = useAdmin();

    const [showForm, setShowForm] = useState(false);

    const emptyForm = {
        id: "",
        name: "",
        username: "",
        email: "",
        role: "Reception",
        department: "Reception",
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);

    const saveUser = (e) => {
        e.preventDefault();

        if (users.some(
            (user) => user.username?.toLowerCase() === form.username.toLowerCase()
        )) {
            alert("Username already exists.");
            return;
        }

        const newUser = {
            ...form,
            id: Date.now(),
        };

        setUsers((previous) => [...previous, newUser]);
        setShowForm(false);
        setForm(emptyForm);
    };

    const deleteUser = (id) => {
        if (!window.confirm("Delete this user?")) return;

        setUsers((previous) => previous.filter((u) => u.id !== id));
    };

    return (
        <section className="admin-panel">
            <div className="section-heading">
                <div>
                    <h3>User Management</h3>
                    <p>Manage hospital department users.</p>
                </div>

                <button className="admin-primary-btn" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-state">No users found.</td>
                            </tr>
                        ) : users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.department}</td>
                                <td>{user.status}</td>
                                <td>
                                    <button
                                        className="table-action delete-action"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Create User</h3>

                        <form onSubmit={saveUser}>
                            {[
                                ["name", "Full Name"],
                                ["username", "Username"],
                                ["email", "Email"],
                            ].map(([key, label]) => (
                                <div className="form-group" key={key}>
                                    <label>{label}</label>
                                    <input
                                        required
                                        type={key === "email" ? "email" : "text"}
                                        value={form[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Department</label>
                                <select
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                >
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.name}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
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
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
