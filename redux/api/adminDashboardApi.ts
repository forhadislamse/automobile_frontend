/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: ({ timeRange }) => ({
        url: "/admin/dashboard",
        method: "GET",
        params: { timeRange },
      }),
      providesTags: ["ShopOwner"],
    }),

    getAllShops: builder.query({
      query: ({ page = 1, limit = 10, category, status }) => ({
        url: "/admin/shops",
        method: "GET",
        params: { page, limit, category, status },
      }),
      providesTags: ["ShopOwner"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ShopOwner"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ShopOwner"],
    }),

    getAllPlans: builder.query<
      unknown,
      { page?: number; limit?: number } | void
    >({
      query: () => ({
        url: "/plans",
        method: "GET",
        // params: { page: args?.page ?? 1, limit: args?.limit ?? 10 },
      }),
      providesTags: ["ShopOwner"],
    }),

    updatePlan: builder.mutation<void, { id: string; body: Partial<any> }>({
      query: ({ id, body }) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ShopOwner"],
    }),
    getAllSubscriptions: builder.query({
      query: ({ page = 1, limit = 10, category, status }) => ({
        url: "/admin/subscriptions",
        method: "GET",
        params: { page, limit, category, status },
      }),
      providesTags: ["ShopOwner"],
    }),
    adminShopsStatus: builder.mutation({
      query: (data) => ({
        url: `/admin/shops/status/${data.id}`,
        method: "PATCH",
        body: {
          status: data.status,
        },
      }),
      invalidatesTags: ["ShopOwner"],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetAllShopsQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAllPlansQuery,
  useUpdatePlanMutation,
  useGetAllSubscriptionsQuery,
  useAdminShopsStatusMutation,
} = adminDashboardApi;
