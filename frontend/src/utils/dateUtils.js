/**
 * Utility functions for working with dates
 * @module dateUtils
 */

/**
 * Format a date string to a readable format
 * @param {string|Date} date - The date to format
 * @param {Object} options - Format options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (err) {
    console.error('Error formatting date:', err);
    return '';
  }
};

/**
 * Get a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now - dateObj) / 1000);
    
    // Less than a minute
    if (seconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Less than a month
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    // Less than a year
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    
    // More than a year
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } catch (err) {
    console.error('Error generating relative time:', err);
    return '';
  }
};

/**
 * Format a date range (e.g., "Jan 2020 - Present")
 * @param {string|Date} startDate - Start date
 * @param {string|Date|null} endDate - End date (null for "Present")
 * @param {Object} options - Format options
 * @returns {string} - Formatted date range
 */
export const formatDateRange = (startDate, endDate, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    ...options
  };
  
  if (!startDate) return '';
  
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const startStr = new Intl.DateTimeFormat('en-US', defaultOptions).format(start);
    
    // If no end date, return "Start - Present"
    if (!endDate) {
      return `${startStr} - Present`;
    }
    
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const endStr = new Intl.DateTimeFormat('en-US', defaultOptions).format(end);
    
    return `${startStr} - ${endStr}`;
  } catch (err) {
    console.error('Error formatting date range:', err);
    return '';
  }
};

/**
 * Calculate the duration between two dates in years and months
 * @param {string|Date} startDate - Start date
 * @param {string|Date|null} endDate - End date (null for current date)
 * @returns {string} - Formatted duration
 */
export const calculateDuration = (startDate, endDate = null) => {
  if (!startDate) return '';
  
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : new Date();
    
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  } catch (err) {
    console.error('Error calculating duration:', err);
    return '';
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - The date to check
 * @returns {boolean} - True if the date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
  } catch (err) {
    console.error('Error checking past date:', err);
    return false;
  }
};

export default {
  formatDate,
  getRelativeTime,
  formatDateRange,
  calculateDuration,
  isPastDate
}; 