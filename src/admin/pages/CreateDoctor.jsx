
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
    password: "",
    confirmPassword: "",
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
                setForm({
                    ...initialForm,
                    ...doctor,
                    password: "",
                    confirmPassword: "",
                });
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

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.username.trim()
        ) {
            alert("Please complete all required fields.");
            return;
        }

        // Password validation
        if (!editing && !form.password) {
            alert("Please enter a password for the doctor.");
            return;
        }

        if (form.password && form.password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (
            form.password &&
            form.password !== form.confirmPassword
        ) {
            alert("Password and Confirm Password do not match.");
            return;
        }

        // Check duplicate email
        const emailExists = doctors.some(
            (doctor) =>
                doctor.email?.toLowerCase() ===
                form.email.trim().toLowerCase() &&
                doctor.doctorId !== doctorId
        );

        if (emailExists) {
            alert("A doctor with this email already exists.");
            return;
        }

        // Check duplicate username
        const usernameExists = doctors.some(
            (doctor) =>
                doctor.username?.toLowerCase() ===
                form.username.trim().toLowerCase() &&
                doctor.doctorId !== doctorId
        );

        if (usernameExists) {
            alert("This username is already assigned to another doctor.");
            return;
        }

        // Prepare doctor profile
        const doctorData = {
            ...form,
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            username: form.username.trim(),
        };

        // Do not save confirmation password
        delete doctorData.confirmPassword;

        if (editing) {
            const existingDoctor = doctors.find(
                (doctor) => doctor.doctorId === doctorId
            );

            // Keep existing password if password field is empty
            doctorData.password = form.password
                ? form.password
                : existingDoctor?.password || "";

            setDoctors((previous) =>
                previous.map((doctor) =>
                    doctor.doctorId === doctorId
                        ? doctorData
                        : doctor
                )
            );
        } else {
            setDoctors((previous) => [
                ...previous,
                doctorData,
            ]);
        }

        alert(
            editing
                ? "Doctor profile updated successfully."
                : "Doctor profile created successfully."
        );

        navigate("/admin/doctors");
    };

    return (
        <section className="admin-panel">

            {/* Page Header */}
            <div className="section-heading">
                <div>
                    <h3>
                        {editing
                            ? "Edit Doctor Profile"
                            : "Create Doctor Profile"}
                    </h3>

                    <p>
                        Enter doctor personal and professional information.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={() => navigate("/admin/doctors")}
                >
                    <ArrowLeft size={17} /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Personal Information */}
                <div className="doctor-form-section">
                    <h4>Personal Information</h4>

                    <div className="doctor-form-grid">

                        <div className="form-group">
                            <label>Doctor ID</label>
                            <input
                                value={form.doctorId}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Doctor Name *</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={form.dob}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                    </div>
                </div>

                {/* Professional Information */}
                <div className="doctor-form-section">
                    <h4>Professional Information</h4>

                    <div className="doctor-form-grid">

                        <div className="form-group">
                            <label>Qualification</label>
                            <input
                                name="qualification"
                                value={form.qualification}
                                onChange={handleChange}
                                placeholder="MBBS, MD, MS..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Specialization</label>
                            <input
                                name="specialization"
                                value={form.specialization}
                                onChange={handleChange}
                                placeholder="Cardiology, Neurology..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Experience (Years)</label>
                            <input
                                type="number"
                                min="0"
                                name="experience"
                                value={form.experience}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <select
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                            >
                                <option value="Doctor">Doctor</option>

                                {departments
                                    .filter(
                                        (department) =>
                                            department.name !== "Doctor"
                                    )
                                    .map((department) => (
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
                            <label>Consultation Fee</label>
                            <input
                                type="number"
                                min="0"
                                name="consultationFee"
                                value={form.consultationFee}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Account Information */}
                <div className="doctor-form-section">
                    <h4>Account Information</h4>

                    <div className="doctor-form-grid">

                        <div className="form-group">
                            <label>Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Doctor username"
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Password {!editing && "*"}
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder={
                                    editing
                                        ? "Enter new password to change"
                                        : "Enter doctor password"
                                }
                                autoComplete="new-password"
                                minLength={6}
                                required={!editing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Confirm Password {!editing && "*"}
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm doctor password"
                                autoComplete="new-password"
                                required={
                                    !editing || Boolean(form.password)
                                }
                            />
                        </div>

                    </div>

                    <p className="form-note">
                        Create an individual username and password for the
                        doctor. Leave the password fields empty when editing
                        to retain the existing password.
                    </p>
                </div>

                {/* Form Buttons */}
                <div className="form-footer">

                    <button
                        type="button"
                        className="admin-secondary-btn"
                        onClick={() => navigate("/admin/doctors")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="admin-primary-btn"
                    >
                        <Save size={17} />

                        {editing
                            ? "Update Doctor"
                            : "Save Doctor"}
                    </button>

                </div>

            </form>
        </section>
    );
}
