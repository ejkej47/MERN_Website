// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { BookOpen, Info, Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-borderSoft mt-auto">
      <div className="container mx-auto px-6 py-8">
        {/* Wrapper flex */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 text-center md:text-left">
          
          {/* Brend */}
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/favicon.png"
                alt="Emocionalna pismenost logo"
                className="h-9 w-9 rounded-md"
              />
              <span className="text-lg font-bold text-text">
                Emocionalna pismenost
              </span>
            </Link>
            <p className="text-mutedSoft text-sm max-w-xs">
              Podrška, znanje i rast — svojim tempom.
            </p>
          </div>

          {/* Navigacija */}
          <div className="flex flex-col space-y-2 items-center md:items-center">
            <h4 className="text-base font-semibold text-text mb-1">Navigacija</h4>
            <Link to="/" className="flex items-center gap-2 text-muted hover:text-accent transition">
              <Home size={16} /> Početna
            </Link>
            <Link to="/courses" className="flex items-center gap-2 text-muted hover:text-accent transition">
              <BookOpen size={16} /> Kursevi
            </Link>
            <Link to="/about" className="flex items-center gap-2 text-muted hover:text-accent transition">
              <Info size={16} /> O nama
            </Link>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <h3 className="text-lg font-bold text-text">Pridruži se zajednici</h3>
            <p className="text-mutedSoft text-sm max-w-xs text-center md:text-right">
              Nauči nove veštine, unapredi znanje i poveži se sa drugima.
            </p>
            <Link
              to="/register"
              className="bg-accent text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-hover transition"
            >
              Registruj se sada
            </Link>
          </div>
        </div>

        {/* Donji deo */}
        <div className="mt-8 pt-4 border-t border-borderSoft text-center text-xs text-muted">
          © {new Date().getFullYear()} Emocionalna pismenost. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}
