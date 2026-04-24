import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  currentPage: number;
  lastPage: number;
  total: number;
  onPage: (p: number) => void;
}

export default function Pagination({ currentPage, lastPage, total, onPage }: Props) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-xs text-slate-400">
        Page {currentPage} of {lastPage} — {total.toLocaleString()} total
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPage(page)}
              className={clsx(
                'w-8 h-8 text-xs rounded-lg font-medium transition',
                page === currentPage
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}