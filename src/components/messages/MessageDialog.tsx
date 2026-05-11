import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages, useSendMessage, useMarkMessagesAsRead } from "@/hooks/useMessages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { lv } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  applicantName: string;
  listingTitle: string;
}

export const MessageDialog = ({
  open,
  onOpenChange,
  applicationId,
  applicantName,
  listingTitle,
}: MessageDialogProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: messages, isLoading } = useMessages(applicationId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessagesAsRead();

  // Mark messages as read when dialog opens
  useEffect(() => {
    if (open && user?.id && applicationId) {
      markAsRead.mutate({ applicationId, currentUserId: user.id });
    }
  }, [open, applicationId, user?.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !user?.id) return;

    sendMessage.mutate(
      {
        applicationId,
        content: newMessage.trim(),
        senderId: user.id,
      },
      {
        onSuccess: () => {
          setNewMessage("");
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Sarakste ar {applicantName}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {listingTitle}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 min-h-[300px] max-h-[400px]" ref={scrollRef}>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-3 py-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      isOwn ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 text-sm",
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(new Date(message.created_at), "d. MMM, HH:mm", { locale: lv })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nav ziņojumu</p>
              <p className="text-sm text-muted-foreground">
                Sāc sarunu ar {applicantName}
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Raksti ziņojumu..."
            className="min-h-[60px] resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMessage.isPending}
            size="icon"
            className="shrink-0 h-[60px] w-[60px]"
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
