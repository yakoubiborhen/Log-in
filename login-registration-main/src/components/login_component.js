import React, { useState } from "react";
import { Alert } from "react-bootstrap";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);
    fetch("http://localhost:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          setShowAlert(true);
          setAlertMessage("Login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);

          setTimeout(() => {
            setShowAlert(false);
            window.location.href = "./userDetails";
          }, 2000); // Hide the alert after 2 seconds
        } else {
          setShowAlert(true);
          setAlertMessage("Invalid email or password !");

        }
      });
  }

  return (
    <div className="container1">
              {showAlert && (
            <Alert variant={alertMessage === "Invalid email or password !" ? "danger" : "success"} onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          )}
      <div className="auth-wrapper">
        <div className="auth-inner">

          <form onSubmit={handleSubmit}>
            <h3>Sign In</h3>

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
              autoComplete="on"
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
              autoComplete="on"
            />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <div className="d-flex justify-content-between">
            <div className="btn-box">
                <button type="button" className="btn btn-link" onClick={() => window.location.href = "/sign-up"}>
                  Sign Up
                </button>
              </div>
              <div className="btn-box">
                <button type="button" className="btn btn-link" onClick={() => window.location.href = "/reset"}>
                  Forget password
                </button>
              </div>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}
