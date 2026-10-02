import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MeasurementsTable } from "./MeasurementsTable";
import { clampPage } from "./page-param";
import { Pagination } from "./Pagination";
import { useObservationsPage } from "./useObservationsPage";
import { usePageParam } from "./usePageParam";

export function MeasurementsList() {
  const { page, goToPage, replacePage } = usePageParam();
  const {
    measurements,
    totalPages,
    isLoading,
    isError,
    error,
    isPageChanging,
    refetch,
  } = useObservationsPage(page);

  useEffect(() => {
    if (totalPages === undefined || isPageChanging) return;
    const clampedPage = clampPage(page, totalPages);
    if (clampedPage !== page) replacePage(clampedPage);
  }, [page, totalPages, isPageChanging, replacePage]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-md" />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load measurements</AlertTitle>
        <AlertDescription>
          <p>{error?.message}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (measurements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No measurements found.</p>
    );
  }

  return (
    <>
      <MeasurementsTable measurements={measurements} />
      <Pagination
        page={page}
        totalPages={totalPages ?? 1}
        isDisabled={isPageChanging}
        onPageChange={goToPage}
      />
    </>
  );
}
