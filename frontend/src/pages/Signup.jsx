import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );

      setMsg("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);

    } catch {
      setMsg("User already exists");
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="fw-bold">Task Scheduler</h1>
        <p className="text-muted">Manage your tasks efficiently</p>
      </div>
    <div className="d-flex justify-content-center align-items-center  bg-light">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Signup</h3>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="btn btn-success w-100">
            Signup
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
    </div>
  );
}

export default Signup;