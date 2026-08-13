import { useState, useMemo } from 'react';

export const usePagination = (items = [], initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset page if total items change and current page is out of range
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const goToPage = (page) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
  };

  const nextPage = () => goToPage(safePage + 1);
  const prevPage = () => goToPage(safePage - 1);

  return {
    currentPage: safePage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
};
