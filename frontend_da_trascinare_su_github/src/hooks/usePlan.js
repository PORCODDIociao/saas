import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePlan() {
  const [plan, setPlanState] = useState('FREE'); // FREE, NOMAD, BUSINESS
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('plan_type')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setPlanState(data.plan_type || 'FREE');
    }
    setLoading(false);
  };

  const setPlan = async (newPlan) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: newPlan })
      .eq('id', user.id);

    if (!error) {
      setPlanState(newPlan);
    }
  };

  return { plan, setPlan, loading };
}
