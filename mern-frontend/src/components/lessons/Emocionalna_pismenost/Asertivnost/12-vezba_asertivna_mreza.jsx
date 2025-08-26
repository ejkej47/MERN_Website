import { useState } from "react";

const skills = [
  "Gledam u oči",
  "Primim kritiku",
  "Uputim kritiku",
  "Primim pohvalu",
  "Uputim pohvalu",
  "Kažem šta zaista mislim",
  "Izrazim svoje neslaganje",
  "Odbijem zahtev",
  "Tražim uslugu",
];

const people = [
  "Partner/supružnik",
  "Roditelji",
  "Braća, sestre",
  "Deca",
  "Rođaci",
  "Roditelji partnera",
  "Prijatelji",
  "Stariji ljudi",
  "Komšije",
  "Poznanici",
  "Nepoznati ljudi",
  "Osobe suprotnog pola",
  "Poslodavci",
  "Kolege, saradnici",
  "Nastavnici, profesori",
  "Službenici",
  "Prodavci",
  "Konobari",
  "Majstori",
  "Doktori",
];

function AssertiveMatrix() {
  const [matrix, setMatrix] = useState(
    Object.fromEntries(
      people.map((person) => [
        person,
        Object.fromEntries(skills.map((skill) => [skill, ""])),
      ])
    )
  );

  const handleChange = (person, skill, value) => {
    setMatrix((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [skill]: value,
      },
    }));
  };

  return (
    <div className="overflow-auto">
      <h2 className="text-2xl font-bold mb-4">🧠 Vežba – Asertivna mreža</h2>
      <p className="mb-4 italic">
        Ocenite od 1 (nemam teškoća) do 5 (imam velike teškoće) koliko vam je
        teško da koristite određene asertivne tehnike u kontaktu sa različitim osobama.
      </p>
      <table className="table-auto border-collapse border w-full text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">Osoba / Tehnika</th>
            {skills.map((skill) => (
              <th key={skill} className="border p-2 bg-gray-100 text-center">{skill}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person}>
              <td className="border p-2 font-medium">{person}</td>
              {skills.map((skill) => (
                <td key={skill} className="border p-1 text-center">
                  <select
                    value={matrix[person][skill]}
                    onChange={(e) => handleChange(person, skill, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="">–</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssertiveMatrix;
