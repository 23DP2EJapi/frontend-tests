import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const useSubmitContactMessage = () => {
  return useMutation({
    mutationFn: async (data: ContactMessageData) => {
      await api.post("/contact-messages", data);
    },
  });
};

export const useAllContactMessages = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const data = await api.get("/contact-messages?sort=-created_at");
      return data;
    },
    enabled,
  });
};

export const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; is_read?: boolean }) => {
      await api.patch(`/contact-messages/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
    },
  });
};

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/contact-messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
    },
  });
};
