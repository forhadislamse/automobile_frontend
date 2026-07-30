import { baseApi } from "./baseApi";

export const guideApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSections: build.query({
      query: () => ({ url: "/guide/sections", method: "GET" }),
    }),
    getSectionById: build.query({
      query: (id) => ({ url: `/guide/sections/${id}`, method: "GET" }),
    }),
    createSection: build.mutation({
      query: (data) => ({ url: "/guide/sections", method: "POST", body: data }),
    }),
    updateSection: build.mutation({
      query: (data) => ({ url: `/guide/sections/${data.id}`, method: "PATCH", body: data }),
    }),
    deleteSection: build.mutation({
      query: (id) => ({ url: `/guide/sections/${id}`, method: "DELETE" }),
    }),
    getAllChapters: build.query({
      query: () => ({ url: "/guide/chapters", method: "GET" }),
    }),
    getChapterById: build.query({
      query: (id) => ({ url: `/guide/chapters/${id}`, method: "GET" }),
    }),
    createChapter: build.mutation({
      query: (data) => ({ url: "/guide/chapters", method: "POST", body: data }),
    }),
    updateChapter: build.mutation({
      query: (data) => ({ url: `/guide/chapters/${data.id}`, method: "PATCH", body: data }),
    }),
    deleteChapter: build.mutation({
      query: (id) => ({ url: `/guide/chapters/${id}`, method: "DELETE" }),
    }),
    searchGuide: build.query({
      query: (searchTerm) => ({ url: `/guide/search?q=${searchTerm}`, method: "GET" }),
    }),
  }),
});

export const {
  useGetAllSectionsQuery,
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useGetAllChaptersQuery,
  useGetChapterByIdQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
  useSearchGuideQuery,
} = guideApi;
