import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useSubmitReview } from "@/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewFormProps {
  listingId: string;
  reviewType?: "listing" | "volunteer";
  reviewedUserId?: string;
}

const ReviewForm = ({ listingId, reviewType = "listing", reviewedUserId }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const submitReview = useSubmitReview();

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Lūdzu, izvēlieties vērtējumu", variant: "destructive" });
      return;
    }

    try {
      await submitReview.mutateAsync({
        listing_id: listingId,
        rating,
        comment: comment.trim() || undefined,
        review_type: reviewType,
        reviewed_user_id: reviewedUserId,
      });
      setRating(0);
      setComment("");
      toast({ title: "Atsauksme pievienota!" });
    } catch {
      toast({ title: "Kļūda", description: "Neizdevās pievienot atsauksmi.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Jūsu vērtējums</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-0.5"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-warning fill-warning"
                    : "text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Uzrakstiet savu atsauksmi (neobligāti)..."
        rows={3}
      />
      <Button type="submit" disabled={submitReview.isPending} size="sm">
        {submitReview.isPending ? "Nosūta..." : "Pievienot atsauksmi"}
      </Button>
    </form>
  );
};

export default ReviewForm;
