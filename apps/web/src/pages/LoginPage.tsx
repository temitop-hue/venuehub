import React, { useState } from "react";
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { setToken, setUser } = useAuthStore();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.message || "Login failed. Please check your credentials.");
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.message || "Registration failed. Please try again.");
    },
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6 && isSignup) {
      errors.password = "Password must be at least 6 characters";
    }

    if (isSignup) {
      if (!firstName) errors.firstName = "First name is required";
      if (!lastName) errors.lastName = "Last name is required";
      if (!tenantName) errors.tenantName = "Tenant name is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #e0e7ff, #f3e8ff)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          margin: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#2563eb" }}>VenueHub</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          {isSignup ? "Create your account" : "Welcome back"}
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#7f1d1d",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              border: "1px solid #fecaca",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>
                  Tenant Name *
                </label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => {
                    setTenantName(e.target.value);
                    setValidationErrors({ ...validationErrors, tenantName: "" });
                  }}
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: validationErrors.tenantName ? "1px solid #ef4444" : "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    boxSizing: "border-box",
                  }}
                />
                {validationErrors.tenantName && (
                  <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{validationErrors.tenantName}</p>
                )}
              </div>

              <div style={{ marginBottom: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setValidationErrors({ ...validationErrors, firstName: "" });
                    }}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: validationErrors.firstName ? "1px solid #ef4444" : "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                  {validationErrors.firstName && (
                    <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setValidationErrors({ ...validationErrors, lastName: "" });
                    }}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: validationErrors.lastName ? "1px solid #ef4444" : "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                  {validationErrors.lastName && (
                    <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{validationErrors.lastName}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors({ ...validationErrors, email: "" });
              }}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: validationErrors.email ? "1px solid #ef4444" : "1px solid #d1d5db",
                borderRadius: "0.375rem",
                boxSizing: "border-box",
              }}
            />
            {validationErrors.email && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{validationErrors.email}</p>}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors({ ...validationErrors, password: "" });
              }}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: validationErrors.password ? "1px solid #ef4444" : "1px solid #d1d5db",
                borderRadius: "0.375rem",
                boxSizing: "border-box",
              }}
            />
            {validationErrors.password && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{validationErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending || registerMutation.isPending}
            style={{
              width: "100%",
              background: "#2563eb",
              color: "white",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              opacity: loginMutation.isPending || registerMutation.isPending ? 0.7 : 1,
            }}
          >
            {loginMutation.isPending || registerMutation.isPending ? "Loading..." : isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setValidationErrors({});
          }}
          style={{
            width: "100%",
            marginTop: "1rem",
            background: "transparent",
            color: "#2563eb",
            padding: "0.75rem",
            border: "1px solid #2563eb",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
