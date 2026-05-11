import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Eye, Mail } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { lv } from "date-fns/locale";
import {
  useAllContactMessages,
  useUpdateContactMessage,
  useDeleteContactMessage,
} from "@/hooks/useContactMessages";

interface ContactMessagesTabProps {
  isAdmin: boolean;
}

const ContactMessagesTab = ({ isAdmin }: ContactMessagesTabProps) => {
  const { data: messages, isLoading } = useAllContactMessages(isAdmin);
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();

  const handleMarkAsRead = (id: string) => {
    updateMessage.mutate(
      { id, is_read: true },
      {
        onSuccess: () => toast.success("Ziņa atzīmēta kā izlasīta"),
        onError: () => toast.error("Kļūda atjauninot ziņu"),
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMessage.mutate(id, {
      onSuccess: () => toast.success("Ziņa dzēsta"),
      onError: () => toast.error("Kļūda dzēšot ziņu"),
    });
  };

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Kontaktu ziņas ({messages?.length || 0})
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} jauna</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start justify-between p-4 border rounded-lg ${
                  !msg.is_read ? "bg-primary/5 border-primary/20" : ""
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{msg.subject}</h4>
                    {!msg.is_read && (
                      <Badge variant="default" className="text-xs">
                        Jauna
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No: {msg.name} ({msg.email})
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {msg.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(msg.created_at), "d. MMMM, yyyy HH:mm", {
                      locale: lv,
                    })}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!msg.is_read) {
                            handleMarkAsRead(msg.id);
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{msg.subject}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Vārds:</span>
                            <p className="font-medium">{msg.name}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">E-pasts:</span>
                            <p className="font-medium">
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-primary hover:underline"
                              >
                                {msg.email}
                              </a>
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">
                            Ziņa:
                          </span>
                          <p className="mt-1 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Saņemts:{" "}
                          {format(
                            new Date(msg.created_at),
                            "d. MMMM, yyyy HH:mm",
                            { locale: lv }
                          )}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteMessage.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Dzēst ziņu?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Šī darbība ir neatgriezeniska. Ziņa tiks pilnībā dzēsta.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Atcelt</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(msg.id)}>
                          Dzēst
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nav kontaktu ziņu
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactMessagesTab;
