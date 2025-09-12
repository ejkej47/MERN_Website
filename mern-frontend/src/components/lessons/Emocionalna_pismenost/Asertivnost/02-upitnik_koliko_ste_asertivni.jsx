import { useState, useEffect } from "react";
import axiosInstance from "../../../../axiosInstance";
import AssertivenessGraph from "./graf02";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const questions = [
  "Često kažem „da“, iako zapravo želim da kažem „ne“.",
  "Branim svoja prava ne ugrožavajući prava drugih.",
  "Radije krijem svoje misli i osećanja ako osobu ne poznajem dovoljno.",
  "Prilično sam autoritativan i odlučan.",
  "Obično je lakše i pametnije postupiti preko posrednika nego direktno.",
  "Ne bojim se da kritikujem i kažem ljudima šta mislim.",
  "Ne usuđujem se da odbijem zadatke koji očigledno ne odgovaraju mojim sposobnostima i veštinama.",
  "Ne bojim se da iznesem svoje mišljenje čak i pred neprijateljski nastrojenim sagovornicima.",
  "Kada postoji rasprava, radije se povučem da vidim šta će se dogoditi.",
  "Ponekad me optužuju da se protivurečim.",
  "Teško mi je da slušam druge.",
  "Znam kako da se približim uticajnim ljudima; to mi je često bilo korisno.",
  "Smatraju me pametnim i snalažljivim kada je reč o odnosima.",
  "Komuniciram s drugima na osnovu poverenja, a ne dominacije ili računice.",
  "Radije ne tražim pomoć kolega, jer bi mogli da pomisle da nisam dovoljno kompetentan.",
  "Stidljiv/a sam i osećam se sputano kada se suočim s neobičnom situacijom.",
  "Kažu da brzo planem; naljutim se i drugi mi se smeju.",
  "Dobro se snalazim u komunikaciji „lice u lice“.",
  "Često glumim; kako drugačije da postigneš ono što želiš?",
  "Brbljiv/a sam i imam običaj da prekidam druge, a da to ni ne primetim na vreme.",
  "Ambiciozan/a sam i spreman/a da uradim sve što je potrebno da dođem tamo gde želim.",
  "Uopšte znam koga treba da vidim i kada; to je važno ako želiš da uspeš.",
  "U slučaju neslaganja, tražim realne kompromise zasnovane na obostranim interesima.",
  "U raspravi radije iznosim sve karte na sto.",
  "Sklon/a sam odlaganju zadataka.",
  "Često napustim posao pre nego što ga završim.",
  "Uglavnom se predstavljam onakvim/om kakav/va jesam, ne skrivajući svoja osećanja.",
  "Potrebno je mnogo da me neko zastraši.",
  "Zastrašivanje drugih je često dobar način da se osvoji moć.",
  "Kada me neko prevari, znam kako da se osvetim.",
  "Da bih kritikovao/la nekoga, efikasno je optužiti ga da ne poštuje sopstvene principe. Moraće da se složi.",
  "Znam kako da obezbedim lične prednosti zahvaljujući svojoj snalažljivosti.",
  "Znam da budem ono što jesam, a da budem društveno prihvaćen/a u isto vreme.",
  "Kada se ne slažem, trudim se da moje mišljenje bude jasno čujno.",
  "Uvek pazim da ne uznemirim druge.",
  "Teško mi je da se opredelim ili izaberem stranu.",
  "Ne volim da budem jedini/a s drugačijim mišljenjem u grupi; u tom slučaju radije ćutim.",
  "Javni nastup me ne zastrašuje.",
  "Život je stalna borba i promena ravnoteže moći.",
  "Ne bojim se da prihvatim opasne i rizične izazove.",
  "Ponekad je održavanje konflikta efikasnije nego smirivanje tenzija.",
  "Otvorena igra je dobar način da se izgradi poverenje.",
  "Dobro slušam i ne prekidam ljude dok govore.",
  "Uvek dovršim ono što sam odlučio/la da uradim.",
  "Ne bojim se da izrazim svoja osećanja.",
  "Znam kako da privolim ljude da prihvate moje ideje.",
  "Malo laskanja je i dalje dobar način da dobiješ ono što želiš.",
  "Teško mi je da kontrolišem vreme koje zauzmem dok govorim.",
  "Znam da dam ironične primedbe.",
  "Prijatan/a sam i druželjubiv/a, ali ponekad me drugi iskorišćavaju.",
  "Radije posmatram nego učestvujem.",
  "Više volim da budem u pozadini nego u prvom planu.",
  "Ne mislim da je manipulacija efikasno rešenje.",
  "Ne treba prebrzo otkrivati svoje namere, to je nespretno.",
  "Često šokiram ljude svojim predlozima i mislima.",
  "Radije bih bio/bila vuk nego jagnje.",
  "Manipulisanje drugima je često jedini praktičan način da se postigne ono što želiš.",
  "Znam kako da efikasno protestujem, bez preterane agresije.",
  "Smatram da se problemi ne mogu rešiti bez traženja njihovih uzroka.",
  "Ne volim da drugi loše misle o meni."
];

