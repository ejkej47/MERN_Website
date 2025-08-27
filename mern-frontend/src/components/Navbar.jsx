import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef();

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-background border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <img 
          src="/Untitled (512 x 512 px).png" 
          alt="Logo" 
          className="w-32 h-32"
        />

        {/* Hamburger meni za mobilni prikaz */}
        <div className="md:hidden">
          <button
            ref={triggerRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Desktop navigacija */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/courses" className="text-sm text-dark hover:text-primary">
            Kursevi
          </Link>
          {user && (
            <Link to="/my-courses" className="text-sm text-dark hover:text-primary">
              Moji Kursevi
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="flex items-center space-x-2 group">
                {user.image && (
                  <img
                    src={user.image}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-dark group-hover:underline">
                  {user.email}
                </span>
              </Link>
              <button
                onClick={handleLogout}
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

      {/* Mobilni dropdown meni (ako je otvoren) */}
      {menuOpen && (
        <MobileMenu user={user} setMenuOpen={setMenuOpen} handleLogout={handleLogout} triggerRef={triggerRef}/>
      )}
    </nav>
  );
}
