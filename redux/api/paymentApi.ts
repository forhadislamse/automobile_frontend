/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    createSubscriptionIntent: builder.mutation({
      query: (data: { planId: string; duration: string }) => ({
        url: "/payment/create-subscription-intent",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscriptions", "User"],
    }),
    confirmPayment: builder.mutation({
      query: (data: { paymentId: string; paymentIntentId: string }) => ({
        url: "/payment/confirm-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscriptions", "User"],
    }),
    getMySubscriptions: builder.query({
      query: () => ({
        url: "/payment/my-subscriptions",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),
    changeSubscriptionPlan: builder.mutation({
      query: (data: { subscriptionId: string; newPlanId: string; newDuration: string; technicianIds?: string[] }) => ({
        url: "/payment/change-plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscriptions", "User"],
    }),
  }),
});

export const { 
  useCreateSubscriptionIntentMutation, 
  useConfirmPaymentMutation, 
  useGetMySubscriptionsQuery,
  useChangeSubscriptionPlanMutation
} = paymentApi;
