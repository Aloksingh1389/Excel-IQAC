// Institution & Department Calculation Utilities for Stage 2

export const getDepartmentStatus = (passPercentage) => {
  const percentage = Number(passPercentage) || 0;

  if (percentage >= 90) {
    return {
      label: 'Excellent',
      variant: 'success',
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dotClass: 'bg-emerald-500',
    };
  }

  if (percentage >= 80) {
    return {
      label: 'Good',
      variant: 'primary',
      colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      dotClass: 'bg-indigo-500',
    };
  }

  return {
    label: 'Needs Attention',
    variant: 'warning',
    colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
    dotClass: 'bg-amber-500',
  };
};

export const filterAndSortDepartments = (
  departments = [],
  { searchTerm = '', statusFilter = 'ALL', sortBy = 'name', sortOrder = 'asc' } = {}
) => {
  let filtered = [...departments];

  // 1. Search filter (Department name, code, HOD name)
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(
      (dept) =>
        dept.name.toLowerCase().includes(term) ||
        dept.code.toLowerCase().includes(term) ||
        (dept.hod?.name && dept.hod.name.toLowerCase().includes(term))
    );
  }

  // 2. Performance Status filter
  if (statusFilter && statusFilter !== 'ALL') {
    filtered = filtered.filter((dept) => {
      const status = getDepartmentStatus(dept.passPercentage);
      return status.label.toLowerCase() === statusFilter.toLowerCase();
    });
  }

  // 3. Sorting
  filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'hod') {
      valA = a.hod?.name || '';
      valB = b.hod?.name || '';
    }

    if (typeof valA === 'string') {
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    valA = Number(valA) || 0;
    valB = Number(valB) || 0;
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  return filtered;
};
