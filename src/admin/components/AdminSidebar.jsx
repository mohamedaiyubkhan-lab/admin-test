
import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Stethoscope,
    Users,
    ShieldCheck,
    FileText,
    Settings,
    LogOut,
    Hospital,
} from "lucide-react";

const menuItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard, end: true },
    { name: "Departments", path: "/admin/departments", icon: Building2 },
    { name: "Doctors", path: "/admin/doctors", icon: Stethoscope },
    { name: "Users", path: "/admin/users", icon: Users },

    { name: "Reports", path: "/admin/reports", icon: FileText },
    { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ onLogout, collapsed, setCollapsed }) {
    return (
        <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="admin-brand">
                <div className="admin-logo">
                    <Hospital size={25} />
                </div>

                {!collapsed && <h2>Hospital Admin</h2>}

                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title="Toggle sidebar"
                >
                    ☰
                </button>
            </div>

            <div className="sidebar-label">
                {!collapsed && "MAIN MENU"}
            </div>

            <nav className="admin-menu">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            title={item.name}
                            className={({ isActive }) =>
                                `admin-menu-item ${isActive ? "active" : ""}`
                            }
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            <button className="admin-logout" onClick={onLogout}>
                <LogOut size={19} />
                {!collapsed && <span>Logout</span>}
            </button>
        </aside>
    );
}
