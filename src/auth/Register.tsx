import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import loginBg from "../assets/images/FitTrack-LoginBg.png";
import whiteLogo from "../assets/images/FitTrack-LogoW.png";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const success = await register(username, password);
    if (success) navigate("/dashboard");
    else setError("Registration failed.");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <img
        src={whiteLogo}
        alt="FitTrack Logo"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          width: "100px",
        }}
      />

      <div
        className="p-5"
        style={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 className="fw-bold mb-0" style={{ fontSize: "2.5rem" }}>
          Hi !
        </h1>
        <h2 className="fw-bold mb-2" style={{ fontSize: "2.5rem" }}>
          Welcome
        </h2>
        <p className="text-muted mb-4">Let’s create an account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <small className="text-muted mb-3 d-block">
            Must contain a number and least of 6 characters
          </small>

          <input
            type="password"
            className="form-control mb-1"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <small className="text-muted mb-3 d-block">
            Must contain a number and least of 6 characters
          </small>

          <button type="submit" className="btn btn-dark w-100">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-muted">
          Have an account?{" "}
          <Link to="/login" className="fw-bold text-dark">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
