import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./components/CveTable/CveTable.css"
import "./components/checknews/checknews.css"
import "./components/telegram/telegram.css"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import ImageUpload from "./components/imageUpload.";
import Reset from "./components/reset";
import Dashboard from "./components/dashboard";
import CheckNews from "./components/checknews/checknews";
import CveTable from "./components/CveTable/CveTable";
import MessageComponent from "./components/telegram/telegram";


function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn == "true" ? <UserDetails /> : <Login />}
          />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checknews" element={<CheckNews />} />
          <Route path="/CveTable" element={<CveTable />} />
          <Route path="/telegram" element={<MessageComponent />} />
        </Routes>
        {/* <ImageUpload/> */}
      </div>
    </Router>
  );
}

export default App;
