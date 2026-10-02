import { Skeleton } from "@/components/ui/skeleton";
import { usePatientName } from "./usePatientName";

export function PatientHeader() {
  const { patientName, isLoading } = usePatientName();

  if (isLoading) {
    return <Skeleton className="mt-4 h-6 w-48" />;
  }
  if (!patientName) {
    return null;
  }

  return (
    <h2 className="mt-4 text-2xl leading-none font-medium text-muted-foreground">
      {patientName}
    </h2>
  );
}
