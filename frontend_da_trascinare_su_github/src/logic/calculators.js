import { differenceInDays, isAfter, isBefore, parseISO, subDays } from 'date-fns';

// EU Countries exempt from Schengen 90/180 rule (citizens living in EU)
export const EU_COUNTRIES = ['IT', 'FR', 'DE', 'ES', 'PT', 'GR', 'NL', 'BE', 'LU', 'SE', 'FI', 'DK', 'AT', 'IE', 'PL', 'CZ', 'HU', 'SK', 'SI', 'EE', 'LV', 'LT', 'RO', 'BG', 'HR', 'CY', 'MT'];

/**
 * Calculates the total days spent in Schengen zone over the last 180 days.
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
 * Accepts nationality: if EU citizen, they are exempt.
 */
export const calculateSchengenStatus = (trips, targetDate = new Date(), nationality = null) => {
  // EU passport holders are NOT subject to 90/180 rule in Schengen
  if (nationality && EU_COUNTRIES.includes(nationality.toUpperCase())) {
    return 'Con il tuo passaporto EU sei esente dalla regola 90/180 in Area Schengen.';
  }

  const daysUsed = calculateSchengenDays(trips, targetDate);
  const remaining = 90 - daysUsed;
  
  if (remaining < 0) {
    return `OVERSTAY! Hai sforato di ${Math.abs(remaining)} giorni il limite dei 90. Esci dall'Area Schengen immediatamente.`;
  } else if (remaining <= 15) {
    return `ATTENZIONE: Ti rimangono solo ${remaining} giorni Schengen. Pianifica subito l'uscita.`;
  }
  return `Sei al sicuro. Hai ancora ${remaining} giorni disponibili su 90 in Area Schengen.`;
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
