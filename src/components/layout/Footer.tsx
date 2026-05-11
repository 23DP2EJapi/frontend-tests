import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-bold">Brīvprātīgie.lv</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Platforma, kas savieno brīvprātīgos ar organizācijām, lai kopā radītu pozitīvas pārmaiņas sabiedrībā.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Ātrās saites</h4>
            <ul className="space-y-3">
              {[
                { href: "/listings", label: "Sludinājumi" },
                { href: "/about", label: "Par mums" },
                { href: "/how-it-works", label: "Kā tas strādā" },
                { href: "/faq", label: "Biežāk uzdotie jautājumi" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h4 className="font-semibold mb-4">Organizācijām</h4>
            <ul className="space-y-3">
              {[
                { href: "/post-listing", label: "Publicēt sludinājumu" },
                { href: "/resources", label: "Resursi" },
                { href: "/success-stories", label: "Veiksmes stāsti" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakti</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:info@brivpratigielv.lv" 
                  className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  info@brivpratigielv.lv
                </a>
              </li>
              <li>
                <a 
                  href="tel:+37120000000" 
                  className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +371 2000 0000
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-primary-foreground/70 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  Brīvības iela 100, Rīga, LV-1001
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Brīvprātīgie.lv. Visas tiesības aizsargātas.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Privātuma politika
            </Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Lietošanas noteikumi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
