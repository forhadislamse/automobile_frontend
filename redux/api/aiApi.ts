/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // Chat Session Management (Persistent)
    startNewChat: builder.mutation({
      query: (payload: {
        persona: string;
        prompt: string;
        image?: string;
      }) => ({
        url: "/ai/sessions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AI"],
    }),

    sendMessage: builder.mutation({
      query: (payload: {
        sessionId: string;
        prompt: string;
        image?: string;
      }) => ({
        url: "/ai/sessions/message",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AI"],
    }),

    getMySessions: builder.query({
      query: (searchTerm?: string) => ({
        url: "/ai/sessions",
        method: "GET",
        params: searchTerm ? { searchTerm } : {},
      }),
      providesTags: ["AI"],
    }),

    getChatMessages: builder.query({
      query: (sessionId: string) => ({
        url: `/ai/sessions/${sessionId}/messages`,
        method: "GET",
      }),
      providesTags: (result: any, error: any, sessionId: string) => [
        { type: "AI", id: sessionId },
      ],
    }),

    // Upload images for chat (Corrected Route)
    uploadImages: builder.mutation({
      query: (formData: FormData) => ({
        url: "/chat-images/upload-images",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useStartNewChatMutation,
  useSendMessageMutation,
  useGetMySessionsQuery,
  useGetChatMessagesQuery,
  useUploadImagesMutation,
} = aiApi;
