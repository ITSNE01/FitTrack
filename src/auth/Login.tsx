import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import loginBg from "../assets/images/FitTrack-LoginBg.jpg";
import logo from "../assets/images/FitTrack-LogoOfficial.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div
      className="d-flex min-vh-100"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: "5%",
        paddingLeft: "5%",
      }}
    >
      {/* Left logo (bottom corner) */}
      <img
        src={logo}
        alt="FitTrack"
        style={{
          position: "absolute",
          bottom: "30px",
          left: "30px",
          width: "100px",
          zIndex: 2,
        }}
      />

      {/* Login Form */}
      <div
        className="bg-white p-5 rounded-4 shadow"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h2 className="fw-bold text-primary">Hi !</h2>
        <h2 className="fw-bold text-primary mb-3">Welcome</h2>
        <p className="text-muted mb-4">
          I'm waiting for you, please enter your detail
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username, Email or Phone Number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y px-3 text-muted"
              role="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Don’t have an account?{" "}
          <Link to="/register" className="fw-bold text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
