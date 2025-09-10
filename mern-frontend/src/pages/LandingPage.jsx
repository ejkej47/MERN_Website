// src/components/LandingPage.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

import HeroSection from "../components/landing/HeroSection";
import FeaturedCourseSection from "../components/landing/FeaturedCourseSection";
import BenefitsSection from "../components/landing/BenefitsSection";
import AboutPreviewSection from "../components/landing/AboutPreviewSection";
import FeedbackSection from "../components/landing/FeedbackSection";
import FaqSection from "../components/landing/FaqSection";
import CtaSection from "../components/landing/CtaSection";

export default function LandingPage() {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/courses/slug/emocionalna-pismenost/full-content`)
      .then((res) => {
        setCourse(res.data.course);
        setModules(res.data.modules || []);
      })
      .catch((err) => console.error("❌ Greška pri učitavanju kursa:", err));
  }, []);

  return (
    <div className="bg-background text-text min-h-screen">
      <HeroSection course={course} />
      <FeaturedCourseSection course={course} modules={modules} />
      <BenefitsSection />
      <AboutPreviewSection />
      <FeedbackSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
