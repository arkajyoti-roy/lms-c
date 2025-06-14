import { useLoadUserQuery } from "@/features/api/authApi";

export const useUserDetails = () => {
  const { data, isLoading, isError, error } = useLoadUserQuery();
  const user = data?.user;

  return { user, isLoading, isError, error };
};


