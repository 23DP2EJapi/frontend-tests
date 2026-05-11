import Layout from "@/components/layout/Layout";
import { Heart, Users, Target, Award, HandHeart, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Heart className="h-4 w-4" fill="currentColor" />
            Par mums
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Savienojam brīvprātīgos ar organizācijām
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Brīvprātīgie.lv ir platforma, kas palīdz cilvēkiem atrast brīvprātīgā darba iespējas un organizācijām — motivētus palīgus.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Mūsu misija",
                description: "Veicināt brīvprātīgo darbu Latvijā, padarot to pieejamu ikvienam, neatkarīgi no vecuma, pieredzes vai atrašanās vietas.",
              },
              {
                icon: Globe,
                title: "Mūsu vīzija",
                description: "Latvija, kurā ikviens ir iesaistījies sabiedrības labā un brīvprātīgais darbs ir ikdienas daļa.",
              },
              {
                icon: Award,
                title: "Mūsu vērtības",
                description: "Atvērtība, cieņa, sadarbība un ticība, ka kopā mēs varam mainīt sabiedrību uz labo pusi.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why volunteer */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Kāpēc brīvprātīgais darbs?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: HandHeart, text: "Iespēja palīdzēt tiem, kam tas visvairāk nepieciešams" },
              { icon: Users, text: "Jauni kontakti un draugi ar līdzīgām vērtībām" },
              { icon: Award, text: "Pieredze un prasmes, kas noderēs karjerā" },
              { icon: Heart, text: "Gandarījums un laba sajūta par paveikto" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-foreground font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Gatavs sākt?</h2>
          <p className="text-muted-foreground text-lg">
            Pievienojies mūsu kopienai un atrodi savu pirmo brīvprātīgā darba iespēju jau šodien.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/listings">Skatīt sludinājumus</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Sazināties ar mums</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
