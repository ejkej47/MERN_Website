// src/components/Navbar.jsx
import React, { useState, useRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
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

  const linkBase =
    "text-sm text-slate-300 hover:text-accent transition-colors";
  const btnBase =
    "px-4 py-2 text-sm rounded-xl transition duration-200";

  return (
   <nav className="absolute top-0 left-0 w-full z-50 bg-background/40 backdrop-blur-md ...">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/favicon.png"
            alt="Logo"
            className="w-10 h-10 rounded-md"
          />
        </Link>

        {/* Hamburger za mobilni */}
        <div className="md:hidden">
          <button
            ref={triggerRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Desktop navigacija */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "text-accent" : ""}`
            }
          >
            Kursevi
          </NavLink>

          {user && (
            <NavLink
              to="/my-courses"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-accent" : ""}`
              }
            >
              Moji kursevi
            </NavLink>
          )}

          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 group">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center ring-2 ring-white/10">
                    <span className="text-xs text-slate-300">👤</span>
                  </div>
                )}
                <span className="text-sm text-slate-200 group-hover:underline truncate max-w-[160px]">
                  {user.email}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className={`${btnBase} bg-white/10 hover:bg-white/15 text-white border border-white/10`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`${btnBase} bg-primary text-white hover:bg-primary-hover`}
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className={`${btnBase} bg-accent text-black hover:bg-accent-hover`}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobilni dropdown meni */}
      {menuOpen && (
        <MobileMenu
          user={user}
          setMenuOpen={setMenuOpen}
          handleLogout={handleLogout}
          triggerRef={triggerRef}
        />
      )}
    </nav>
  );
}
