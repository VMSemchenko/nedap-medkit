import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type VitalCardProps = {
  label: string;
  value: string | undefined;
  unit?: string;
  date: string | undefined;
  isLoading: boolean;
};

export function VitalCard({
  label,
  value,
  unit,
  date,
  isLoading,
}: VitalCardProps) {
  return (
    <Card className="gap-4 border py-4 shadow-sm">
      <CardContent className="flex flex-col gap-3 px-4">
        <h3 className="text-base leading-none font-semibold text-vital">
          {label}
        </h3>
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-5 w-40" />
          </>
        ) : (
          <>
            <p className="flex items-baseline gap-1.5">
              <span className="text-5xl leading-none font-extrabold text-slate-900">
                {value ?? "—"}
              </span>
              {value && unit ? (
                <span className="text-base font-medium text-muted-foreground">
                  {unit}
                </span>
              ) : null}
            </p>
            <p className="text-sm text-muted-foreground">{date ?? "—"}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
