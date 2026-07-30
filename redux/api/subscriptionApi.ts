/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

export const subscriptionPlans = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getAllSubscription: builder.query({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
    }),
    createSubscriptionIntent: builder.mutation({
      query: (payload: any) => ({
        url: "/payment/create-subscription-intent",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetAllSubscriptionQuery,
  useCreateSubscriptionIntentMutation,
} = subscriptionPlans;

