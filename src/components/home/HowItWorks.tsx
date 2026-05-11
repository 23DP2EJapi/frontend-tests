import { Search, FileText, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Atrodi sludinājumu",
    description: "Izmanto meklēšanu vai pārlūko kategorijas, lai atrastu brīvprātīgo darbu, kas atbilst tavām interesēm.",
  },
  {
    icon: FileText,
    title: "Piesakies",
    description: "Aizpildi vienkāršu pieteikuma formu un pastāsti par sevi organizācijai.",
  },
  {
    icon: CheckCircle2,
    title: "Saņem apstiprinājumu",
    description: "Organizācija izskatīs tavu pieteikumu un sazināsies ar tevi.",
  },
  {
    icon: Star,
    title: "Atstāj atsauksmi",
    description: "Pēc darba pabeigšanas dalies ar savu pieredzi un palīdzi citiem.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kā tas strādā?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Četri vienkārši soļi, lai sāktu savu brīvprātīgā darba pieredzi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              {/* Step number */}
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
