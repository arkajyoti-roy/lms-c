import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import reducer from "../authSlice";

const base_url = 'https://lms-qi8hh5ymp-arkajyoti-roys-projects.vercel.app/api/v1/course';

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: base_url,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({courseTitle, category}) => ({
                url: "/",
                method: "POST",
                body: {courseTitle, category}
            })
        })
    })
})

export const { useCreateCourseMutation } = courseApi;
