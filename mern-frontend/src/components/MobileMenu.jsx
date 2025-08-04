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
        !(triggerRef?.current?.contains(event.target)) // 👈 Ignoriši klik na trigger dugme
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
      className="absolute right-4 top-16 z-50 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4 space-y-3"
    >
      {/* 👤 Profil info */}
      {user && (
          <>
          <Link
          to="/profile"
          onClick={closeMenu}
          title={user.email}
          className="block hover:bg-gray-100 px-2 py-2 rounded transition"
          >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full font-bold text-lg overflow-hidden">
              {user.image ? (
                  <img
                  src={user.image}
                  alt="Avatar"
                  className="w-10 h-10 object-cover"
                  />
                ) : (
                    user.email[0].toUpperCase()
                )}
            </div>
            <span className="text-sm text-dark">{user.email}</span>
          </div>
        </Link>
        <hr className="border-t border-gray-250 my-2" />
        </>
      )}
      {/* 📁 Navigacija */}
      <Link
        to="/courses"
        onClick={closeMenu}
        className="block text-sm text-dark hover:text-primary"
      >
        Kursevi
      </Link>
      <hr className="border-t border-gray-250 my-2" />
      {user && (
        <Link
          to="/my-courses"
          onClick={closeMenu}
          className="block text-sm text-dark hover:text-primary"
        >
          Moji Kursevi
        </Link>
      )}

      {/* 🔐 Autentifikacija */}
      {user ? (
        <>
      <hr className="border-t border-gray-250 my-2" />
          <button
          onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="block w-full text-left text-sm text-red-600 mt-2 hover:underline"
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
            className="block w-full text-left text-sm text-dark hover:text-primary"
          >
            Login
          </button>
          <hr className="border-t border-gray-250 my-2" />
          <button
            onClick={() => {
              closeMenu();
              navigate("/register");
            }}
            className="block w-full text-left text-sm text-dark hover:text-primary"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}
