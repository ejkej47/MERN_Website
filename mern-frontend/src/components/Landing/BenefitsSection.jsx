// src/components/landing/BenefitsSection.jsx
import { BookOpen, CheckCircle, Users, Clock } from "lucide-react";

const benefits = [
  { icon: BookOpen, title: "Stručni sadržaj", desc: "Kreiran od strane iskusnih psihologa i edukatora." },
  { icon: CheckCircle, title: "Praktične vežbe", desc: "Vežbe koje možeš odmah primeniti u svakodnevnom životu." },
  { icon: Clock, title: "Fleksibilno učenje", desc: "Pristupi materijalima kad god ti odgovara." },
  { icon: Users, title: "Podrška zajednice", desc: "Poveži se i uči zajedno sa drugima." },
];

export default function BenefitsSection() {
  return (
    <section className="bg-surface py-16 border-t border-borderSoft">
      <div className="container mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-bold text-text">Zašto odabrati nas?</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-background border border-borderSoft hover:border-accent transition"
            >
              <b.icon className="h-8 w-8 mx-auto text-accent" />
              <h3 className="mt-4 text-lg font-semibold text-text">{b.title}</h3>
              <p className="mt-2 text-sm text-mutedSoft">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
