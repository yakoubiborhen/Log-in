import React, { Component, useEffect, useState } from "react";
import AdminHome from "./adminHome";
import { Alert } from "react-bootstrap";
import UserHome from "./userHome";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        if (data.data.userType == "Admin") {
          setAdmin(true);
        }
        window.localStorage.setItem("name", data.data.fname);

        setUserData(data.data);

        if (data.data == "token expired") {
          setAlertMessage("Token expired. Please login again");
          setAlertVariant("danger");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      });
  }, []);

  return (
    <div>
      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}
      {admin ? <AdminHome /> : <UserHome userData={userData} />}
    </div>
  );
}
