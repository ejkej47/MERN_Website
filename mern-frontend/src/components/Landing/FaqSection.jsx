// src/components/landing/FaqSection.jsx
export default function FaqSection() {
  const faqs = [
    { q: "Da li su kursevi besplatni?", a: "Osnovni moduli su besplatni, dok premium kursevi zahtevaju registraciju." },
    { q: "Kako funkcionišu moduli?", a: "Svaki modul se sastoji od lekcija i praktičnih zadataka koje možeš pratiti sopstvenim tempom." },
    { q: "Koliko vremena je potrebno?", a: "Većina modula traje 1–2 sata, ali možeš ih završavati svojim ritmom." },
  ];

  return (
    <section className="bg-surface py-16 border-t border-borderSoft">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-text text-center">Česta pitanja</h2>
        <div className="mt-12 space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="p-6 rounded-xl bg-background border border-borderSoft">
              <h3 className="text-lg font-semibold text-text">{f.q}</h3>
              <p className="mt-2 text-mutedSoft">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
