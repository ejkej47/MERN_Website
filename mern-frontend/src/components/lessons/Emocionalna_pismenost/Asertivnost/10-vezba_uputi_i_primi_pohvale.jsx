import { useState } from "react";

function ComplimentExercise() {
  const [selfCompliments, setSelfCompliments] = useState(Array(7).fill(""));
  const [othersCompliments, setOthersCompliments] = useState({
    partner: "",
    children: "",
    friends: "",
    colleagues: "",
  });
  const [behaviorPraise, setBehaviorPraise] = useState({
    partner: "",
    children: "",
    friends: "",
    colleagues: "",
  });
  const [receivedFeelings, setReceivedFeelings] = useState("");

  return (
    <div className="space-y-8">

      {/* Pohvale sebi */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Pohvale svom biću</h3>
        <p className="mb-4">
          Razmislite i napišite **sedam pohvala** za sebe. Stanite ispred ogledala
          i ponavljajte ih glasno dok se ne budete osećali prijatno.
        </p>
        {selfCompliments.map((value, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Pohvala ${index + 1}`}
            value={value}
            onChange={(e) => {
              const updated = [...selfCompliments];
              updated[index] = e.target.value;
              setSelfCompliments(updated);
            }}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
        ))}
      </div>

      {/* Pohvale drugima */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Pohvale za druge osobe</h3>
        <p className="mb-4">
          Razmislite o pozitivnim osobinama bliskih ljudi i napišite im po jednu
          pohvalu – a zatim je i uputite u narednim danima.
        </p>
        {Object.entries(othersCompliments).map(([key, value]) => (
          <div key={key}>
            <label className="block capitalize">{key}:</label>
            <input
              type="text"
              placeholder={`Pohvala za ${key}`}
              value={value}
              onChange={(e) =>
                setOthersCompliments({ ...othersCompliments, [key]: e.target.value })
              }
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
      </div>

      {/* Pohvala za ponašanje koje treba da se ponavlja */}
      <div>
        <h3 className="text-xl font-semibold mb-2">
          Pohvale za dobro ponašanje koje želite da se ponavlja
        </h3>
        <p className="mb-4">
          Zapišite kako biste uputili pohvalu osobi kada učini nešto vredno pohvale.
          Primena ove vežbe u narednom periodu može da ojača odnose.
        </p>
        {Object.entries(behaviorPraise).map(([key, value]) => (
          <div key={key}>
            <label className="block capitalize">{key}:</label>
            <input
              type="text"
              placeholder={`Način da pohvalite ponašanje - ${key}`}
              value={value}
              onChange={(e) =>
                setBehaviorPraise({ ...behaviorPraise, [key]: e.target.value })
              }
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
      </div>

      {/* Reakcija na primljenu pohvalu */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Prihvatanje pohvala</h3>
        <p className="mb-4">
          Kada vam neko uputi pohvalu, zahvalite se sa jasnim „Hvala“. Zapišite svoja
          osećanja nakon primanja pohvale.
        </p>
        <textarea
          rows={4}
          placeholder="Kako ste se osećali kada ste primili pohvalu?"
          value={receivedFeelings}
          onChange={(e) => setReceivedFeelings(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
}

export default ComplimentExercise;
