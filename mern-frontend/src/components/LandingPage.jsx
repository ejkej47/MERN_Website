// src/components/LandingPage.jsx
import React, { useState } from "react";
import CourseList from "./Course/CourseList";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";
import LoginWithGoogle from "./LoginWithGoogle";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register" | "forgot"

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 320, padding: 20, borderRight: "1px solid #ccc", boxSizing: "border-box" }}>
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab("login")}
            style={{ 
              display: "block", width: "100%", padding: 10,
              background: activeTab === "login" ? "#ddd" : "transparent",
              border: "none", cursor: "pointer"
            }}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            style={{ 
              display: "block", width: "100%", padding: 10,
              background: activeTab === "register" ? "#ddd" : "transparent",
              border: "none", cursor: "pointer"
            }}
          >
            Register
          </button>
          <button
            onClick={() => setActiveTab("forgot")}
            style={{ 
              display: "block", width: "100%", padding: 10,
              background: activeTab === "forgot" ? "#ddd" : "transparent",
              border: "none", cursor: "pointer"
            }}
          >
            Forgot Password
          </button>
        </div>

        {activeTab === "login" && (
          <>
            <LoginForm />
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <LoginWithGoogle />
            </div>
          </>
        )}
        {activeTab === "register" && <RegisterForm />}
        {activeTab === "forgot" && <ForgotPassword />}
      </div>

      {/* Content: Kurs list */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        <h1>Dobrodošli na Learnify</h1>
        <CourseList />
      </div>
    </div>
  );
}