// Mapiranje pitanja na kategorije (svaka ima 15 pitanja)
const scoringMap = {
  flight:       [1, 7, 15, 16, 17, 25, 26, 35, 36, 37, 50, 51, 52, 59, 60],
  attack:       [4, 6, 10, 11, 20, 21, 28, 29, 30, 39, 40, 48, 49, 55, 56],
  manipulation: [3, 5, 9, 12, 13, 19, 22, 31, 32, 41, 42, 46, 47, 54, 57],
  harmonious:   [2, 8, 14, 18, 23, 24, 27, 33, 34, 38, 43, 44, 45, 53, 58],
};

const QUIZ_KEY = "assertiveness_v1";

function AssertivenessQuestionnaire() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // 👈 nova opcija

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const calculateScores = () => {
    const scores = { flight: 0, attack: 0, manipulation: 0, harmonious: 0 };

    Object.entries(scoringMap).forEach(([attitude, indices]) => {
      indices.forEach((qNum) => {
        if (answers[qNum - 1] === "true") {
          scores[attitude]++;
        }
      });
    });

    return scores;
  };

  const handleSubmit = async () => {
    const calculated = calculateScores();
    setScores(calculated);
    setSubmitted(true);
    setSaving(true);
    setError("");

    try {
      await axiosInstance.post("/quiz-results", {
        quizKey: QUIZ_KEY,
        ...calculated,
      });
      fetchHistory();
    } catch (err) {
      console.error("❌ Error saving result:", err);
      setError("Failed to save result. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get(`/quiz-results/${QUIZ_KEY}/history`);
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error("❌ Error fetching history:", err);
    }
  };

  useEffect(() => {
    if (showHistory || submitted) {
      fetchHistory();
    }
  }, [showHistory,submitted]);

  return (
    <div className="max-w-5xl mx-auto p-2">

      {/* Dugme za otvaranje istorije bez submitovanja */}
      <div className="mb-6">
        <button
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-md"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Sakrij istoriju" : "Prikaži istoriju rezultata"}
        </button>
      </div>

      {showHistory ? (
        <div className="mt-6 space-y-8">
          <h3 className="text-lg font-semibold mb-4">Istorija rezultata</h3>
          {!history.length ? (
            <p className="text-sm text-muted">Nema prethodnih rezultata.</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              slidesPerView={1}
              initialSlide={0}
              className="pb-12 px-20"
            >
              {history.map((res) => (
                <SwiperSlide key={res.id}>
                  <div className="rounded-xl border border-borderSoft bg-surface p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-2xl font-bold text-text">
                        {new Date(res.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-lg text-gray-600">
                        {new Date(res.created_at).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <AssertivenessGraph scores={res} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      ) : !submitted ? (
        <>
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="mb-6 p-4 border border-border rounded-xl shadow-sm bg-surface"
            >
              <p className="font-semibold text-lg text-text mb-3">
                {idx + 1}. {q}
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswer(idx, "true")}
                  className={`px-5 py-2 rounded-lg border font-medium transition 
                    ${answers[idx] === "true"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:bg-[var(--border-soft)]"}`}
                >
                  Uglavnom tačno
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer(idx, "false")}
                  className={`px-5 py-2 rounded-lg border font-medium transition 
                    ${answers[idx] === "false"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:bg-[var(--border-soft)]"}`}
                >
                  Uglavnom netačno
                </button>
              </div>
            </div>
          ))}
          <button
            className="bg-accent text-black px-6 py-2 rounded-md mt-6"
            onClick={handleSubmit}
          >
            Pošalji
          </button>
        </>
      ) : null}

      {/* Stilovi za strelice */}
      <style>{`
      
        .swiper-button-prev,
        .swiper-button-next {
          color: black !important;
          width: 48px;
          height: 48px;
        }
        .swiper-button-prev {
          left: 0 !important;
        }
        .swiper-button-next {
          right: 0 !important;
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 28px !important;
        }
        .dark .swiper-button-prev,
        .dark .swiper-button-next {
          color: white !important;
        }
      `}</style>
    </div>
  );
}

export default AssertivenessQuestionnaire;