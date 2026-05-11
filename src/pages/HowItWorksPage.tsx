import Layout from "@/components/layout/Layout";
import { Search, FileText, HandHeart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Atrodi iespēju",
    description: "Pārlūko mūsu sludinājumu katalogu un atrodi brīvprātīgā darba iespēju, kas atbilst tavām interesēm un prasmēm.",
  },
  {
    icon: FileText,
    title: "Piesakies",
    description: "Aizpildi pieteikuma formu ar savu motivāciju un kontaktinformāciju. Organizācija saņems tavu pieteikumu.",
  },
  {
    icon: HandHeart,
    title: "Palīdzi",
    description: "Pēc apstiprināšanas sāc brīvprātīgo darbu un sniedz savu ieguldījumu sabiedrības labā.",
  },
  {
    icon: Star,
    title: "Novērtē",
    description: "Pēc pieredzes atstāj atsauksmi par organizāciju, lai palīdzētu citiem brīvprātīgajiem.",
  },
];

const HowItWorksPage = () => {
  return (
    <Layout>
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Kā tas strādā?</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Četri vienkārši soļi, lai sāktu savu brīvprātīgā darba pieredzi.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-3xl mx-auto space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-6 rounded-2xl border border-border bg-card p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                {i + 1}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-primary" />
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Gatavs sākt?</h2>
          <p className="text-muted-foreground text-lg">Atrodi savu pirmo brīvprātīgā darba iespēju jau tagad.</p>
          <Button size="lg" asChild>
            <Link to="/listings">Skatīt sludinājumus</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorksPage;
