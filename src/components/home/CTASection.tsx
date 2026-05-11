import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Gatavs sākt savu brīvprātīgā ceļojumu?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Pievienojies mūsu kopienai un sāc radīt pozitīvas pārmaiņas jau šodien
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* For Volunteers */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-5">
                <Heart className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-3">
                Brīvprātīgajiem
              </h3>
              <p className="text-primary-foreground/70 mb-6 leading-relaxed">
                Atrodi darbu, kas atbilst tavām interesēm un brīvajam laikam. Reģistrācija ir bezmaksas!
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">
                  Reģistrēties
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* For Organizations */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-5">
                <Building2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-3">
                Organizācijām
              </h3>
              <p className="text-primary-foreground/70 mb-6 leading-relaxed">
                Publicē sludinājumus un atrodi motivētus brīvprātīgos saviem projektiem.
              </p>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/post-listing">
                  Publicēt sludinājumu
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
