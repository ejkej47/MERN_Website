// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-background border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo & osnovne rute */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold text-primary">
            Learnify
          </Link>
          <Link to="/courses" className="text-sm text-dark hover:text-primary">
            Kursevi
          </Link>
          {user && (
            <Link to="/my-courses" className="text-sm text-dark hover:text-primary">
              Moji Kursevi
            </Link>
          )}
        </div>

        {/* Autentifikacija */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                {user.image && (
                  <img
                    src={user.image}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-dark">{user.email}</span>
              </div>              
              <button
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="px-4 py-2 text-sm bg-dark text-white rounded hover:bg-gray-800"
              >
                Logout
              </button>

            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm bg-accent text-dark rounded hover:bg-accent-hover transition duration-200"
              >
                Login
              </button>

              <button
                 onClick={() => navigate("/register")}
                 className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover transition duration-200"
              >
              Register
            </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}