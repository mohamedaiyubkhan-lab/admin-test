
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const initialForm = {
    doctorId: "",
    name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    qualification: "",
    specialization: "",
    experience: "",
    department: "Doctor",
    consultationFee: "",
    username: "",
    status: "Active",
};

export default function CreateDoctor() {
    const { doctors, setDoctors, departments } = useAdmin();
    const navigate = useNavigate();
    const { doctorId } = useParams();

    const editing = Boolean(doctorId);

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (editing) {
            const doctor = doctors.find(
                (item) => item.doctorId === doctorId
            );

            if (doctor) {
                setForm({ ...initialForm, ...doctor });
            } else {
                alert("Doctor profile not found.");
                navigate("/admin/doctors");
            }
        } else {
            setForm({
                ...initialForm,
                doctorId: "DOC" + Date.now().toString().slice(-8),
            });
        }
    }, [doctorId, doctors, editing, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            alert("Please complete all required fields.");
            return;
        }

        if (editing) {
            setDoctors((previous) =>
                previous.map((doctor) =>
                    doctor.doctorId === doctorId ? form : doctor
                )
            );
        } else {
            const emailExists = doctors.some(
                (doctor) =>
                    doctor.email.toLowerCase() === form.email.toLowerCase()
            );

            if (emailExists) {
                alert("A doctor with this email already exists.");
                return;
            }

            setDoctors((previous) => [...previous, form]);
        }

        alert(editing
            ? "Doctor profile updated successfully."
            : "Doctor profile created successfully."
        );

        navigate("/admin/doctors");
    };

    return (
        <section className="admin-panel">
            <div className="section-heading">
                <div>
                    <h3>{editing ? "Edit Doctor Profile" : "Create Doctor Profile"}</h3>
                    <p>Enter doctor personal and professional information.</p>
                </div>

                <button
                    className="admin-secondary-btn"
                    onClick={() => navigate("/admin/doctors")}
                >
                    <ArrowLeft size={17} /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="doctor-form-section">
                    <h4>Personal Information</h4>

                    <div className="doctor-form-grid">
                        <div className="form-group">
                            <label>Doctor ID</label>
                            <input value={form.doctorId} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Doctor Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input name="phone" value={form.phone} onChange={handleChange} required />
                        </div>

                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea name="address" value={form.address} onChange={handleChange} rows="3" />
                        </div>
                    </div>
                </div>

                <div className="doctor-form-section">
                    <h4>Professional Information</h4>

                    <div className="doctor-form-grid">
                        <div className="form-group">
                            <label>Qualification</label>
                            <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="MBBS, MD, MS..." />
                        </div>

                        <div className="form-group">
                            <label>Specialization</label>
                            <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Cardiology, Neurology..." />
                        </div>

                        <div className="form-group">
                            <label>Experience (Years)</label>
                            <input type="number" min="0" name="experience" value={form.experience} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <select name="department" value={form.department} onChange={handleChange}>
                                <option value="Doctor">Doctor</option>
                                {departments
                                    .filter((department) => department.name !== "Doctor")
                                    .map((department) => (
                                        <option key={department.id} value={department.name}>
                                            {department.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Consultation Fee</label>
                            <input type="number" min="0" name="consultationFee" value={form.consultationFee} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="doctor-form-section">
                    <h4>Account Information</h4>
                    <div className="doctor-form-grid">
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" value={form.username} onChange={handleChange} placeholder="Doctor username" />
                        </div>
                    </div>
                    <p className="form-note">
                        This sample form stores a profile only. Secure login account
                        creation will be added separately.
                    </p>
                </div>

                <div className="form-footer">
                    <button type="button" className="admin-secondary-btn" onClick={() => navigate("/admin/doctors")}>
                        Cancel
                    </button>

                    <button type="submit" className="admin-primary-btn">
                        <Save size={17} />
                        {editing ? "Update Doctor" : "Save Doctor"}
                    </button>
                </div>
            </form>
        </section>
    );
}
