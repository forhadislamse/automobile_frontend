import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
    }),
    getDashboardStats: build.query({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
    }),
    getSubscriptionAnalytics: build.query({
      query: () => ({
        url: "/admin/subscriptions/analytics",
        method: "GET",
      }),
    }),
    getAllPaidTransactions: build.query({
      query: () => ({
        url: "/admin/transactions/paid",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetDashboardStatsQuery,
  useGetSubscriptionAnalyticsQuery,
  useGetAllPaidTransactionsQuery,
} = adminApi;
