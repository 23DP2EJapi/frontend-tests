import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Clock,
  Users,
  Building2,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  Star,
  CheckCircle2,
  Heart,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useListing } from "@/hooks/useListings";
import { useListingReviews, useListingStats } from "@/hooks/useReviews";
import { useSubmitApplication } from "@/hooks/useApplications";
import { useAuth } from "@/contexts/AuthContext";
import ReviewForm from "@/components/reviews/ReviewForm";

const ListingDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    motivation: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: listing, isLoading: isLoadingListing, error: listingError } = useListing(id || "");
  const { data: reviews } = useListingReviews(listing?.id || "");
  const { data: stats } = useListingStats(listing?.id || "");
  const submitApplication = useSubmitApplication();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      await submitApplication.mutateAsync({
        listing_id: id,
        phone: formData.phone || undefined,
        motivation: formData.motivation,
      });
      
      setIsSubmitted(true);
      toast({
        title: "Pieteikums nosūtīts!",
        description: "Organizācija ar tevi sazināsies tuvākajā laikā.",
      });
    } catch (error) {
      toast({
        title: "Kļūda",
        description: "Neizdevās nosūtīt pieteikumu. Mēģiniet vēlreiz.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingListing) {
    return (
      <Layout>
        <div className="bg-secondary/50 py-4">
          <div className="container">
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <Skeleton className="h-8 w-24 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-6 w-64 mb-6" />
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
              <div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (listingError || !listing) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sludinājums nav atrasts</h1>
          <p className="text-muted-foreground mb-6">Šis sludinājums neeksistē vai ir noņemts.</p>
          <Button asChild>
            <Link to="/listings">Atgriezties uz sludinājumiem</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Parse requirements and benefits if they exist
  const requirements = listing.requirements
    ? listing.requirements.split("\n").filter(Boolean)
    : ["Mīlestība pret darbu", "Atbildība un punktualitāte"];

  const benefits = listing.benefits
    ? listing.benefits.split("\n").filter(Boolean)
    : ["Rekomendācijas vēstule", "Jauna pieredze"];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/50 py-4">
        <div className="container">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Atpakaļ uz sludinājumiem
          </Link>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{listing.category}</Badge>
                  {listing.is_new && <Badge variant="new">Jauns</Badge>}
                  {listing.is_urgent && <Badge variant="urgent">Steidzami</Badge>}
                  {listing.is_online && <Badge variant="online">Tiešsaistē</Badge>}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {listing.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>{listing.location}</span>
                  </div>
                  {stats && stats.reviewCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      <span className="font-medium text-foreground">{stats.averageRating}</span>
                      <span className="text-muted-foreground">({stats.reviewCount} atsauksmes)</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                    Saglabāt
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                    Dalīties
                  </Button>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Par darbu</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                  {listing.description}
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Prasības</h2>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Ko tu iegūsi</h2>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Reviews */}
              {reviews && reviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Atsauksmes</h2>
                    {stats && (
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-warning fill-warning" />
                        <span className="font-semibold text-foreground">{stats.averageRating}</span>
                        <span className="text-muted-foreground">({stats.reviewCount})</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                              A
                            </div>
                            <div>
                              <div className="font-medium text-foreground">
                                Anonīms
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString("lv-LV")}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-warning fill-warning" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground text-sm">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Review Form */}
              {user && listing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">Atstāt atsauksmi</h2>
                  <ReviewForm
                    listingId={listing.id}
                    reviewType="listing"
                  />
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Laika ieguldījums</div>
                        <div className="font-medium text-foreground">
                          {listing.time_commitment || "Nav norādīts"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Brīvās vietas</div>
                        <div className="font-medium text-foreground">{listing.spots || 1} vietas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sākums</div>
                        <div className="font-medium text-foreground">Tūlītēja uzsākšana</div>
                      </div>
                    </div>
                  </div>

                  {user ? (
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full mt-6"
                      onClick={() => setIsApplying(!isApplying)}
                    >
                      Pieteikties
                    </Button>
                  ) : (
                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        Lai pieteiktos, nepieciešams pieslēgties
                      </p>
                      <Button
                        variant="hero"
                        size="lg"
                        className="w-full"
                        asChild
                      >
                        <Link to="/login">Pieslēgties</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        asChild
                      >
                        <Link to="/register">Reģistrēties</Link>
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Application Form */}
                {isApplying && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    {!isSubmitted ? (
                      <>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Pieteikuma forma</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefons</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+371 2000 0000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="motivation">Motivācijas vēstule *</Label>
                            <Textarea
                              id="motivation"
                              name="motivation"
                              value={formData.motivation}
                              onChange={handleInputChange}
                              required
                              rows={4}
                              placeholder="Pastāsti, kāpēc vēlies piedalīties..."
                            />
                          </div>
                          <Button 
                            type="submit" 
                            variant="default" 
                            className="w-full"
                            disabled={submitApplication.isPending}
                          >
                            {submitApplication.isPending ? "Nosūta..." : "Nosūtīt pieteikumu"}
                          </Button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-success" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Paldies par pieteikumu!
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Organizācija ar tevi sazināsies tuvākajā laikā.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Author Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-secondary/50 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">Sludinājuma autors</h3>
                  <div className="space-y-2 text-sm">
                    {listing.user_id && (
                      <Link
                        to={`/profile/${listing.user_id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        <User className="h-4 w-4" />
                        Skatīt profilu
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ListingDetail;
