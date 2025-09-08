// src/components/MobileMenu.jsx
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MobileMenu({ user, setMenuOpen, handleLogout, triggerRef }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // ✅ Zatvaranje na klik van menija
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
    <div
      ref={menuRef}
      className="absolute right-4 top-16 z-50 w-64 rounded-md border border-borderSoft bg-surface p-4 shadow-lg space-y-3"
    >
      {/* 👤 Profil info */}
      {user && (
        <>
          <Link
            to="/profile"
            onClick={closeMenu}
            title={user.email}
            className="block rounded px-2 py-2 transition hover:bg-background"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-white font-bold text-lg">
                {user.image ? (
                  <img src={user.image} alt="Avatar" className="h-10 w-10 object-cover" />
                ) : (
                  user.email[0].toUpperCase()
                )}
              </div>
              <span className="truncate text-sm text-text">{user.email}</span>
            </div>
          </Link>
          <hr className="my-2 border-t border-borderSoft" />
        </>
      )}

      {/* 📁 Navigacija */}
      <Link
        to="/courses"
        onClick={closeMenu}
        className="block text-sm text-text hover:text-accent"
      >
        Kursevi
      </Link>
      <hr className="my-2 border-t border-borderSoft" />

      {user && (
        <Link
          to="/my-courses"
          onClick={closeMenu}
          className="block text-sm text-text hover:text-accent"
        >
          Moji Kursevi
        </Link>
      )}

      {/* 🔐 Autentifikacija */}
      {user ? (
        <>
          <hr className="my-2 border-t border-borderSoft" />
          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="mt-2 block w-full text-left text-sm font-medium text-red-500 hover:underline"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              closeMenu();
              navigate("/login");
            }}
            className="block w-full text-left text-sm text-text hover:text-accent"
          >
            Login
          </button>
          <hr className="my-2 border-t border-borderSoft" />
          <button
            onClick={() => {
              closeMenu();
              navigate("/register");
            }}
            className="block w-full text-left text-sm text-text hover:text-accent"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}
