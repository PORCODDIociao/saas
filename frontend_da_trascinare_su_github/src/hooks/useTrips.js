import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('entry_date', { ascending: false });
      
    if (!error && data) {
      setTrips(data);
    }
    setLoading(false);
  };

  const addTrip = async (trip) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('trips')
      .insert([{ user_id: user.id, iso_code: trip.iso_code, entry_date: trip.entry_date, exit_date: trip.exit_date, is_schengen: trip.is_schengen }])
      .select();

    if (!error && data) {
      setTrips(prev => [data[0], ...prev]);
    }
  };

  const deleteTrip = async (id) => {
    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (!error) {
      setTrips(prev => prev.filter(t => t.id !== id));
    }
  };

  return { trips, loading, addTrip, deleteTrip };
}
