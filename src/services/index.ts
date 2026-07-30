"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("token")?.value;

  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

export const logout = async () => {
  (await cookies()).delete("token");
};

export const getMe = async () => {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No access token found.",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
        next: {
          tags: ["user"],
        },
      },
    );

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const responseData = isJson ? await response.json() : {};

    if (!response.ok) {
      const errorMessage =
        responseData?.message ||
        `Request failed with status ${response.status}`;
      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: true,
      message: responseData.message || "User data fetched successfully.",
      data: responseData.data || null,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message === "Failed to fetch"
          ? "Server is unreachable or connection was reset."
          : error.message
        : "An unexpected error occurred.";

    return {
      success: false,
      message,
    };
  }
};
