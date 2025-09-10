// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef();
  const [isScrolled, setIsScrolled] = useState(false);

  // ========== THEME ==========
  const getInitialTheme = () => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // shrink efekat
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase =
    "text-base text-muted hover:text-text transition-colors relative";
  const activeLink =
    "text-text underline decoration-accent decoration-2 underline-offset-4";
  const btnBase =
    "px-4 py-2 text-base rounded-xl transition duration-200 font-medium";

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b border-borderSoft bg-background transition-all ${
          isScrolled ? "py-2 shadow-md" : "py-4"
        }`}
      >
        <div className="container mx-auto relative flex items-center justify-between px-4">
          {/* Leva zona */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/favicon.png"
                alt="Logo"
                className="h-9 w-9 rounded-md"
              />
            </Link>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : ""}`
              }
            >
              Početna
            </NavLink>
          </div>

          {/* Srednja zona */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : ""}`
              }
            >
              Kursevi
            </NavLink>

            {user && (
              <NavLink
                to="/my-courses"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Moji kursevi
              </NavLink>
            )}

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : ""}`
              }
            >
              O nama
            </NavLink>
          </div>

          {/* Desna zona */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-text hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Promeni temu"
              title={theme === "dark" ? "Svetla tema" : "Tamna tema"}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="group flex items-center gap-2"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Avatar"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-borderSoft"
                    />
                  ) : (
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-surface ring-2 ring-borderSoft">
                      <span className="text-sm text-muted">👤</span>
                    </div>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className={`${btnBase} border border-borderSoft bg-surface text-text hover:bg-background`}
                >
                  Odjava
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className={`${btnBase} bg-primary text-white hover:bg-primary-hover`}
                >
                  Prijava
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className={`${btnBase} bg-accent text-black hover:bg-accent-hover`}
                >
                  Registracija
                </button>
              </>
            )}
          </div>

          {/* Mobile: tema + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-text hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Promeni temu"
              title={theme === "dark" ? "Svetla tema" : "Tamna tema"}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              ref={triggerRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-text hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Otvori meni"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobilni meni */}
        {menuOpen && (
          <MobileMenu
            user={user}
            setMenuOpen={setMenuOpen}
            handleLogout={handleLogout}
            triggerRef={triggerRef}
          />
        )}
      </nav>

      <div className="h-16 md:h-20" aria-hidden />
    </>
  );
}
