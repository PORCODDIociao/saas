import { differenceInDays, isAfter, isBefore, parseISO, subDays } from 'date-fns';

/**
 * Calculates the total days spent in Schengen zone over the last 180 days.
 * The window is [targetDate - 180 days, targetDate].
 */
export const calculateSchengenDays = (trips, targetDate = new Date()) => {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  const windowStart = subDays(target, 180);

  let totalDays = 0;

  trips.filter(t => t.is_schengen).forEach(trip => {
    const entry = parseISO(trip.entry_date);
    const exit = trip.exit_date ? parseISO(trip.exit_date) : target;

    if (isBefore(entry, target) && isAfter(exit, windowStart)) {
      const intersectStart = isAfter(entry, windowStart) ? entry : windowStart;
      const intersectEnd = isBefore(exit, target) ? exit : target;

      const days = differenceInDays(intersectEnd, intersectStart) + 1;
      if (days > 0) totalDays += days;
    }
  });

  return totalDays;
};

/**
 * Provides a highly readable string describing the Schengen status.
 */
export const calculateSchengenStatus = (trips, targetDate = new Date()) => {
  const daysUsed = calculateSchengenDays(trips, targetDate);
  const remaining = 90 - daysUsed;
  
  if (remaining < 0) {
    return `Stato critico! Hai sforato di ${Math.abs(remaining)} giorni il limite dei 90.`;
  }
  return `Hai usato ${daysUsed} giorni su 90. Puoi restare ancora ${remaining} giorni.`;
};

/**
 * Calculates total days spent per country in the current calendar year to track Tax Residency constraints.
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
