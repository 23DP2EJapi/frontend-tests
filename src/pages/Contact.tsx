import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSubmitContactMessage } from "@/hooks/useContactMessages";

const faqItems = [
  {
    question: "Kā es varu kļūt par brīvprātīgo?",
    answer: "Lai kļūtu par brīvprātīgo, reģistrējies mūsu platformā, izveido profilu un piesakies sludinājumiem, kas tevi interesē. Organizācija ar tevi sazināsies pēc pieteikuma izskatīšanas.",
  },
  {
    question: "Vai brīvprātīgais darbs ir apmaksāts?",
    answer: "Brīvprātīgais darbs pēc definīcijas nav apmaksāts. Tomēr daudzas organizācijas nodrošina izdevumu segšanu (transports, ēdināšana) un papildu bonusus kā apmācības vai sertifikātus.",
  },
  {
    question: "Cik laika jāiegulda brīvprātīgajā darbā?",
    answer: "Laika ieguldījums ir atkarīgs no konkrētā sludinājuma un tavas pieejamības. Daži projekti prasa tikai dažas stundas, citi - regulāru iesaisti vairākas stundas nedēļā. Katrā sludinājumā ir norādīts nepieciešamais laiks.",
  },
  {
    question: "Vai es varu piedalīties, ja man nav pieredzes?",
    answer: "Jā! Daudzas organizācijas meklē brīvprātīgos bez iepriekšējas pieredzes un nodrošina nepieciešamās apmācības. Svarīgākais ir vēlme palīdzēt un apņemšanās.",
  },
  {
    question: "Kā organizācija var publicēt sludinājumu?",
    answer: "Organizācijas var reģistrēties platformā un publicēt sludinājumus bez maksas. Pēc reģistrācijas organizācijai tiek piešķirta administratora piekļuve sludinājumu un pieteikumu pārvaldībai.",
  },
  {
    question: "Vai es saņemšu apliecinājumu par brīvprātīgo darbu?",
    answer: "Jā, pēc brīvprātīgā darba pabeigšanas organizācija var izsniegt sertifikātu vai rekomendācijas vēstuli. Tas ir atkarīgs no konkrētās organizācijas politikas.",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const submitMessage = useSubmitContactMessage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMessage.mutateAsync(formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Ziņa nosūtīta!",
        description: "Mēs ar tevi sazināsimies tuvākajā laikā.",
      });
    } catch (error) {
      toast({
        title: "Kļūda",
        description: "Neizdevās nosūtīt ziņu. Lūdzu, mēģini vēlreiz.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary/50 py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sazinies ar mums
            </h1>
            <p className="text-lg text-muted-foreground">
              Ir jautājumi vai ieteikumi? Mēs labprāt uzklausīsim!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Raksti mums</h2>
                    <p className="text-sm text-muted-foreground">Atbildēsim 1-2 darba dienu laikā</p>
                  </div>
                </div>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Vārds *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Tavs vārds"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-pasts *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="tavs@epasts.lv"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Temats *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Par ko vēlies runāt?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Ziņa *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Raksti savu ziņojumu..."
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="lg" 
                      className="w-full"
                      disabled={submitMessage.isPending}
                    >
                      {submitMessage.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {submitMessage.isPending ? "Sūta..." : "Nosūtīt ziņu"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Paldies par ziņu!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Mēs ar tevi sazināsimies tuvākajā laikā.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Sūtīt vēl vienu ziņu
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Kontaktinformācija</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">E-pasts</div>
                      <a href="mailto:info@brivpratigielv.lv" className="font-medium text-foreground hover:text-primary transition-colors">
                        info@brivpratigielv.lv
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Telefons</div>
                      <a href="tel:+37120000000" className="font-medium text-foreground hover:text-primary transition-colors">
                        +371 2000 0000
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Adrese</div>
                      <p className="font-medium text-foreground">
                        Brīvības iela 100<br />
                        Rīga, LV-1001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Darba laiks</div>
                      <p className="font-medium text-foreground">
                        P-Pk: 9:00 - 18:00<br />
                        <span className="text-muted-foreground font-normal">Brīvdienas: slēgts</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-secondary/50 rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Karte šeit</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Biežāk uzdotie jautājumi
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Atbildes uz populārākajiem jautājumiem par brīvprātīgo darbu
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium text-foreground">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
