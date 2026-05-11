import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { containsProfanity, profanityMessage } from "@/lib/profanityFilter";
import { Heart, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Vārdam jābūt vismaz 2 rakstzīmēm" })
    .max(100, { message: "Vārds nedrīkst pārsniegt 100 rakstzīmes" })
    .refine((val) => !containsProfanity(val), { message: profanityMessage }),
  email: z
    .string()
    .trim()
    .email({ message: "Ievadiet derīgu e-pasta adresi" })
    .max(255, { message: "E-pasts nedrīkst pārsniegt 255 rakstzīmes" }),
  password: z
    .string()
    .min(6, { message: "Parolei jābūt vismaz 6 rakstzīmēm" })
    .max(72, { message: "Parole nedrīkst pārsniegt 72 rakstzīmes" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Paroles nesakrīt",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, data.fullName);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Reģistrācijas kļūda",
          description: error.message,
        });
      } else {
        toast({
          title: "Reģistrācija veiksmīga!",
          description: "Lūdzu, pārbaudiet savu e-pastu, lai apstiprinātu kontu.",
        });
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-foreground">Brīvprātīgie.lv</span>
          </Link>
          <CardTitle className="text-2xl">Izveidot kontu</CardTitle>
          <CardDescription>
            Reģistrējies, lai pieteiktos brīvprātīgā darbam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vārds un uzvārds</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" placeholder="Jānis Bērziņš" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-pasts</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="janis@piemers.lv" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parole</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Vismaz 6 rakstzīmes"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apstiprināt paroli</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Atkārtojiet paroli"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reģistrēties
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Jau ir konts? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Ieiet
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
