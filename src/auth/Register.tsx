import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import loginBg from "../assets/images/FitTrack-LoginBg.jpg";
import logo from "../assets/images/FitTrack-LogoOfficial.png";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const success = await register(form.username, form.password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Registration failed. Try again.");
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
      {/* Bottom left logo */}
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

      {/* Register Form */}
      <div
        className="bg-white p-5 rounded-4 shadow"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h2 className="fw-bold text-primary">Hi !</h2>
        <h2 className="fw-bold text-primary mb-3">Welcome</h2>
        <p className="text-muted mb-4">Let's create an account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Email or Phone Number"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <small className="text-muted">
              Must contain a number and at least 6 characters
            </small>
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <small className="text-muted">
              Must contain a number and at least 6 characters
            </small>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Have an account?{" "}
          <Link to="/login" className="fw-bold text-primary">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
