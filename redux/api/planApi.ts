/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getAllPlans: builder.query({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
      providesTags: ["Plans"],
    }),
    getPlanById: builder.query({
      query: (id: string) => ({
        url: `/subscriptions/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Plan"],
    }),
  }),
});

export const { useGetAllPlansQuery, useGetPlanByIdQuery } = planApi;
export const useGetPlansQuery = useGetAllPlansQuery;
