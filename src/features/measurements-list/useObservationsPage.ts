import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { config } from "@/config/env";
import { fetchObservations } from "@/shared/observations/api";
import { sortByDateDesc } from "@/shared/observations/model";

export function useObservationsPage(page: number) {
  const pageSize = config.pageSize;
  const query = useQuery({
    queryKey: [
      "observations",
      "page",
      { page, pageSize, count: config.observationCount },
    ],
    queryFn: ({ signal }) =>
      fetchObservations(
        { page, pageSize, count: config.observationCount, sort: "desc" },
        signal,
      ),
    placeholderData: keepPreviousData,
  });

  const totalPages = query.data
    ? Math.max(1, Math.ceil(query.data.total / pageSize))
    : undefined;

  return {
    measurements: query.data ? sortByDateDesc(query.data.measurements) : [],
    totalPages,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    isPageChanging: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
