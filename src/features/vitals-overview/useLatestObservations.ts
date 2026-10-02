import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { config } from "@/config/env";
import { fetchObservations } from "@/shared/observations/api";
import { getNextWalkPage, latestByCode } from "./latest";
import { requiredCodesFor, VITAL_CARDS } from "./cards";

const requiredCodes = requiredCodesFor(VITAL_CARDS);

export function useLatestObservations() {
  const pageSize = config.latestPageSize;
  const query = useInfiniteQuery({
    queryKey: [
      "observations",
      "latest",
      { pageSize, count: config.observationCount },
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      fetchObservations(
        {
          page: pageParam,
          pageSize,
          count: config.observationCount,
          sort: "desc",
        },
        signal,
      ),
    getNextPageParam: (lastPage, allPages, lastPageParam) =>
      getNextWalkPage({
        measurements: allPages.flatMap((page) => page.measurements),
        requiredCodes,
        lastPage: lastPageParam,
        pageSize,
        total: lastPage.total,
      }),
  });

  const { hasNextPage, isFetchingNextPage, isError, fetchNextPage } = query;
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  const measurements = query.data?.pages.flatMap((page) => page.measurements);

  return {
    latest: latestByCode(measurements ?? []),
    isWalking: query.isPending || hasNextPage || isFetchingNextPage,
    isError,
    error: query.error,
    refetch: query.refetch,
  };
}
