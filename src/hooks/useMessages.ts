import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useEffect } from "react";

export interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const useMessages = (applicationId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const data = await api.get(`/messages?application_id=${applicationId}&sort=created_at`);
      return data as Message[];
    },
    enabled: !!applicationId,
  });

  // Note: Real-time subscriptions would need to be implemented via WebSocket or polling
  // For now, the API polling through React Query will handle updates
  useEffect(() => {
    if (!applicationId) return;

    // Optional: Set up polling for messages if needed
    // const interval = setInterval(() => {
    //   queryClient.invalidateQueries({ queryKey: ["messages", applicationId] });
    // }, 3000);

    // return () => clearInterval(interval);
  }, [applicationId, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      content,
      senderId,
    }: {
      applicationId: string;
      content: string;
      senderId: string | number;
    }) => {
      const data = await api.post("/messages", {
        application_id: applicationId,
        sender_id: String(senderId),
        content,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      currentUserId,
    }: {
      applicationId: string;
      currentUserId: string | number;
    }) => {
      await api.patch(`/messages/mark-read/${applicationId}`, { currentUserId: String(currentUserId) });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
    },
  });
};

export const useUnreadMessagesCount = (
  applicationId: string | null,
  currentUserId: string | number | null,
) => {
  return useQuery({
    queryKey: ["unread-messages", applicationId],
    queryFn: async () => {
      if (!applicationId || !currentUserId) return 0;

      const data = await api.get(
        `/messages/unread-count?application_id=${applicationId}&current_user_id=${String(currentUserId)}`,
      );
      return data?.count || 0;
    },
    enabled: !!applicationId && !!currentUserId,
  });
};
