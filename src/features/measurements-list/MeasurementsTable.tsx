import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRowDate, formatValue } from "@/shared/observations/format";
import type { Measurement } from "@/shared/observations/model";

export function MeasurementsTable({
  measurements,
}: {
  measurements: Measurement[];
}) {
  return (
    <div className="rounded-md border bg-card">
      <Table className="min-w-[640px] table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[22%] first:pl-4">Measurement</TableHead>
            <TableHead className="w-[50%]">Type</TableHead>
            <TableHead className="w-[24%]">Date</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measurements.map((measurement) => (
            <TableRow key={measurement.id} className="h-[52px]">
              <TableCell className="first:pl-4">
                {formatValue(measurement.value)} {measurement.unit}
              </TableCell>
              <TableCell>{measurement.label}</TableCell>
              <TableCell>{formatRowDate(measurement.effectiveAt)}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        className="size-8"
                        disabled
                        aria-label="More actions"
                      >
                        <Ellipsis className="size-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Not in scope</TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
