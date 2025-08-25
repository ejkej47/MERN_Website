import { useState } from "react";

const questions = [
  "I often say “yes”, when I really want to say “no”",
  "I defend my rights without infringing those of others",
  "I prefer to hide my thoughts and feelings if I don’t know the person well enough",
  // ... sve do pitanja 60
];

const scoringMap = {
  passive: [1, 7, 15, 16, 17, 25, 26, 35, 36, 37, 50, 51, 52, 59, 60],
  aggressive: [4, 6, 10, 11, 20, 21, 28, 29, 30, 39, 40, 48, 49, 55, 56],
  manipulative: [3, 5, 9, 12, 13, 19, 22, 31, 32, 41, 42, 46, 47, 54, 57],
  harmonious: [2, 8, 14, 18, 23, 24, 27, 33, 34, 38, 43, 44, 45, 53, 58],
};

function AssertivenessQuestionnaire() {
  const [answers, setAnswers] = useState(Array(60).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const calculateScores = () => {
    const scores = { passive: 0, aggressive: 0, manipulative: 0, harmonious: 0 };

    Object.entries(scoringMap).forEach(([attitude, indices]) => {
      indices.forEach((qNum) => {
        if (answers[qNum - 1] === "true") {
          scores[attitude]++;
        }
      });
    });

    return scores;
  };

  const scores = submitted ? calculateScores() : null;

  return (
    <div className="prose max-w-3xl mx-auto p-4">
      <h2>Assertiveness Self-Assessment Questionnaire</h2>

      {!submitted ? (
        <>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-medium">{idx + 1}. {q}</p>
              <div className="flex gap-4 mt-1">
                <label>
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value="true"
                    checked={answers[idx] === "true"}
                    onChange={() => handleAnswer(idx, "true")}
                  />{" "}
                  Rather true
                </label>
                <label>
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value="false"
                    checked={answers[idx] === "false"}
                    onChange={() => handleAnswer(idx, "false")}
                  />{" "}
                  Rather false
                </label>
              </div>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md mt-6"
            onClick={() => setSubmitted(true)}
            disabled={answers.includes(null)}
          >
            Submit
          </button>
        </>
      ) : (
        <div className="mt-6">
          <h3>Results</h3>
          <ul>
            <li>Passive (flight): {scores.passive} / 15</li>
            <li>Aggressive (attack): {scores.aggressive} / 15</li>
            <li>Manipulative: {scores.manipulative} / 15</li>
            <li>Harmonious assertiveness: {scores.harmonious} / 15</li>
          </ul>
          <button className="mt-4 underline text-blue-600" onClick={() => setSubmitted(false)}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default AssertivenessQuestionnaire;
