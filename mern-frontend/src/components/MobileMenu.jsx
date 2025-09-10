// src/components/MobileMenu.jsx
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function MobileMenu({ user, setMenuOpen, handleLogout, triggerRef }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // ✅ Zatvaranje na klik van panela
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !(triggerRef?.current?.contains(event.target))
      ) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [triggerRef]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeMenu}
      />

      {/* Side drawer */}
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 z-50 w-3/4 max-w-xs bg-surface border-l border-borderSoft shadow-xl p-6 flex flex-col"
      >
        {/* 👤 Profil link (ikonica + tekst) */}
        {user && (
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 mb-4 pb-4 border-b border-borderSoft hover:bg-background rounded-lg p-2 transition"
          >
            <User size={22} className="text-text" />
            <span className="text-lg text-text">Profil</span>
          </Link>
        )}

        {/* 📁 Navigacija */}
        <nav className="flex flex-col space-y-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-lg text-text hover:text-accent"
          >
            Početna
          </Link>
          <hr className="border-borderSoft" />

          <Link
            to="/courses"
            onClick={closeMenu}
            className="text-lg text-text hover:text-accent"
          >
            Kursevi
          </Link>
          <hr className="border-borderSoft" />

          {user && (
            <>
              <Link
                to="/my-courses"
                onClick={closeMenu}
                className="text-lg text-text hover:text-accent"
              >
                Moji kursevi
              </Link>
              <hr className="border-borderSoft" />
            </>
          )}

          <Link
            to="/about"
            onClick={closeMenu}
            className="text-lg text-text hover:text-accent"
          >
            O nama
          </Link>
        </nav>

        {/* 🔐 Autentifikacija */}
        <div className="mt-6 pt-4 border-t-2 border-border flex flex-col space-y-4">
          {user ? (
            <button
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              className="w-full text-left text-lg font-medium text-red-500 hover:underline"
            >
              Odjava
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
                className="w-full rounded-lg px-4 py-2 text-lg font-medium bg-primary text-white hover:bg-primary-hover transition"
              >
                Prijava
              </button>
              <hr className="border-borderSoft" />
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/register");
                }}
                className="w-full rounded-lg px-4 py-2 text-lg font-medium bg-accent text-black hover:bg-accent-hover transition"
              >
                Registracija
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
