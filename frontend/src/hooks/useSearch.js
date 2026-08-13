import { useState, useMemo } from 'react';

export const useSearch = (items = [], searchKeys = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const term = searchTerm.toLowerCase().trim();

    return items.filter((item) => {
      if (searchKeys.length === 0) {
        return JSON.stringify(item).toLowerCase().includes(term);
      }
      return searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }, [items, searchTerm, searchKeys]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
};

export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  };
};

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const openModal = (data = null) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  };
};

export const useAcademicYear = () => {
  const { academicYear, setAcademicYear } = useAuth();
  return { academicYear, setAcademicYear };
};
