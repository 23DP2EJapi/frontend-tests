import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ListingCard from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListings } from "@/hooks/useListings";

const categories = [
  "Visi",
  "Dzīvnieki",
  "Izglītība",
  "Vide",
  "Sociālais darbs",
  "IT",
  "Kultūra",
];

const cities = [
  "Visas pilsētas",
  "Rīga",
  "Jūrmala",
  "Liepāja",
  "Daugavpils",
  "Ventspils",
  "Jelgava",
  "Tiešsaiste",
];

const timeCommitments = [
  "Visi",
  "Dažas stundas",
  "Viena diena",
  "Katru nedēļu",
  "Katru mēnesi",
  "Ilgtermiņa",
];

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visi");
  const [selectedCity, setSelectedCity] = useState("Visas pilsētas");
  const [showFilters, setShowFilters] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedTimeCommitment, setSelectedTimeCommitment] = useState("Visi");

  const { data: listings, isLoading, error } = useListings({
    category: selectedCategory,
    city: selectedCity,
    search: searchQuery,
    isOnline: isOnline || undefined,
    isUrgent: isUrgent || undefined,
    timeCommitment: selectedTimeCommitment,
  });

  const activeFiltersCount = [
    selectedCategory !== "Visi",
    selectedCity !== "Visas pilsētas",
    isOnline,
    isUrgent,
    selectedTimeCommitment !== "Visi",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("Visi");
    setSelectedCity("Visas pilsētas");
    setSearchQuery("");
    setIsOnline(false);
    setIsUrgent(false);
    setSelectedTimeCommitment("Visi");
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary/50 py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Brīvprātīgā darba sludinājumi
            </h1>
            <p className="text-lg text-muted-foreground">
              Atrodi iespēju palīdzēt un iegūt jaunu pieredzi
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Meklēt pēc nosaukuma, organizācijas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggles */}
            <div className="flex gap-3">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px] h-12">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtri
                {activeFiltersCount > 0 && (
                  <Badge variant="accent" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-semibold text-foreground">Filtri</h3>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Notīrīt filtrus
                      </Button>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Kategorijas</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes + Time Commitment */}
                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={isOnline} onCheckedChange={(v) => setIsOnline(!!v)} />
                      <span className="text-sm text-foreground">Tiešsaistē</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={isUrgent} onCheckedChange={(v) => setIsUrgent(!!v)} />
                      <span className="text-sm text-foreground">Steidzami</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Laika ieguldījums:</span>
                      <Select value={selectedTimeCommitment} onValueChange={setSelectedTimeCommitment}>
                        <SelectTrigger className="w-[160px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeCommitments.map((tc) => (
                            <SelectItem key={tc} value={tc}>{tc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Atrasti <span className="font-semibold text-foreground">{listings?.length || 0}</span> sludinājumi
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kārtot pēc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Jaunākie vispirms</SelectItem>
                <SelectItem value="urgent">Steidzamākie</SelectItem>
                <SelectItem value="spots">Vairāk vietu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Kļūda ielādējot sludinājumus
              </h3>
              <p className="text-muted-foreground mb-6">
                Mēģiniet vēlreiz vēlāk
              </p>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nav atrasti sludinājumi
              </h3>
              <p className="text-muted-foreground mb-6">
                Mēģini mainīt meklēšanas kritērijus vai filtrus
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Notīrīt filtrus
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Listings;
