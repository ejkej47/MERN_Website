import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <header className="container mx-auto px-4">
        <Navbar />
      </header>
      <Outlet /> {/* umesto <main className="container ..."> */}
    </>
  );
}

