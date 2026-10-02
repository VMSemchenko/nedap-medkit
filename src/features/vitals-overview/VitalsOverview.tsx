import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  formatBmi,
  formatCardDate,
  formatValue,
} from "@/shared/observations/format";
import {
  findObservationType,
  LOINC,
} from "@/shared/observations/observation-types";
import { calculateBmi } from "./bmi";
import { VITAL_CARDS, type CardDefinition } from "./cards";
import { useLatestObservations } from "./useLatestObservations";
import { VitalCard } from "./VitalCard";

const BMI_LABEL = "Body Mass Index";

export function VitalsOverview() {
  const { latest, isWalking, isError, error, refetch } =
    useLatestObservations();

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load the latest measurements</AlertTitle>
        <AlertDescription>
          <p>{error?.message}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  function renderCard(card: CardDefinition) {
    if (card.kind === "bmi") {
      const bmi = calculateBmi(
        latest.get(LOINC.bodyWeight),
        latest.get(LOINC.bodyLength),
      );
      return (
        <VitalCard
          key="bmi"
          label={BMI_LABEL}
          value={bmi && formatBmi(bmi.value)}
          date={bmi && formatCardDate(bmi.effectiveAt)}
          isLoading={isWalking && !bmi}
        />
      );
    }

    const measurement = latest.get(card.code);
    return (
      <VitalCard
        key={card.code}
        label={findObservationType(card.code)?.label ?? card.code}
        value={measurement && formatValue(measurement.value)}
        unit={measurement?.unit}
        date={measurement && formatCardDate(measurement.effectiveAt)}
        isLoading={isWalking && !measurement}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {VITAL_CARDS.map(renderCard)}
    </div>
  );
}
