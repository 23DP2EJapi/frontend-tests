import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfileName } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, Loader2, Pencil, Clock } from "lucide-react";
import { containsProfanity, profanityMessage } from "@/lib/profanityFilter";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const updateName = useUpdateProfileName();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (profile?.full_name) setNewName(profile.full_name);
  }, [profile?.full_name]);

  const canChangeName = () => {
    if (!profile?.last_name_change) return true;
    const lastChange = new Date(profile.last_name_change);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return lastChange <= twoWeeksAgo;
  };

  const daysUntilChange = () => {
    if (!profile?.last_name_change) return 0;
    const lastChange = new Date(profile.last_name_change);
    const nextAllowed = new Date(lastChange);
    nextAllowed.setDate(nextAllowed.getDate() + 14);
    return Math.max(0, Math.ceil((nextAllowed.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  const handleSaveName = async () => {
    if (!user || !newName.trim()) return;

    if (containsProfanity(newName)) {
      toast({ variant: "destructive", title: "Kļūda", description: profanityMessage });
      return;
    }

    if (newName.trim().length < 2) {
      toast({ variant: "destructive", title: "Kļūda", description: "Vārdam jābūt vismaz 2 rakstzīmēm" });
      return;
    }

    try {
      await updateName.mutateAsync({ userId: user.id, fullName: newName.trim() });
      toast({ title: "Vārds veiksmīgi nomainīts!" });
      setIsEditing(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Kļūda", description: error.message });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mans profils</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profila informācija
              </CardTitle>
              <CardDescription>Apskatiet un rediģējiet savu profilu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Vārds un uzvārds
                </Label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ievadiet jaunu vārdu"
                      maxLength={100}
                    />
                    <Button onClick={handleSaveName} disabled={updateName.isPending} size="sm">
                      {updateName.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Saglabāt"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setNewName(profile?.full_name || ""); }}>
                      Atcelt
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-foreground font-medium">{profile?.full_name || "Nav norādīts"}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      disabled={!canChangeName()}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Mainīt
                    </Button>
                  </div>
                )}
                {!canChangeName() && !isEditing && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Vārdu varēs mainīt pēc {daysUntilChange()} dienām
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  E-pasts
                </Label>
                <p className="text-foreground">{user?.email}</p>
              </div>

              {/* Member since */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Reģistrēts
                </Label>
                <p className="text-foreground">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("lv-LV", {
                        year: "numeric", month: "long", day: "numeric",
                      })
                    : "Nav zināms"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
