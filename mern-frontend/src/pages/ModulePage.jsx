import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import ModuleLessonList from "../components/Module/ModuleLessonList";
import LessonContent from "../components/CourseDetail/LessonContent";
import ModuleInfo from "../components/Module/ModuleInfo";

function ModulePage() {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch module and lessons
  useEffect(() => {
    setLoading(true);

    axiosInstance.get(`/modules/${moduleId}`)
      .then(res => {
        setModule(res.data.module);
        setLessons(res.data.lessons);

        const lastLessonId = localStorage.getItem(`lastLesson-module-${moduleId}`);
        if (lastLessonId) {
          const found = res.data.lessons.find((l) => String(l.id) === lastLessonId);
          if (found && !found.isLocked) {
            setSelectedLesson(found);
          }
        }
      })
      .catch(err => {
        console.error("Greška pri dohvatu modula:", err);
        toast.error("Greška pri dohvatu modula.");
      })
      .finally(() => setLoading(false));
  }, [moduleId]);

  const handlePurchaseModule = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni da biste kupili modul.");
      return navigate("/login", { state: { from: `/modules/${moduleId}` } });
    }

    try {
      const res = await axiosInstance.post(`/purchase/module/${moduleId}`);
      toast.success(res.data.message || "Modul otključan!");

      const refetch = await axiosInstance.get(`/modules/${moduleId}`);
      setModule(refetch.data.module);
      setLessons(refetch.data.lessons);
      setSelectedLesson(null);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Greška pri kupovini modula.";
      console.error("❌ Greška pri kupovini modula:", message);
      toast.error(message);
    }
  };

  if (!module) return <p className="p-4 text-gray-600">Učitavanje modula...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6 p-4">
      {/* Sidebar: info + lista lekcija */}
      <div className="hidden md:flex md:flex-col md:col-span-1 space-y-6">
        <ModuleInfo
          module={module}
          handlePurchase={handlePurchaseModule}
        />

        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Lekcije</h3>
          <ModuleLessonList
            lessons={lessons}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            moduleId={moduleId}
            loading={loading}
          />
        </div>
      </div>

      {/* Glavni sadržaj */}
      <div className="hidden md:block md:col-span-2 bg-white p-4 rounded shadow-sm">
        <LessonContent selectedLesson={selectedLesson} />
      </div>

      {/* Mobilni prikaz */}
      <div className="md:hidden flex flex-col space-y-6 mt-4">
        <LessonContent selectedLesson={selectedLesson} />
        <ModuleInfo
          module={module}
          handlePurchase={handlePurchaseModule}
        />
      </div>
    </div>
  );
}

export default ModulePage;
