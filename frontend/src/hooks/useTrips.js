import { useState, useEffect } from 'react';

/**
 * Custom hook to manage trips with LocalStorage persistence.
 * Bypasses the backend temporarily to prevent data loss on Netlify.
 */
export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load trips from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nomad_trips');
    if (stored) {
      try {
        setTrips(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse trips from localStorage');
      }
    }
    setLoading(false);
  }, []);

  // Save trips to LocalStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('nomad_trips', JSON.stringify(trips));
    }
  }, [trips, loading]);

  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: Date.now() + Math.floor(Math.random() * 1000) // fake ID
    };
    setTrips(prev => [newTrip, ...prev]);
  };

  const deleteTrip = (id) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  return { trips, loading, addTrip, deleteTrip };
}
