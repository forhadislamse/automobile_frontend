/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // Specialized One-off Diagnostic Tools
    shopForemanAI: builder.mutation({
      query: (prompt: string) => ({
        url: "/ai/shop-foreman",
        method: "POST",
        body: { prompt },
      }),
    }),
    mechanicalDiagnosticsAI: builder.mutation({
      query: (prompt: string) => ({
        url: "/ai/mechanical-diagnostics",
        method: "POST",
        body: { prompt },
      }),
    }),
    obd2InterpreterAI: builder.mutation({
      query: (prompt: string) => ({
        url: "/ai/obd2-interpreter",
        method: "POST",
        body: { prompt },
      }),
    }),
    electricalDiagnosticsAI: builder.mutation({
      query: (prompt: string) => ({
        url: "/ai/electrical-diagnostics",
        method: "POST",
        body: { prompt },
      }),
    }),
    transmissionDiagnosticsAI: builder.mutation({
      query: (prompt: string) => ({
        url: "/ai/transmission-diagnostics",
        method: "POST",
        body: { prompt },
      }),
    }),
    europeanSpecialistAI: builder.mutation({
      query: (prompt: string) => ({
        url: "/ai/european-specialist",
        method: "POST",
        body: { prompt },
      }),
    }),

    // Chat Session Management (Persistent)
    startNewChat: builder.mutation({
      query: (payload: { persona: string; prompt: string; image?: string }) => ({
        url: "/ai/sessions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AI"],
    }),

    sendMessage: builder.mutation({
      query: (payload: { sessionId: string; prompt: string; image?: string }) => ({
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
        url: "/chat-image/upload-images",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useShopForemanAIMutation,
  useMechanicalDiagnosticsAIMutation,
  useObd2InterpreterAIMutation,
  useElectricalDiagnosticsAIMutation,
  useTransmissionDiagnosticsAIMutation,
  useEuropeanSpecialistAIMutation,
  useStartNewChatMutation,
  useSendMessageMutation,
  useGetMySessionsQuery,
  useGetChatMessagesQuery,
  useUploadImagesMutation,
} = aiApi;
