import { useState, useEffect } from 'react';

export function usePlan() {
  const [plan, setPlanState] = useState('FREE'); // FREE, NOMAD, BUSINESS
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPlan = localStorage.getItem('nomad_plan');
    if (storedPlan) {
      setPlanState(storedPlan);
    }
    setLoading(false);
  }, []);

  const setPlan = (newPlan) => {
    setPlanState(newPlan);
    localStorage.setItem('nomad_plan', newPlan);
  };

  return { plan, setPlan, loading };
}
