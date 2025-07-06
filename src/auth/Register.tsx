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
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await register(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="d-flex min-vh-100">
      <div
        className="col-7 d-none d-md-block"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <img
          src={whiteLogo}
          alt="FitTrack Logo"
          style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            width: "100px",
          }}
        />
      </div>

      <div className="col-12 col-md-5 d-flex align-items-center justify-content-center bg-white">
        <div style={{ width: "90%", maxWidth: "400px" }}>
          <h2 className="fw-bold">Let's create</h2>
          <h2 className="fw-bold mb-3">Your Account</h2>
          <p className="text-muted mb-4">Fill in your information to continue</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 fw-bold">
              Create Account
            </button>
          </form>

          <p className="text-center mt-4 text-muted">
            Already have an account?{" "}
            <Link to="/login" className="fw-bold text-dark">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
