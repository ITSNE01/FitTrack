import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logo from "../assets/FitTrack-logobw.png";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const success = await register(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center w-100" style={{ maxWidth: "400px", padding: "2rem" }}>
        <div className="d-flex justify-content-end mb-3">
          <img src={logo} alt="FitTrack Logo" style={{ width: "80px" }} />
        </div>
        <h1 className="fw-bold">Hi !</h1>
        <h2 className="fw-bold mb-3">Welcome</h2>
        <p className="text-muted mb-4">Let's create an account</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="text-muted">Must contain a number and at least 6 characters</small>
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold">Sign Up</button>
        </form>
        <p className="mt-4 text-muted">
          Have an account?{" "}
          <span className="fw-bold text-dark" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
