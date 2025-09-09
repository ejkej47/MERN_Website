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
    "text-sm text-muted hover:text-text transition-colors relative";
  const btnBase =
    "px-4 py-2 text-sm rounded-xl transition duration-200 font-medium";

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b border-borderSoft bg-background transition-all ${
          isScrolled ? "py-2 shadow-sm" : "py-4"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="Logo" className="h-9 w-9 rounded-md" />
          </Link>

          {/* Desktop navigacija */}
          <div className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "text-text after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:bg-accent after:content-['']"
                    : ""
                }`
              }
            >
              Kursevi
            </NavLink>

            {user && (
              <NavLink
                to="/my-courses"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "text-text after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:bg-accent after:content-['']"
                      : ""
                  }`
                }
              >
                Moji kursevi
              </NavLink>
            )}

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-text hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Promeni temu"
              title={theme === "dark" ? "Svetla tema" : "Tamna tema"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="group flex max-w-[220px] items-center gap-2"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-borderSoft"
                    />
                  ) : (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-surface ring-2 ring-borderSoft">
                      <span className="text-xs text-muted">👤</span>
                    </div>
                  )}
                  <span className="truncate text-sm text-text/80 group-hover:text-text">
                    {user.email}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className={`${btnBase} border border-borderSoft bg-surface text-text hover:bg-background`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>

                <button
                  onClick={() => navigate("/login")}
                  className={`${btnBase} bg-accent text-black hover:bg-accent-hover`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className={`${btnBase} bg-primary text-white hover:bg-primary-hover`}
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-text hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Promeni temu"
              title={theme === "dark" ? "Svetla tema" : "Tamna tema"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              ref={triggerRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-borderSoft text-text hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobilni dropdown */}
        {menuOpen && (
          <MobileMenu
            user={user}
            setMenuOpen={setMenuOpen}
            handleLogout={handleLogout}
            triggerRef={triggerRef}
          />
        )}
      </nav>

      {/* Spacer da sadržaj ne bude ispod fiksiranog navbara */}
      <div className="h-16 md:h-20" aria-hidden />
    </>
  );
}
