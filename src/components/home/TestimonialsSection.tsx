import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Anna Ozola",
    role: "Brīvprātīgā",
    organization: "Dzīvnieku patversme 'Labās mājas'",
    content: "Brīvprātīgais darbs patversmē bija viena no labākajām pieredzēm manā dzīvē. Ieguvu ne tikai jaunas prasmes, bet arī draugus gan starp cilvēkiem, gan dzīvniekiem.",
    rating: 5,
  },
  {
    id: "2",
    name: "Mārtiņš Kalniņš",
    role: "Brīvprātīgais",
    organization: "Latvijas Sarkanais Krusts",
    content: "Sākumā biju skeptisks, bet tagad nevaru iedomāties nedēļas nogali bez brīvprātīgā darba. Tas dod milzīgu gandarījumu un ļauj justies noderīgam sabiedrībai.",
    rating: 5,
  },
  {
    id: "3",
    name: "Līga Bērziņa",
    role: "Organizācijas vadītāja",
    organization: "Bērnu fonds",
    content: "Caur šo platformu esam atraduši daudzus lieliskus brīvprātīgos. Sistēma ir ērta lietošanā un ļauj viegli pārvaldīt pieteikumus.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ko saka mūsu brīvprātīgie
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dalies ar savu pieredzi un iedvesmo citus
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote decoration */}
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-primary/10" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[currentIndex].rating
                          ? "text-warning fill-warning"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role} • {testimonials[currentIndex].organization}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                aria-label="Iepriekšējā atsauksme"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Atsauksme ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                aria-label="Nākamā atsauksme"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
