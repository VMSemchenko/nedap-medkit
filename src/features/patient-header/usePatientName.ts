import { useQuery } from "@tanstack/react-query";
import { config } from "@/config/env";
import { fetchObservations } from "@/shared/observations/api";

export function usePatientName() {
  const query = useQuery({
    queryKey: ["observations", "patient", { count: config.observationCount }],
    queryFn: ({ signal }) =>
      fetchObservations(
        { page: 1, pageSize: 1, count: config.observationCount, sort: "desc" },
        signal,
      ),
    select: (page) => page.measurements[0]?.patientName,
  });

  return { patientName: query.data, isLoading: query.isPending };
}
