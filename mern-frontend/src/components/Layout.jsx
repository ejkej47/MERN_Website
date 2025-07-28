import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  return (
    <>
      <header className="container mx-auto px-4">
        <Navbar />
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}
