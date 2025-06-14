import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../authSlice';
// import { l } from 'vite/dist/node/types.d-aGj9QkWt';

const base_url = 'http://localhost:8081/api/v1/user/';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: base_url,
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: 'signup',
                method: 'POST',
                body: inputData
            }),
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: 'login',
                method: 'POST',
                body: inputData
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    if (result.data) {
                        dispatch(userLoggedIn(result.data));
                    } else {
                        console.error('Login error: No data in response');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'POST'
            }),
        }),
        loadUser: builder.query({
            query: () => ({
                url: 'profile',
                method: 'GET'
            })
        }),
        updateUser: builder.mutation({
            query: (inputData) => {
                return {
                    url: 'profile/update',
                    method: 'PUT',
                    body: inputData,

                }
            },
        }),
    }),
});

export const { useUpdateUserMutation, useLogoutUserMutation, useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery } = authApi;