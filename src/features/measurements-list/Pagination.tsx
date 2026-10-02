import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  isDisabled: boolean;
  onPageChange: (page: number) => void;
};

const buttonClassName = "h-8 rounded-sm border-zinc-300 px-3 text-xs shadow-xs";

export function Pagination({
  page,
  totalPages,
  isDisabled,
  onPageChange,
}: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="mt-6 flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        className={buttonClassName}
        disabled={isDisabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={buttonClassName}
        disabled={isDisabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
