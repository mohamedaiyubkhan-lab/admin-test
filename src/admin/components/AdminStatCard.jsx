
import React from "react";

export default function AdminStatCard({
    title,
    value,
    icon: Icon,
    color = "blue",
    description,
}) {
    return (
        <div className="admin-stat-card">
            <div className={`admin-stat-icon ${color}`}>
                <Icon size={25} />
            </div>

            <div className="admin-stat-info">
                <p>{title}</p>
                <h2>{value}</h2>
                {description && <small>{description}</small>}
            </div>
        </div>
    );
}
