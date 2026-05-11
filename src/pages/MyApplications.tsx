import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyApplications } from "@/hooks/useApplications";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Clock, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { lv } from "date-fns/locale";
import { MessageButton } from "@/components/messages/MessageButton";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Gaida izskatīšanu",
  approved: "Apstiprināts",
  rejected: "Noraidīts",
};

const MyApplications = () => {
  const { user, loading } = useAuth();
  const { data: applications, isLoading } = useMyApplications(user?.id);

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mani pieteikumi</h1>
            <p className="text-muted-foreground mt-1">
              Seko līdzi saviem pieteikumiem un sazinies ar organizācijām
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">
                          {application.listings?.title || "Sludinājums"}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {application.listings?.title || "Sludinājums"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {application.listings?.location || "Nav norādīta"}
                          </span>
                          {application.listings?.time_commitment && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {application.listings.time_commitment}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className={statusColors[application.status] || statusColors.pending}>
                        {statusLabels[application.status] || application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="text-sm text-muted-foreground">
                        <p>
                          Pieteikums iesniegts:{" "}
                          {format(new Date(application.created_at), "d. MMMM, yyyy", { locale: lv })}
                        </p>
                        {application.motivation && (
                          <p className="mt-1 line-clamp-2">
                            <span className="font-medium">Motivācija:</span> {application.motivation}
                          </p>
                        )}
                      </div>
                      <MessageButton
                        applicationId={application.id}
                        applicantName={application.listings?.title || "Sludinājums"}
                        listingTitle={application.listings?.title || "Sludinājums"}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nav pieteikumu</h3>
                <p className="text-muted-foreground text-center">
                  Tu vēl neesi pieteicies nevienam brīvprātīgā darbam
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyApplications;
