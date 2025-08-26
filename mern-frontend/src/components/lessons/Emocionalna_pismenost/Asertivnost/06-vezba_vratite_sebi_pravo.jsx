import { useState } from "react";

const rights = [
  {
    id: 1,
    text: "Ja imam pravo na vrednost i da budem voljen/a.",
    past: "Zabrana na vrijednost i odluka da se ne vrijedi.",
  },
  {
    id: 2,
    text: "Ja imam pravo da postojim.",
    past: "Zabrana postojanja i odluka da se umre.",
  },
  {
    id: 3,
    text: "Ja imam pravo da budem dete.",
    past: "Zabrana na odrastanje i odluka da se ne bude dete.",
  },
  {
    id: 4,
    text: "Ja imam pravo na samostalnost.",
    past: "Zabrana na samostalnost i odluka da se ostane uz roditelje.",
  },
  {
    id: 5,
    text: "Ja imam pravo da mislim svojom glavom.",
    past: "Zabrana na mišljenje i odluka da se ne misli svojom glavom.",
  },
  {
    id: 6,
    text: "Ja imam pravo na uspeh.",
    past: "Zabrana na uspeh i odluka da se bude neuspešan.",
  },
  {
    id: 7,
    text: "Ja imam pravo da osećam svoja osećanja.",
    past: "Zabrana na osećanje i odluka da se ne oseća osećanje.",
  },
  {
    id: 8,
    text: "Ja imam pravo da verujem ljudima.",
    past: "Zabrana na povjerenje i odluka da se nikom ne vjeruje.",
  },
  {
    id: 9,
    text: "Ja imam pravo na bliskost.",
    past: "Zabrana na bliskost i odluka da se ne ulazi u bliske veze.",
  },
  {
    id: 10,
    text: "Ja imam pravo na svoju seksualnost.",
    past: "Zabrana na seksualnost i odluka da se bude aseksualen.",
  },
  {
    id: 11,
    text: "Ja imam pravo da budem slab i bolestan.",
    past: "Zabrana na bolest i slabost i odluka da se uvijek bude zdrav.",
  },
  {
    id: 12,
    text: "Ja imam pravo da budem zdrav.",
    past: "Zabrana na zdravlje i odluka da se bude bolestan.",
  },
];

const demands = [
  {
    id: 13,
    text: "Ja imam pravo da ne budem savršen/a.",
    past: "Budi savršen.",
  },
  {
    id: 14,
    text: "Ja imam pravo da budem slab/a.",
    past: "Budi jak.",
  },
  {
    id: 15,
    text: "Ja imam pravo da se odmaram i uživam.",
    past: "Radi naporno.",
  },
  {
    id: 16,
    text: "Ja imam pravo da ne ugađam svima.",
    past: "Ugađaj drugima.",
  },
  {
    id: 17,
    text: "Ja imam pravo da ne ispunjavam sve svoje želje odmah.",
    past: "Ugađaj sebi.",
  },
  {
    id: 18,
    text: "Ja imam pravo da ne uspem u svemu.",
    past: "Moram uspeti.",
  },
  {
    id: 19,
    text: "Ja imam pravo da usporim.",
    past: "Budi brz.",
  },
];

export default function SelfRightsExercise() {
  const [pastChecked, setPastChecked] = useState({});
  const [nowChecked, setNowChecked] = useState({});

  const toggle = (id, type) => {
    const setter = type === "past" ? setPastChecked : setNowChecked;
    const current = type === "past" ? pastChecked : nowChecked;
    setter({ ...current, [id]: !current[id] });
  };

  const isPride = (id) => pastChecked[id] && !nowChecked[id];
  const isRightToRegain = (id) => nowChecked[id];

  const allItems = [...rights, ...demands];

  return (
    <div className="p-4">

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Zabrane i zahtevi iz prošlosti</h3>
          {allItems.map((item) => (
            <div key={item.id} className="mb-2">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={pastChecked[item.id] || false}
                  onChange={() => toggle(item.id, "past")}
                />
                {item.past}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Zabrane i zahtevi danas</h3>
          {allItems.map((item) => (
            <div key={item.id} className="mb-2">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={nowChecked[item.id] || false}
                  onChange={() => toggle(item.id, "now")}
                />
                {item.past}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-green-600">PONOSAN/NA SAM na osvojena prava na:</h3>
          <ul className="list-disc ml-5 mb-4">
            {allItems
              .filter((item) => isPride(item.id))
              .map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
          </ul>

          <h3 className="font-semibold text-red-600">VRATITE SEBI PRAVO:</h3>
          <ul className="list-disc ml-5">
            {allItems
              .filter((item) => isRightToRegain(item.id))
              .map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
