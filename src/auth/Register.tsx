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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div
      className="d-flex min-vh-100 position-relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingLeft: "7%",
        paddingRight: "20%",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {/* White Logo */}
      <img
        src={whiteLogo}
        alt="FitTrack Logo"
        style={{
          position: "absolute",
          bottom: "30px",
          left: "30px",
          width: "100px",
          zIndex: 1,
        }}
      />

      {/* Form */}
      <div
        className="bg-white p-5 rounded-4 shadow"
        style={{
          width: "100%",
          maxWidth: "400px",
          zIndex: 2,
        }}
      >
        <h2 className="fw-bold">Hi !</h2>
        <h2 className="fw-bold mb-3">Welcome</h2>
        <p className="text-muted mb-4">Let's create an account</p>

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
            <small className="text-muted">
              Must contain a number and at least 6 characters
            </small>
          </div>

          <button type="submit" className="btn btn-dark w-100 fw-bold">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
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
