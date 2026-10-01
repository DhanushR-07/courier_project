import React from 'react';
import { clsx } from 'clsx';
import { Inbox, Search } from 'lucide-react';
import { SkeletonLine } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  searchPlaceholder,
  onSearch,
  searchValue,
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col w-full bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Search Header */}
      {onSearch && (
        <div className="p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder || 'Search...'}
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              aria-label="Search table data"
            />
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse" role="table">
          <thead className="bg-gray-800/80 text-gray-400 text-sm font-medium border-b border-gray-800">
            <tr role="row">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 whitespace-nowrap" role="columnheader">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800" role="rowgroup">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="bg-gray-900">
                  {columns.map((col, colIdx) => (
                    <td key={`skeleton-${idx}-${colIdx}`} className="px-6 py-4">
                      <SkeletonLine className="w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Inbox className="w-12 h-12 mb-3 text-gray-600" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((item, idx) => (
                <tr
                  key={item.id ? String(item.id) : idx}
                  onClick={() => onRowClick?.(item)}
                  className={clsx(
                    'bg-gray-900 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-gray-800/50'
                  )}
                  role={onRowClick ? 'button' : 'row'}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(item);
                    }
                  }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap" role="cell">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
