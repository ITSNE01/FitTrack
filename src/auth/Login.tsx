import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logo from "../assets/FitTrack-logobw.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password.");
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
        <p className="text-muted mb-4">I'm waiting for you, please enter your detail</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username, Email or Phone Number"
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
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold">Log In</button>
        </form>
        <p className="mt-4 text-muted">
          Don't have an account?{" "}
          <span className="fw-bold text-dark" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
