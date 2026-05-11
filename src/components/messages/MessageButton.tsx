import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessagesCount } from "@/hooks/useMessages";
import { MessageDialog } from "./MessageDialog";
import { cn } from "@/lib/utils";

interface MessageButtonProps {
  applicationId: string;
  applicantName: string;
  listingTitle: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const MessageButton = ({
  applicationId,
  applicantName,
  listingTitle,
  variant = "outline",
  size = "sm",
  className,
}: MessageButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { data: unreadCount } = useUnreadMessagesCount(applicationId, user?.id || null);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={cn("relative", className)}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        Rakstīt
        {unreadCount && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <MessageDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        applicationId={applicationId}
        applicantName={applicantName}
        listingTitle={listingTitle}
      />
    </>
  );
};
