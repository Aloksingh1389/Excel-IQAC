// Time and date utility functions for institutional management portal

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  // If it's already a formatted relative string like '10 minutes ago'
  if (typeof timestamp === 'string' && timestamp.includes('ago')) {
    return timestamp;
  }
  return timestamp;
};
