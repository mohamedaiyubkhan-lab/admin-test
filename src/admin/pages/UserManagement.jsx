
import React, { useMemo, useState } from "react";
import { Plus, Trash2, Search, X } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function UserManagement() {
    const { users = [], setUsers, departments = [], roles = [] } = useAdmin();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    // Search users by name, username, email, role, department or status
    const filteredUsers = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return users;

        return users.filter((user) => {
            const searchableFields = [
                user.name,
                user.username,
                user.email,
                user.role,
                user.department,
                user.status,
                user.id,
            ];

            return searchableFields.some((field) =>
                String(field ?? "").toLowerCase().includes(search)
            );
        });
    }, [users, searchTerm]);

    // Save new user
    const saveUser = (e) => {
        e.preventDefault();

        const username = form.username.trim().toLowerCase();

        if (!username) {
            alert("Please enter a username.");
            return;
        }

        const duplicate = users.some(
            (user) =>
                String(user.username ?? "").trim().toLowerCase() === username
        );

        if (duplicate) {
            alert("Username already exists.");
            return;
        }

        const newUser = {
            ...form,
            id: Date.now(),
            name: form.name.trim(),
            username: form.username.trim(),
            email: form.email.trim(),
        };

        setUsers((previous) => [...(previous || []), newUser]);

        setShowForm(false);
        setForm(emptyForm);
        setSearchTerm("");
    };

    // Delete user
    const deleteUser = (id) => {
        if (!window.confirm("Delete this user?")) return;

        setUsers((previous) =>
            (previous || []).filter((user) => user.id !== id)
        );
    };

    const closeForm = () => {
        setShowForm(false);
        setForm(emptyForm);
    };

    return (
        <section className="admin-panel">

            {/* Header */}
            <div className="section-heading">
                <div>
                    <h3>User Management</h3>
                    <p>Manage hospital department users.</p>
                </div>

                <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            {/* Search Bar */}
            <div className="user-search-container">
                <div className="user-search-box">
                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search by name, username, email, role, department or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            className="user-search-clear"
                            onClick={() => setSearchTerm("")}
                            title="Clear search"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <span className="user-search-count">
                    Showing {filteredUsers.length} of {users.length} users
                </span>
            </div>

            {/* Users Table */}
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
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-state">
                                    {users.length === 0
                                        ? "No users found."
                                        : "No users match your search."}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name || "-"}</td>
                                    <td>{user.username || "-"}</td>
                                    <td>{user.email || "-"}</td>
                                    <td>{user.role || "-"}</td>
                                    <td>{user.department || "-"}</td>
                                    <td>
                                        <span
                                            className={
                                                String(user.status).toLowerCase() === "active"
                                                    ? "status-active"
                                                    : "status-inactive"
                                            }
                                        >
                                            {user.status || "-"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="table-action delete-action"
                                            onClick={() => deleteUser(user.id)}
                                            title="Delete user"
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

            {/* Add User Modal */}
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
                                        onChange={(e) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                [key]: e.target.value,
                                            }))
                                        }
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                    />
                                </div>
                            ))}

                            <div className="form-group">
                                <label>Role</label>

                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            role: e.target.value,
                                        }))
                                    }
                                >
                                    {roles.map((role) => (
                                        <option
                                            key={role.id}
                                            value={role.name}
                                        >
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Department</label>

                                <select
                                    value={form.department}
                                    onChange={(e) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            department: e.target.value,
                                        }))
                                    }
                                >
                                    {departments.map((department) => (
                                        <option
                                            key={department.id}
                                            value={department.name}
                                        >
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Status</label>

                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            status: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-btn"
                                >
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
