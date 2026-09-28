import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const normalizeResponse = <T,>(response: T | { data: T }): T =>
  response && typeof response === "object" && "data" in response
    ? (response as { data: T }).data
    : (response as T);

export const useServerQuery = (queryKey: any, queryFn: () => any, options: any = {}) =>
  useQuery<any>({
    queryKey,
    queryFn: async () => normalizeResponse(await queryFn()),
    ...options,
  });

export const useServerMutation = (mutationFn: (...params: any[]) => any, options: any = {}) => {
  const queryClient = useQueryClient();
  const { invalidate = [], onSuccess, ...mutationOptions } = options;

  return useMutation<any, any, any, any>({
    mutationFn: async (...params) => normalizeResponse(await mutationFn(...params)),
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      await Promise.all(
        invalidate.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );

      if (onSuccess) {
        await onSuccess(data, variables, context);
      }
    },
  });
};
