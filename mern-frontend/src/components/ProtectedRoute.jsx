// src/components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Zaštićena ruta za korisnike koji su prijavljeni.
 * Može se koristiti i za redirekciju neprijavljenih korisnika.
 *
 * @param {ReactNode} children - Komponente koje treba prikazati
 * @param {boolean} requireAuth - Da li ruta zahteva login (default: true)
 */
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Čekamo da se završi inicijalni fetchUser()
  if (loading) {
    return <LoadingSpinner className="h-screen" />;
  }

  // ❌ Ako ruta zahteva login, a korisnik nije prijavljen
  if (requireAuth && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // da zna gde da se vrati posle
      />
    );
  }

  // ✅ Ako sve prolazi, renderuj decu
  return children;
};

export default ProtectedRoute;
