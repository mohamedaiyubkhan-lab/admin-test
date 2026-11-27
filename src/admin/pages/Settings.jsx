
import React, { useState } from "react";
import { Save } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Settings() {
    const { settings, setSettings } = useAdmin();
    const [form, setForm] = useState(settings);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSettings(form);
        alert("Hospital settings saved successfully.");
    };

    return (
        <section className="admin-panel">
            <h3>Hospital Settings</h3>
            <p>Manage hospital information.</p>

            <form onSubmit={handleSubmit}>
                <div className="settings-form">
                    <div className="form-group">
                        <label>Hospital Name</label>
                        <input
                            value={form.hospitalName}
                            onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Hospital Phone</label>
                        <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="Hospital phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label>Hospital Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Hospital email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Hospital Address</label>
                        <textarea
                            rows="4"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            placeholder="Hospital address"
                        />
                    </div>
                </div>

                <button type="submit" className="admin-primary-btn">
                    <Save size={18} /> Save Settings
                </button>
            </form>
        </section>
    );
}
