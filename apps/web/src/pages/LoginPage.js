import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [tenantName, setTenantName] = useState("");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const { setToken, setUser } = useAuthStore();
    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: (data) => {
            setToken(data.token);
            setUser(data.user);
            navigate("/dashboard");
        },
        onError: (err) => {
            setError(err.message || "Login failed. Please check your credentials.");
        },
    });
    const registerMutation = trpc.auth.register.useMutation({
        onSuccess: (data) => {
            setToken(data.token);
            setUser(data.user);
            navigate("/dashboard");
        },
        onError: (err) => {
            setError(err.message || "Registration failed. Please try again.");
        },
    });
    const validateForm = () => {
        const errors = {};
        if (!email) {
            errors.email = "Email is required";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email";
        }
        if (!password) {
            errors.password = "Password is required";
        }
        else if (password.length < 6 && isSignup) {
            errors.password = "Password must be at least 6 characters";
        }
        if (isSignup) {
            if (!firstName)
                errors.firstName = "First name is required";
            if (!lastName)
                errors.lastName = "Last name is required";
            if (!tenantName)
                errors.tenantName = "Tenant name is required";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!validateForm()) {
            return;
        }
        if (isSignup) {
            registerMutation.mutate({
                email,
                password,
                firstName,
                lastName,
                tenantName,
            });
        }
        else {
            loginMutation.mutate({ email, password });
        }
    };
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #e0e7ff, #f3e8ff)",
        }, children: _jsxs("div", { style: {
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                maxWidth: "400px",
                width: "100%",
                margin: "1rem",
            }, children: [_jsx("h1", { style: { fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#2563eb" }, children: "VenueHub" }), _jsx("p", { style: { color: "#666", marginBottom: "1.5rem", fontSize: "0.875rem" }, children: isSignup ? "Create your account" : "Welcome back" }), error && (_jsxs("div", { style: {
                        background: "#fee2e2",
                        color: "#7f1d1d",
                        padding: "0.75rem",
                        borderRadius: "0.375rem",
                        marginBottom: "1rem",
                        fontSize: "0.875rem",
                        border: "1px solid #fecaca",
                    }, children: ["\u26A0\uFE0F ", error] })), _jsxs("form", { onSubmit: handleSubmit, children: [isSignup && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { marginBottom: "1rem" }, children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }, children: "Tenant Name *" }), _jsx("input", { type: "text", value: tenantName, onChange: (e) => {
                                                setTenantName(e.target.value);
                                                setValidationErrors({ ...validationErrors, tenantName: "" });
                                            }, required: true, style: {
                                                width: "100%",
                                                padding: "0.5rem",
                                                border: validationErrors.tenantName ? "1px solid #ef4444" : "1px solid #d1d5db",
                                                borderRadius: "0.375rem",
                                                boxSizing: "border-box",
                                            } }), validationErrors.tenantName && (_jsx("p", { style: { color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }, children: validationErrors.tenantName }))] }), _jsxs("div", { style: { marginBottom: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }, children: "First Name *" }), _jsx("input", { type: "text", value: firstName, onChange: (e) => {
                                                        setFirstName(e.target.value);
                                                        setValidationErrors({ ...validationErrors, firstName: "" });
                                                    }, required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: validationErrors.firstName ? "1px solid #ef4444" : "1px solid #d1d5db",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } }), validationErrors.firstName && (_jsx("p", { style: { color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }, children: validationErrors.firstName }))] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }, children: "Last Name *" }), _jsx("input", { type: "text", value: lastName, onChange: (e) => {
                                                        setLastName(e.target.value);
                                                        setValidationErrors({ ...validationErrors, lastName: "" });
                                                    }, required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: validationErrors.lastName ? "1px solid #ef4444" : "1px solid #d1d5db",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } }), validationErrors.lastName && (_jsx("p", { style: { color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }, children: validationErrors.lastName }))] })] })] })), _jsxs("div", { style: { marginBottom: "1rem" }, children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }, children: "Email *" }), _jsx("input", { type: "email", value: email, onChange: (e) => {
                                        setEmail(e.target.value);
                                        setValidationErrors({ ...validationErrors, email: "" });
                                    }, required: true, style: {
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: validationErrors.email ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "0.375rem",
                                        boxSizing: "border-box",
                                    } }), validationErrors.email && _jsx("p", { style: { color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }, children: validationErrors.email })] }), _jsxs("div", { style: { marginBottom: "1.5rem" }, children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }, children: "Password *" }), _jsx("input", { type: "password", value: password, onChange: (e) => {
                                        setPassword(e.target.value);
                                        setValidationErrors({ ...validationErrors, password: "" });
                                    }, required: true, style: {
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: validationErrors.password ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "0.375rem",
                                        boxSizing: "border-box",
                                    } }), validationErrors.password && _jsx("p", { style: { color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }, children: validationErrors.password })] }), _jsx("button", { type: "submit", disabled: loginMutation.isPending || registerMutation.isPending, style: {
                                width: "100%",
                                background: "#2563eb",
                                color: "white",
                                padding: "0.75rem",
                                borderRadius: "0.375rem",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600",
                                opacity: loginMutation.isPending || registerMutation.isPending ? 0.7 : 1,
                            }, children: loginMutation.isPending || registerMutation.isPending ? "Loading..." : isSignup ? "Create Account" : "Login" })] }), _jsx("button", { onClick: () => {
                        setIsSignup(!isSignup);
                        setError("");
                        setValidationErrors({});
                    }, style: {
                        width: "100%",
                        marginTop: "1rem",
                        background: "transparent",
                        color: "#2563eb",
                        padding: "0.75rem",
                        border: "1px solid #2563eb",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontWeight: "500",
                    }, children: isSignup ? "Already have an account? Login" : "Don't have an account? Sign up" })] }) }));
}
