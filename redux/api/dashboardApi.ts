/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // Fetch dashboard statistics for the Shop Owner
    getOwnerDashboardStats: builder.query({
      query: () => ({
        url: "/technicians/dashboard",
        method: "GET",
      }),
      providesTags: ["Technician"],
    }),
  }),
});

export const {
  useGetOwnerDashboardStatsQuery,
} = dashboardApi;
