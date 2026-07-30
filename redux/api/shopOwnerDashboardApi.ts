import { baseApi } from "./baseApi";

export const shopOwnerDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: () => ({
        url: "/technicians/dashboard",
        method: "GET",
      }),
    }),
    addTechnician: builder.mutation({
      query: (data) => ({
        url: "/technicians/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ShopOwner"],
    }),
    getTechniciansLimitInfo: builder.query({
      query: () => ({
        url: "/technicians/limit-info",
        method: "GET",
      }),
      providesTags: ["ShopOwner"],
    }),
    getTechniciansManagementStats: builder.query({
      query: () => ({
        url: "/technicians/management-stats",
        method: "GET",
      }),
      providesTags: ["ShopOwner"],
    }),
    billingManagement: builder.query({
      query: () => ({
        url: "/billing/management",
        method: "GET",
      }),
    }),
    UpdateTechnicianStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/technicians/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ShopOwner"],
    }),
    getBillingData: builder.query({
      query: () => ({
        url: "/payment/my-payments",
        method: "GET",
      }),
    }),
    getMySubscriptions: builder.query({
      query: () => ({
        url: "/payment/my-subscriptions",
        method: "GET",
      }),
    }),

    updateAutoRenew: builder.mutation({
      query: ({ subscriptionId, value }) => ({
        url: `/payment/subscription/${subscriptionId}/${value}`,
        method: "PATCH",
        body: { value },
      }),
      invalidatesTags: ["ShopOwner"],
    }),

    getProfile: builder.query({
      query: () => "/users/profile",
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
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useAddTechnicianMutation,
  useGetTechniciansLimitInfoQuery,
  useGetTechniciansManagementStatsQuery,
  useBillingManagementQuery,
  useUpdateTechnicianStatusMutation,
  useGetBillingDataQuery,
  useUpdateAutoRenewMutation,
  useGetMySubscriptionsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = shopOwnerDashboardApi;
