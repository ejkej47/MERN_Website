import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // ✅ import footer

export default function Layout() {
  return (
    <>
      {/* Header */}
      <header className="container mx-auto px-4">
        <Navbar />
      </header>

      {/* Glavni sadržaj */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
