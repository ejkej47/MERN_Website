import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
      <div>
        <Link to="/" style={{ marginRight: 15 }}>Learnify</Link>
        <Link to="/courses" style={{ marginRight: 15 }}>Kursevi</Link>
        {user && <Link to="/my-courses" style={{ marginRight: 15 }}>Moji Kursevi</Link>}
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: 10 }}>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
