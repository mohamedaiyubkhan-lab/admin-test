
import React from "react";
import { Bell, Search, UserCircle } from "lucide-react";

export default function AdminHeader({ title }) {
    return (
        <header className="admin-header">
            <div>
                <h2>{title}</h2>
                <p>Hospital Management System / Admin</p>
            </div>

            <div className="admin-header-actions">
                <div className="header-search">
                    <Search size={18} />
                    <input placeholder="Search..." />
                </div>

                <button className="header-icon">
                    <Bell size={20} />
                </button>

                <div className="admin-profile">
                    <UserCircle size={35} color="#2563eb" />
                    <div>
                        <strong>Administrator</strong>
                        <small>Super Admin</small>
                    </div>
                </div>
            </div>
        </header>
    );
}
