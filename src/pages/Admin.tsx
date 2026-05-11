import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  useIsAdmin,
  useAllListings,
  useAllReviews,
  useAllProfiles,
  useDeleteReview,
  useDeleteListing,
  useDeleteProfile,
  useUpdateListing,
  useUpdateProfile,
  useUpdateReview,
} from "@/hooks/useAdmin";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2, Edit, Shield, Users, FileText, Star, Mail } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { lv } from "date-fns/locale";
import { useState } from "react";
import ContactMessagesTab from "@/components/admin/ContactMessagesTab";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const { data: listings, isLoading: listingsLoading } = useAllListings(!!isAdmin);
  const { data: reviews, isLoading: reviewsLoading } = useAllReviews(!!isAdmin);
  const { data: profiles, isLoading: profilesLoading } = useAllProfiles(!!isAdmin);

  const deleteReview = useDeleteReview();
  const deleteListing = useDeleteListing();
  const deleteProfile = useDeleteProfile();
  const updateListing = useUpdateListing();
  const updateProfile = useUpdateProfile();
  const updateReview = useUpdateReview();

  if (authLoading || adminLoading) {
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

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleDeleteReview = (id: string) => {
    deleteReview.mutate(id, {
      onSuccess: () => toast.success("Atsauksme dzēsta"),
      onError: () => toast.error("Kļūda dzēšot atsauksmi"),
    });
  };

  const handleDeleteListing = (id: string) => {
    deleteListing.mutate(id, {
      onSuccess: () => toast.success("Sludinājums dzēsts"),
      onError: () => toast.error("Kļūda dzēšot sludinājumu"),
    });
  };

  const handleDeleteProfile = (id: string) => {
    deleteProfile.mutate(id, {
      onSuccess: () => toast.success("Lietotājs dzēsts"),
      onError: () => toast.error("Kļūda dzēšot lietotāju"),
    });
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Administrācijas panelis</h1>
              <p className="text-muted-foreground">Pārvalti saturu un lietotājus</p>
            </div>
          </div>

          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Sludinājumi
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Atsauksmes
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Lietotāji
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Ziņas
              </TabsTrigger>
            </TabsList>

            {/* Listings Tab */}
            <TabsContent value="listings">
              <Card>
                <CardHeader>
                  <CardTitle>Visi sludinājumi ({listings?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {listingsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : listings && listings.length > 0 ? (
                    <div className="space-y-4">
                      {listings.map((listing: any) => (
                        <ListingRow
                          key={listing.id}
                          listing={listing}
                          onDelete={() => handleDeleteListing(listing.id)}
                          onUpdate={(data) => updateListing.mutate({ id: listing.id, ...data })}
                          isDeleting={deleteListing.isPending}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Nav sludinājumu</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Visas atsauksmes ({reviews?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review: any) => (
                        <ReviewRow
                          key={review.id}
                          review={review}
                          onDelete={() => handleDeleteReview(review.id)}
                          onUpdate={(data) => updateReview.mutate({ id: review.id, ...data })}
                          isDeleting={deleteReview.isPending}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Nav atsauksmju</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Visi lietotāji ({profiles?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {profilesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : profiles && profiles.length > 0 ? (
                    <div className="space-y-4">
                      {profiles.map((profile: any) => (
                        <ProfileRow
                          key={profile.id}
                          profile={profile}
                          onUpdate={(data) => updateProfile.mutate({ id: profile.id, ...data })}
                          onDelete={() => handleDeleteProfile(profile.id)}
                          isDeleting={deleteProfile.isPending}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Nav lietotāju</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Messages Tab */}
            <TabsContent value="messages">
              <ContactMessagesTab isAdmin={!!isAdmin} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

// Listing Row Component
const ListingRow = ({ listing, onDelete, onUpdate, isDeleting }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    location: listing.location,
    is_active: listing.is_active,
  });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    toast.success("Sludinājums atjaunināts");
  };

  return (
    <div className="flex items-start justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{listing.title}</h4>
          <Badge variant={listing.is_active ? "default" : "secondary"}>
            {listing.is_active ? "Aktīvs" : "Neaktīvs"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{listing.location}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(listing.created_at), "d. MMMM, yyyy", { locale: lv })}
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rediģēt sludinājumu</DialogTitle>
              <DialogDescription>Mainīt sludinājuma informāciju</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nosaukums</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Atrašanās vieta</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Apraksts</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Aktīvs</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Atcelt</Button>
              <Button onClick={handleSave}>Saglabāt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dzēst sludinājumu?</AlertDialogTitle>
              <AlertDialogDescription>
                Šī darbība ir neatgriezeniska. Sludinājums tiks pilnībā dzēsts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Atcelt</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Dzēst</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

// Review Row Component
const ReviewRow = ({ review, onDelete, onUpdate, isDeleting }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    rating: review.rating,
    comment: review.comment || "",
  });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    toast.success("Atsauksme atjaunināta");
  };

  return (
    <div className="flex items-start justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            no {review.profiles?.full_name || "Nezināms"}
          </span>
        </div>
        {review.comment && <p className="text-sm">{review.comment}</p>}
        <p className="text-xs text-muted-foreground">
          {format(new Date(review.created_at), "d. MMMM, yyyy", { locale: lv })}
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rediģēt atsauksmi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vērtējums (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Komentārs</Label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Atcelt</Button>
              <Button onClick={handleSave}>Saglabāt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dzēst atsauksmi?</AlertDialogTitle>
              <AlertDialogDescription>
                Šī darbība ir neatgriezeniska.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Atcelt</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Dzēst</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

// Profile Row Component
const ProfileRow = ({ profile, onUpdate, onDelete, isDeleting }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    phone: profile.phone || "",
  });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    toast.success("Profils atjaunināts");
  };

  return (
    <div className="flex items-start justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <h4 className="font-medium">{profile.full_name || "Nav vārda"}</h4>
        {profile.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
        {profile.bio && <p className="text-sm text-muted-foreground line-clamp-1">{profile.bio}</p>}
        <p className="text-xs text-muted-foreground">
          Reģistrēts: {format(new Date(profile.created_at), "d. MMMM, yyyy", { locale: lv })}
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rediģēt profilu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vārds</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefons</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Atcelt</Button>
              <Button onClick={handleSave}>Saglabāt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dzēst lietotāju?</AlertDialogTitle>
              <AlertDialogDescription>
                Šī darbība ir neatgriezeniska. Lietotāja profils tiks pilnībā dzēsts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Atcelt</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Dzēst</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;
