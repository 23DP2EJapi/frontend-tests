import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, CheckCircle, ArrowLeft, User, Calendar, Briefcase } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useVolunteerReviews, useVolunteerStats } from "@/hooks/useReviews";
import { useCompletedJobsCount } from "@/hooks/useCompletedJobs";
import { format } from "date-fns";
import { lv } from "date-fns/locale";
import { motion } from "framer-motion";

const PublicProfile = () => {
  const { userId } = useParams();
  const { data: profile, isLoading: isLoadingProfile } = useProfile(userId);
  const { data: reviews, isLoading: isLoadingReviews } = useVolunteerReviews(userId || "");
  const { data: stats } = useVolunteerStats(userId || "");
  const { data: completedCount } = useCompletedJobsCount(userId || "");

  if (isLoadingProfile) {
    return (
      <Layout>
        <div className="container py-12 max-w-3xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-60 w-full" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Profils nav atrasts</h1>
          <Link to="/listings" className="text-primary hover:underline">
            Atgriezties uz sludinājumiem
          </Link>
        </div>
      </Layout>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <Layout>
      <div className="bg-secondary/50 py-4">
        <div className="container">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Atpakaļ
          </button>
        </div>
      </div>

      <div className="container py-8 md:py-12 max-w-3xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {profile.full_name || "Lietotājs"}
                  </h1>
                  {profile.bio && (
                    <p className="text-muted-foreground mb-4">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Reģistrējies: {format(new Date(profile.created_at), "d. MMMM, yyyy", { locale: lv })}
                    </div>
                    {stats && stats.reviewCount > 0 && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span className="font-medium text-foreground">{stats.averageRating}</span>
                        <span className="text-muted-foreground">({stats.reviewCount} atsauksmes)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{completedCount ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Pabeigti darbi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats?.reviewCount ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Atsauksmes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats?.averageRating ? `${stats.averageRating}/5` : "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">Vidējais vērtējums</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                Atsauksmes par brīvprātīgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReviews ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-warning fill-warning"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(review.created_at), "d. MMMM, yyyy", { locale: lv })}
                        </span>
                      </div>
                      {review.profiles?.full_name && (
                        <p className="text-sm font-medium text-foreground mb-1">
                          {review.profiles.full_name}
                        </p>
                      )}
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nav atsauksmju.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PublicProfile;
