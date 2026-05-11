import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyListings, useListingApplications, useUpdateApplicationStatus, useMarkListingCompleted } from "@/hooks/useListingApplications";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, MapPin, Clock, Users, Mail, Phone, FileText, Check, X, Eye, CheckCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { lv } from "date-fns/locale";
import { MessageButton } from "@/components/messages/MessageButton";
import ReviewForm from "@/components/reviews/ReviewForm";

const ApplicationCard = ({ 
  application, 
  listingTitle,
  onApprove, 
  onReject, 
  isUpdating 
}: { 
  application: any; 
  listingTitle: string;
  onApprove: () => void; 
  onReject: () => void;
  isUpdating: boolean;
}) => {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Gaida",
    approved: "Apstiprināts",
    rejected: "Noraidīts",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">
                {application.user_id ? (
                  <Link to={`/profile/${application.user_id}`} className="text-primary hover:underline">
                    {application.full_name}
                  </Link>
                ) : (
                  application.full_name
                )}
              </h4>
              <Badge className={statusColors[application.status] || statusColors.pending}>
                {statusLabels[application.status] || application.status}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {application.email}
              </span>
              {application.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {application.phone}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Pieteicās: {format(new Date(application.created_at), "d. MMMM, yyyy", { locale: lv })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <MessageButton
              applicationId={application.id}
              applicantName={application.full_name}
              listingTitle={listingTitle}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Skatīt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{application.full_name}</DialogTitle>
                  <DialogDescription>Pieteikuma informācija</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-1">Kontaktinformācija</h5>
                    <p className="text-sm text-muted-foreground">{application.email}</p>
                    {application.phone && (
                      <p className="text-sm text-muted-foreground">{application.phone}</p>
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Motivācija</h5>
                    <p className="text-sm whitespace-pre-wrap">{application.motivation}</p>
                  </div>
                  {application.cv_url && (
                    <div>
                      <h5 className="font-medium mb-1">CV</h5>
                      <a
                        href={application.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        Atvērt CV
                      </a>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {application.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={onApprove}
                  disabled={isUpdating}
                  variant="default"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Apstiprināt
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onReject}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-1" />
                  Noraidīt
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ListingWithApplications = ({ listing }: { listing: any }) => {
  const { data: applications, isLoading } = useListingApplications(listing.id);
  const updateStatus = useUpdateApplicationStatus();
  const markCompleted = useMarkListingCompleted();
  const [showReviewFor, setShowReviewFor] = useState<string | null>(null);

  const handleApprove = (applicationId: string) => {
    updateStatus.mutate(
      { applicationId, status: "approved" },
      {
        onSuccess: () => toast.success("Pieteikums apstiprināts!"),
        onError: () => toast.error("Kļūda apstiprinot pieteikumu"),
      }
    );
  };

  const handleReject = (applicationId: string) => {
    updateStatus.mutate(
      { applicationId, status: "rejected" },
      {
        onSuccess: () => toast.success("Pieteikums noraidīts"),
        onError: () => toast.error("Kļūda noraidot pieteikumu"),
      }
    );
  };

  const handleMarkCompleted = () => {
    markCompleted.mutate(listing.id, {
      onSuccess: () => toast.success("Sludinājums atzīmēts kā pabeigts!"),
      onError: () => toast.error("Kļūda atzīmējot sludinājumu"),
    });
  };

  const pendingCount = applications?.filter(a => a.status === "pending").length || 0;
  const approvedApplications = applications?.filter(a => a.status === "approved") || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{listing.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {listing.location}
              </span>
              {listing.time_commitment && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {listing.time_commitment}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="secondary">{pendingCount} gaida</Badge>
            )}
            {listing.is_completed ? (
              <Badge className="bg-green-100 text-green-800">Pabeigts</Badge>
            ) : (
              <>
                <Badge variant={listing.is_active ? "default" : "outline"}>
                  {listing.is_active ? "Aktīvs" : "Neaktīvs"}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkCompleted}
                  disabled={markCompleted.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Pabeigt
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((application) => (
              <div key={application.id} className="space-y-2">
                <ApplicationCard
                  application={application}
                  listingTitle={listing.title}
                  onApprove={() => handleApprove(application.id)}
                  onReject={() => handleReject(application.id)}
                  isUpdating={updateStatus.isPending}
                />
                {listing.is_completed && application.status === "approved" && (
                  <div className="ml-4">
                    {showReviewFor === application.id ? (
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h5 className="font-medium mb-2 flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          Novērtēt brīvprātīgo: {application.full_name}
                        </h5>
                        <ReviewForm
                          listingId={listing.id}
                          reviewType="volunteer"
                          reviewedUserId={application.user_id || undefined}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowReviewFor(null)}
                        >
                          Aizvērt
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowReviewFor(application.id)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Novērtēt brīvprātīgo
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nav pieteikumu šim sludinājumam
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const MyListings = () => {
  const { user, loading } = useAuth();
  const { data: listings, isLoading } = useMyListings(user?.id);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Mani sludinājumi</h1>
              <p className="text-muted-foreground mt-1">
                Pārvalti savus sludinājumus un pieteikumus
              </p>
            </div>
            <Button asChild>
              <Link to="/post-listing">Jauns sludinājums</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="space-y-6">
              {listings.map((listing) => (
                <ListingWithApplications key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nav sludinājumu</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Tu vēl neesi publicējis nevienu sludinājumu
                </p>
                <Button asChild>
                  <Link to="/post-listing">Publicēt pirmo sludinājumu</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyListings;
