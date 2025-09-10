// src/pages/OnamaPage.jsx

export default function OnamaPage() {
  return (
    <main className="bg-background text-text">
      {/* Hero */}
      <section className="bg-surface border-b border-borderSoft py-16 text-center">
        <div className="container mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-extrabold">O nama</h1>
          <p className="mt-4 text-mutedSoft">
            Emocionalna pismenost okuplja stručnjake iz psihologije,
            psihoterapije i ličnog razvoja, posvećene podršci ljudima u
            razumevanju i unapređenju svojih emocionalnih veština.
          </p>
        </div>
      </section>

      {/* Biografije */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-6 space-y-20">
          {/* Ivana Dragić */}
          <article className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-shrink-0">
              <img
                src="/images/ivana-dragic.png"
                alt="Ivana Dragić"
                className="w-48 h-48 object-cover rounded-full border border-borderSoft shadow-md"
              />
            </div>
            <div className="space-y-6 leading-relaxed text-justify">
              <h2 className="text-2xl font-bold">Ivana Dragić</h2>

              <p>
                <strong>Kratka biografija:</strong> Rođena u Pančevu (Vojvodina,
                Srbija) 1974. godine. Diplomirala psihologiju u Beogradu i
                završila psihoterapijski trening (kod dr Zorana Milivojevića,
                transakciona analiza), kao i brojne treninge iz oblasti mirovnih
                studija i nenasilne komunikacije u zemlji i inostranstvu
                (Kanada, SAD). Od 2008. živi u Beču, gde je doktorirala
                psihoterapijske nauke i završila trening iz sistemske porodične
                terapije.
              </p>

              <p>
                Radi u privatnoj praksi i kao predavač, mentor i istraživač na
                Univerzitetu „Sigmund Frojd“ u Beču. Predaje razvojnu
                psihologiju, diferencijalnu psihopatologiju i metode kvalitativnih
                istraživanja na internacionalnom programu.
              </p>

              <h3 className="text-lg font-semibold mt-6">
                Profesionalno iskustvo
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Naučni saradnik, SFU Beč (2022–danas)</li>
                <li>Predavač i mentor, SFU Beč (2014–2022)</li>
                <li>Psihoterapeut u privatnoj praksi, Beč (2013–danas)</li>
                <li>Psihoterapeut na Univerzitetskoj dnevnoj klinici, Beč (2009–2012)</li>
                <li>Stručnjak za ljudske resurse, Vip Mobile, Beograd (2007–2008)</li>
                <li>Performance manager, Hemofarm, Vršac (2005–2007)</li>
                <li>Školski psiholog, OŠ „Isidora Sekulić“, Pančevo (2002–2005)</li>
                <li>
                  Trener u projektima NVO za nenasilnu komunikaciju i kulturu
                  mira (1999–2005)
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">
                Obrazovanje i stručno usavršavanje
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Doktor psihoterapijskih nauka, SFU Beč (2009–2013)</li>
                <li>Sistemski porodični terapeut, SFU & ÖAS (2009–2013)</li>
                <li>Transakcioni analitičar – savetnik, Psihopolis (2002–2007)</li>
                <li>Diplomirani psiholog, Univerzitet u Beogradu (1994–2002)</li>
                <li>Specijalizovani treninzi: Mirovne studije, Škole mira (Kanada), Super-T (SAD), Projekat Alternative Nasilju (Hrvatska)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">Publikacije</h3>
              <p>
                Objavila naučne radove o psihoterapiji, uključujući model
                <em> Circular Emotional Reaction (CER)</em> i filozofiju
                treninga u međunarodnim programima.
              </p>

              <h3 className="text-lg font-semibold mt-6">
                Prezentacije na konferencijama
              </h3>
              <p>
                Izlagala na brojnim konferencijama u Austriji i Kanadi, uključujući
                teme o psihoterapijskom treningu i kulturi mira u školama.
              </p>
            </div>
          </article>

          {/* Zorica Katić */}
          <article className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-shrink-0">
              <img
                src="/images/zorica-katic.jpg"
                alt="Zorica Katić"
                className="w-48 h-48 object-cover rounded-full border border-borderSoft shadow-md"
              />
            </div>
            <div className="space-y-6 leading-relaxed text-justify">
              <h2 className="text-2xl font-bold">Zorica Katić</h2>

              <h3 className="text-lg font-semibold mt-4">1K – Komunikacija</h3>
              <p>
                Moje najvažnije vrednosti su ljubav, zdravlje i porodica. U
                preseku privatnih i poslovnih vrednosti, na prvom mestu je{" "}
                <strong>komunikacija</strong>. Ceo život usavršavam ovu veštinu
                i pomažem drugima da razvijaju komunikaciju u odnosima.
              </p>

              <h3 className="text-lg font-semibold mt-4">2K – Kreativnost</h3>
              <p>
                Kreativnost, originalnost i autentičnost izražavam pisanjem blog
                postova i kroz rad sa klijentima. Svakom klijentu pristupam
                individualno, stvarajući jedinstveni set alata za njegov razvoj.
              </p>

              <h3 className="text-lg font-semibold mt-4">3K – Kroj</h3>
              <p>
                Balans i primerenost: osvešćujem različite oblasti života
                (mentalnu, emotivnu, fizičku, duhovnu) i pomažem klijentima da
                “prekroje” svoje obrasce u odnosima i komunikaciji.
              </p>

              <h3 className="text-lg font-semibold mt-4">4K – Katići</h3>
              <p>
                Porodica je moj izvor podrške i inspiracije. Primer iz ličnog
                života – period suprugove operacije i oporavka – oblikovao je
                moj rad i prioritet na balans između privatnog i poslovnog.
              </p>

              <h3 className="text-lg font-semibold mt-4">
                5K – Knjige &amp; Kolači
              </h3>
              <p>
                Knjige su deo mog identiteta – čitam, kupujem i poklanjam ih od
                detinjstva. Takođe, volim poslastičarstvo i kolače kroz koje
                izražavam kreativnost i gostoprimstvo. Želim da se posetioci
                ovog sajta osećaju ugošćeno – kao da su među knjigama i
                kolačima.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
