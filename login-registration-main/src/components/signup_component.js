import React, { Component, useState } from "react";
import { Alert } from "react-bootstrap";

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  const handleSubmit = (e) => {
    if (userType == "Admin" && secretKey != "Talan123") {
      e.preventDefault();
      setAlertMessage("Invalid Admin");
      setAlertVariant("danger");
    } else {
      e.preventDefault();

      console.log(fname, lname, email, password);
      fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          email,
          lname,
          password,
          userType,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "userRegister");
          if (data.status == "ok") {
            setAlertMessage("Registration Successful");
            setAlertVariant("success");
          } else {
            setAlertMessage("Registration Failed");
            setAlertVariant("danger");
          }
        });
    }
  };

  return (
  <div className="container1">
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          {alertMessage && (
              <Alert variant={alertVariant}>{alertMessage}</Alert>
            )}
<div className="mb-3 register-as-section">
  <div className="register-as-label">Register As</div>
  <div className="register-as-options">
    <div className="custom-control custom-radio">
      <input
        className="custom-control-input"
        type="radio"
        name="UserType"
        id="userRadio"
        value="User"
        onChange={(e) => setUserType(e.target.value)}
      />
      <label className="custom-control-label" htmlFor="userRadio">
        User
      </label>
    </div>
    <div className="custom-control custom-radio">
      <input
        className="custom-control-input"
        type="radio"
        name="UserType"
        id="adminRadio"
        value="Admin"
        onChange={(e) => setUserType(e.target.value)}
      />
      <label className="custom-control-label" htmlFor="adminRadio">
        Admin
      </label>
    </div>
  </div>
</div>
          {userType == "Admin" ? (
            <div className="mb-3">
              <label>Secret Key</label>
              <input
                type="text"
                className="form-control"
                placeholder="Secret Key"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          ) : null}

          <div className="mb-3">
          <div className="password-input">
          <i className="fa-solid fa-user"></i>
            <label>First name</label>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
            />
          </div>

          <div className="mb-3">
          <div className="password-input">
          <i className="fa-solid fa-user"></i>
            <label>Last name</label>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="mb-3">
          <div className="password-input">
          <i className="fa-solid fa-envelope"></i>
            <label>Email address</label>
            </div>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
          <div className="password-input">
          <i className="fa-solid fa-lock"></i>
            <label>Password</label>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">sign in?</a>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}
