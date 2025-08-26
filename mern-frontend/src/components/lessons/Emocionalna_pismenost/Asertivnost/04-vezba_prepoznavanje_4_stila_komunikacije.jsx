import { useState } from "react";

const situations = [
  {
    description: "Vaš kolega je stigao sat vremena kasnije na poslovnu večeru...",
    responses: [
      "U redu je. Hoćemo da jedemo sada?",
      "Čekao/la sam sat vremena. Značilo bi mi da si mi javio da ćeš kasniti.",
      "Baš imaš obraza da toliko kasniš!",
      "U redu je. (I onda nađete izgovor da odete u svoju sobu...)"
    ],
  },
  {
    description: "Vaša koleginica Suzana konstantno vam daje njen posao...",
    responses: [
      "Veoma sam zauzet/a. Ali ako nisi u mogućnosti da završiš...",
      "„OK“, kažete, i onda se požalite šefu.",
      "Zaboravi. Krajnje je vreme da uradiš svoj posao...",
      "Ne, Suzana. Neću više raditi tvoj deo posla..."
    ],
  },
  {
    description: "Kolega vam je uputio kompliment za vaš novi komad odeće...",
    responses: [
      "Hvala ti.",
      "Hvala. Mogao bi da razmisliš o obnavljanju svoje garderobe...",
      "Pa, kupio/la sam to na rasprodaji.",
      "Imam sreće da mogu da kupim markiranu odeću za moj posao."
    ],
  },
  {
    description: "Vaš pretpostavljeni vam je upravo dao prosečnu ocenu rada...",
    responses: [
      "Razumem. Možda bi obim posla mogao biti manji.",
      "Cenim vaš feedback i voleo/la bih da znam kako mogu unaprediti...",
      "Mislim da vam se ne sviđam. Možda bih trebao/la dati otkaz.",
      "Spustite glavu kao odgovor."
    ],
  },
];

const styles = [
  "Asertivno",
  "Agresivno",
  "Pasivno",
  "Pasivno-agresivno"
];

export default function CommunicationStylesExercise() {
  const [answers, setAnswers] = useState(
    situations.map(() => Array(4).fill(""))
  );

  const handleSelect = (situationIdx, responseIdx, value) => {
    const updated = [...answers];
    updated[situationIdx][responseIdx] = value;
    setAnswers(updated);
  };

  return (
    <div className="prose max-w-4xl mx-auto p-6">
      {situations.map((s, sIdx) => (
        <div key={sIdx} className="mb-8 border-b pb-6">
          <h3 className="text-lg font-medium mb-2">Situacija {sIdx + 1}</h3>
          <p className="mb-4 italic text-lg">{s.description}</p>
        
          {s.responses.map((resp, rIdx) => (
            <div key={rIdx} className="flex items-center gap-4 mb-3">
              <div className="w-2/3 bg-gray-100 p-2 rounded">{String.fromCharCode(97 + rIdx)}. {resp}</div>
              <select
                className="w-1/3 border p-2 rounded"
                value={answers[sIdx][rIdx]}
                onChange={(e) => handleSelect(sIdx, rIdx, e.target.value)}
              >
                <option value="">-- Stil --</option>
                {styles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
