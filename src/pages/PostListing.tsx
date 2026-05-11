import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const postListingSchema = z.object({
  title: z.string().min(5, "Nosaukumam jābūt vismaz 5 rakstzīmēm"),
  description: z.string().min(20, "Aprakstam jābūt vismaz 20 rakstzīmēm"),
  location: z.string().min(2, "Norādi atrašanās vietu"),
  category: z.string().min(1, "Izvēlies kategoriju"),
  timeCommitment: z.string().optional(),
  spots: z.coerce.number().min(1, "Jābūt vismaz 1 vietai").default(1),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  isUrgent: z.boolean().default(false),
  isOnline: z.boolean().default(false),
});

type PostListingFormData = z.infer<typeof postListingSchema>;

const categories = [
  "Sociālā palīdzība",
  "Izglītība",
  "Vide",
  "Kultūra",
  "Sports",
  "Veselība",
  "Dzīvnieki",
  "Cits",
];

const cities = [
  "Rīga",
  "Daugavpils",
  "Liepāja",
  "Jelgava",
  "Jūrmala",
  "Ventspils",
  "Rēzekne",
  "Valmiera",
  "Cita",
];

const PostListing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostListingFormData>({
    resolver: zodResolver(postListingSchema),
    defaultValues: {
      spots: 1,
      isUrgent: false,
      isOnline: false,
    },
  });

  const isUrgent = watch("isUrgent");
  const isOnline = watch("isOnline");

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

  const onSubmit = async (data: PostListingFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/listings', {
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        time_commitment: data.timeCommitment || null,
        spots: data.spots,
        requirements: data.requirements || null,
        benefits: data.benefits || null,
        is_urgent: data.isUrgent,
        is_online: data.isOnline,
      });

      toast.success("Sludinājums veiksmīgi publicēts!");
      navigate("/listings");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Kļūda publicējot sludinājumu. Mēģini vēlreiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Publicēt sludinājumu</CardTitle>
              <CardDescription>
                Aizpildi formu, lai publicētu jaunu brīvprātīgā darba sludinājumu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Listing Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Sludinājuma informācija</h3>

                  <div className="space-y-2">
                    <Label htmlFor="title">Nosaukums *</Label>
                    <Input
                      id="title"
                      placeholder="Piemēram: Brīvprātīgais palīgs pasākumā"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Apraksts *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detalizēts darba apraksts..."
                      rows={5}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Kategorija *</Label>
                      <Select onValueChange={(value) => setValue("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Izvēlies kategoriju" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-destructive">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Atrašanās vieta *</Label>
                      <Select onValueChange={(value) => setValue("location", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Izvēlies pilsētu" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.location && (
                        <p className="text-sm text-destructive">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeCommitment">Laika ieguldījums</Label>
                      <Input
                        id="timeCommitment"
                        placeholder="Piemēram: 4-6 stundas nedēļā"
                        {...register("timeCommitment")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spots">Brīvo vietu skaits *</Label>
                      <Input
                        id="spots"
                        type="number"
                        min={1}
                        {...register("spots")}
                      />
                      {errors.spots && (
                        <p className="text-sm text-destructive">{errors.spots.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Prasības</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Kādas prasības ir brīvprātīgajam?"
                      rows={3}
                      {...register("requirements")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Ieguvumi</Label>
                    <Textarea
                      id="benefits"
                      placeholder="Ko brīvprātīgais iegūs?"
                      rows={3}
                      {...register("benefits")}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Steidzams</Label>
                        <p className="text-sm text-muted-foreground">
                          Atzīmē, ja vajadzīgi brīvprātīgie steidzami
                        </p>
                      </div>
                      <Switch
                        checked={isUrgent}
                        onCheckedChange={(checked) => setValue("isUrgent", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Attālināti</Label>
                        <p className="text-sm text-muted-foreground">
                          Darbs var tikt veikts attālināti
                        </p>
                      </div>
                      <Switch
                        checked={isOnline}
                        onCheckedChange={(checked) => setValue("isOnline", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publicē...
                    </>
                  ) : (
                    "Publicēt sludinājumu"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PostListing;
