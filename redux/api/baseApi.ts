import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/authSlice";
import { RootState } from "../store";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:13079/api/v1";

const baseQueryWithAuth: ReturnType<typeof fetchBaseQuery> = async (
  args,
  api, 
  extraOptions
) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  });

  console.log("BaseAPI Request:", args);
  const result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401
  ) {
    api.dispatch(logout());
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User", "Plans", "Plan", "Subscriptions", "Technician", "AI"],
  endpoints: (builder) => ({}),
});
