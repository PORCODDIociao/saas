import { addDays, differenceInDays, isAfter, isBefore, isWithinInterval, parseISO, subDays } from 'date-fns';

/**
 * Calculates the total days spent in Schengen zone over the last 180 days.
 * The window is [targetDate - 180 days, targetDate].
 *
 * @param {Array} trips - Array of trip objects: { entry_date, exit_date, is_schengen }
 * @param {Date|string} targetDate - The date from which to look back (defaults to today)
 * @returns {number} total days spent in Schengen in the window
 */
export const calculateSchengenDays = (trips, targetDate = new Date()) => {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  const windowStart = subDays(target, 180);

  let totalDays = 0;

  trips.filter(t => t.is_schengen).forEach(trip => {
    const entry = parseISO(trip.entry_date);
    // If exit_date is null/undefined, assume the trip is ongoing until target date
    const exit = trip.exit_date ? parseISO(trip.exit_date) : target;

    // Check if trip overlaps with the 180-day window
    // An overlap occurs if entry is before target AND exit is after windowStart
    if (isBefore(entry, target) && isAfter(exit, windowStart)) {
      // Calculate intersection
      const intersectStart = isAfter(entry, windowStart) ? entry : windowStart;
      const intersectEnd = isBefore(exit, target) ? exit : target;

      // Add difference plus 1 (inclusive counting of days)
      const days = differenceInDays(intersectEnd, intersectStart) + 1;
      if (days > 0) totalDays += days;
    }
  });

  return totalDays;
};

/**
 * Calculates total days spent per country in the current calendar year to track Tax Residency constraints.
 * 
 * @param {Array} trips 
 * @param {number} year 
 * @returns {Array} Array of objects: { iso_code, days }
 */
export const calculateTaxResidencyDays = (trips, year = new Date().getFullYear()) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  
  const countryDays = {};

  trips.forEach(trip => {
    const entry = parseISO(trip.entry_date);
    const exit = trip.exit_date ? parseISO(trip.exit_date) : new Date();

    if (isBefore(entry, yearEnd) && isAfter(exit, yearStart)) {
      const intersectStart = isAfter(entry, yearStart) ? entry : yearStart;
      const intersectEnd = isBefore(exit, yearEnd) ? exit : yearEnd;

      const days = differenceInDays(intersectEnd, intersectStart) + 1;
      
      if (days > 0) {
        countryDays[trip.iso_code] = (countryDays[trip.iso_code] || 0) + days;
      }
    }
  });

  return Object.keys(countryDays).map(iso_code => ({
    iso_code,
    days: countryDays[iso_code]
  })).sort((a, b) => b.days - a.days);
};
