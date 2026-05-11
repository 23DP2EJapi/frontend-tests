import { 
  PawPrint, 
  GraduationCap, 
  Leaf, 
  Users, 
  Laptop, 
  Palette, 
  Heart, 
  Globe 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { icon: PawPrint, label: "Dzīvnieki", slug: "dzivnieki", count: 45 },
  { icon: GraduationCap, label: "Izglītība", slug: "izglitiba", count: 32 },
  { icon: Leaf, label: "Vide", slug: "vide", count: 28 },
  { icon: Users, label: "Sociālais darbs", slug: "socialais-darbs", count: 56 },
  { icon: Laptop, label: "IT un tehnoloģijas", slug: "it", count: 18 },
  { icon: Palette, label: "Kultūra un māksla", slug: "kultura", count: 24 },
  { icon: Heart, label: "Veselība", slug: "veseliba", count: 35 },
  { icon: Globe, label: "Starptautiskie", slug: "starptautiskie", count: 12 },
];

const CategoriesSection = () => {
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
            Pārlūko kategorijas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Atrodi brīvprātīgo darbu jomā, kas tev interesē
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/listings?category=${category.slug}`}
                className="card-elevated flex flex-col items-center p-6 text-center group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {category.label}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {category.count} sludinājumi
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
