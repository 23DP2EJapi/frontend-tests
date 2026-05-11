import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings?q=${searchQuery}&location=${location}`);
  };

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container relative py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/15 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Jauni sludinājumi katru dienu
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Atrodi savu{" "}
            <span className="relative">
              brīvprātīgo darbu
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 4 100 2 150 4C200 6 250 2 298 8"
                  stroke="hsl(var(--accent))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed"
          >
            Savieno savu vēlmi palīdzēt ar organizācijām, kurām nepieciešams tavs atbalsts. 
            Pievienojies tūkstošiem brīvprātīgo visā Latvijā.
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-primary-foreground p-2 rounded-2xl shadow-xl"
          >
            <div className="flex-1 flex items-center gap-2 px-4 bg-background rounded-xl">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <Input
                type="text"
                placeholder="Meklēt pēc nosaukuma vai kategorijas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
            <div className="flex items-center gap-2 px-4 bg-background rounded-xl sm:max-w-[200px]">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <Input
                type="text"
                placeholder="Pilsēta"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="shrink-0">
              Meklēt
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.form>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { value: "500+", label: "Aktīvi sludinājumi" },
              { value: "2,000+", label: "Brīvprātīgie" },
              { value: "150+", label: "Organizācijas" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 30.2C384 27.7 480 31.3 576 38.3C672 45.3 768 55.7 864 58.2C960 60.7 1056 55.3 1152 48.3C1248 41.3 1344 32.7 1392 28.3L1440 24V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
