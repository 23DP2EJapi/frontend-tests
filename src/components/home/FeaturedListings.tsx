import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { motion } from "framer-motion";
import { useFeaturedListings } from "@/hooks/useListings";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedListings = () => {
  const { data: listings, isLoading, error } = useFeaturedListings(6);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Populārākie sludinājumi
            </h2>
            <p className="text-muted-foreground text-lg">
              Iepazīsties ar jaunākajām brīvprātīgā darba iespējām
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link to="/listings">
              Skatīt visus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

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
          <div className="text-center py-12">
            <p className="text-muted-foreground">Neizdevās ielādēt sludinājumus</p>
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nav pieejamu sludinājumu</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
