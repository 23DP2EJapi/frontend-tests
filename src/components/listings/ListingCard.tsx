import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ListingCardData } from "@/types/database";

interface ListingCardProps {
  listing: ListingCardData;
  index?: number;
}

const ListingCard = ({ listing, index = 0 }: ListingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card-elevated group"
    >
      <div className="p-5">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{listing.category}</Badge>
            {listing.isUrgent && <Badge variant="urgent">Steidzami</Badge>}
            {listing.isNew && <Badge variant="new">Jauns</Badge>}
            {listing.isOnline && <Badge variant="online">Tiešsaistē</Badge>}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {listing.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {listing.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{listing.timeCommitment}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 shrink-0" />
            <span>{listing.spots} vietas</span>
          </div>
        </div>

        {/* Action */}
        <Button variant="default" className="w-full group/btn" asChild>
          <Link to={`/listings/${listing.id}`}>
            Apskatīt
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default ListingCard;
