import React, { useState } from "react";
import "../style/Register.scss";
import Footer from "../ui/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      // Passwords match, you can proceed with form submission
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setPasswordError(
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
      }
      setPasswordError("");
      toast.info("Đang tiến hành đăng ký tài khoản. Vui lòng chờ!");
      // Add form submission logic here
      axios
        .post("http://localhost:8098/users/create", formData)
        .then(() => {
          toast.success(
            "Đăng ký tài khoản thành công! Vui lòng xác thực email!"
          );
          navigate("/");
        })
        .finally(() => {
          setFormData({});
        });
    }
  };

  return (
    <div className="register-ctn">
      <div className="register-header">
        <img src="/images/logo.png" alt="" />
        <h1>ĐĂNG KÝ</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

        <button type="submit">Sign Up</button>
      </form>
      <Footer />
    </div>
  );
}

export default Register;
