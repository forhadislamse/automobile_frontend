/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const planPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlan: builder.query({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
    }),
    getSinglePlan: builder.query<any, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
    }),
    createSubscriptionIntent: builder.mutation<any, any>({
      query: (data) => ({
        url: "/payment/create-subscription-intent",
        method: "POST",
        body: data,
      }),
    }),

    getSingleSubscription: builder.query<any, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
    }),

    getMyPaymentId: builder.query<any, string>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "GET",
      }),
    }),

    paymentConfirmPayment: builder.mutation<any, any>({
      query: (data) => ({
        url: `/payment/confirm-payment`,
        method: "POST",
        body: data,
      }),
    }),
    verifyEmailOtp: builder.mutation<any, any>({
      query: (data) => ({
        url: `/auth/verify-email-otp`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllPlanQuery,
  useGetSinglePlanQuery,
  useCreateSubscriptionIntentMutation,
  usePaymentConfirmPaymentMutation,
  useGetSingleSubscriptionQuery,
  useGetMyPaymentIdQuery,
  useVerifyEmailOtpMutation,
} = planPaymentApi;
