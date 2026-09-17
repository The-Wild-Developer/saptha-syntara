"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalRecords: number;
  size: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  page,
  totalRecords,
  size,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / size));

  const goToPage = (nextPage: number) => {
    onPageChange(Math.min(Math.max(nextPage, 0), totalPages - 1));
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index);
    }

    let start = Math.max(0, page - 2);
    let end = start + 4;
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - 4;
    }

    return Array.from({ length: 5 }, (_, index) => start + index);
  };

  const buttonClass = (active = false, disabled = false) =>
    `flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
      disabled
        ? "cursor-not-allowed border-gray-200 bg-white text-gray-300 dark:border-gray-700 dark:bg-boxdark dark:text-gray-600"
        : active
          ? "border-primary bg-primary text-white"
          : "border-primary/30 bg-white text-primary hover:border-primary hover:bg-primary/10 dark:border-primary/40 dark:bg-boxdark dark:text-primary dark:hover:bg-primary/10"
    }`;

  return (
    <nav
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Table pagination"
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Page {page + 1} of {totalPages}
      </p>

      <div className="flex items-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
          className={buttonClass(false, page === 0)}
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
        </button>

        {getVisiblePages().map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => goToPage(item)}
            aria-current={page === item ? "page" : undefined}
            aria-label={`Page ${item + 1}`}
            className={buttonClass(page === item)}
          >
            {item + 1}
          </button>
        ))}

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
          className={buttonClass(false, page >= totalPages - 1)}
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
}
