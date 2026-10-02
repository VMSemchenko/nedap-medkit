import { MeasurementsList } from "@/features/measurements-list";
import { PatientHeader } from "@/features/patient-header";
import { VitalsOverview } from "@/features/vitals-overview";

export function App() {
  return (
    <main className="mx-auto max-w-[1194px] px-4 pt-12 pb-16 sm:pt-26">
      <h1 className="text-4xl leading-none font-extrabold text-gray-900">
        Body Check Dashboard
      </h1>
      <PatientHeader />
      <div className="mt-13">
        <VitalsOverview />
      </div>
      <h2 className="mt-14 mb-6 text-2xl leading-none font-bold text-gray-900">
        Latest measurements
      </h2>
      <MeasurementsList />
    </main>
  );
}
