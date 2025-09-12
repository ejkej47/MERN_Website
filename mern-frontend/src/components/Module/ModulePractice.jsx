import React from "react";
import ModulePracticeList from "./ModulePracticeList";

export default function ModulePractice({
  moduleSlug,
  lessons = [],
  purchased = false,
  completedLessonIds = [],
  onPickLesson,
}) {
  const quizzes = lessons.filter((l) => l.type === "quiz");
  const exercises = lessons.filter((l) => l.type === "exercise");

  return (
    <div className="space-y-6">
      {quizzes.length > 0 && (
        <ModulePracticeList
          moduleSlug={moduleSlug}
          lessons={quizzes}
          completedLessonIds={completedLessonIds}
          onPickLesson={onPickLesson}
          title="Upitnici"
        />
      )}
      {exercises.length > 0 && (
        <ModulePracticeList
          moduleSlug={moduleSlug}
          lessons={exercises}
          completedLessonIds={completedLessonIds}
          onPickLesson={onPickLesson}
          title="Vežbe"
        />
      )}
      {quizzes.length === 0 && exercises.length === 0 && (
        <p className="text-muted">Nema dodatnih upitnika ili vežbi.</p>
      )}
    </div>
  );
}
