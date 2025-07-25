// src/components/LandingPage.jsx
import React from "react";
import CourseList from "./Course/CourseList";

export default function LandingPage() {
  return (
    
    <div className="min-h-screen bg-background text-dark">
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-primary mb-8">Dobrodošli na Learnify</h1>
        <CourseList />
      </main>
    </div>
  );
}
