import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

// Static fallback rates
const STATIC_RATES = {
  EUR: 1, USD: 1.08, GBP: 0.85, CHF: 0.98, AED: 3.97, THB: 39.5, MXN: 18.2, BRL: 5.4,
};

export function useFinance() {
  const [transactions, setTransactions] = useState([]);
  const [rates, setRates] = useState(STATIC_RATES);

  useEffect(() => {
    fetchTransactions();
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await res.json();
      setRates(data.rates);
    } catch {
      console.warn("Forex API failed, using static rates");
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) setTransactions(data);
  };

  const addTransaction = async (tx) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        amount: parseFloat(tx.amount),
        currency: tx.currency,
        category: tx.category,
        type: tx.type,
        description: tx.description
      }])
      .select();

    if (!error && data) {
      setTransactions(prev => [data[0], ...prev]);
    }
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const mappedTransactions = useMemo(() => {
    return transactions.map(tx => {
      const exchangeRate = rates[tx.currency] || 1;
      const eurVal = parseFloat(tx.amount) / exchangeRate;
      return { ...tx, amountEur: eurVal };
    });
  }, [transactions, rates]);

  const totals = useMemo(() => {
    const t = { income: 0, expenses: 0, net: 0 };
    mappedTransactions.forEach(tx => {
      if (tx.type === 'income') t.income += tx.amountEur;
      else t.expenses += tx.amountEur;
    });
    t.net = t.income - t.expenses;
    return t;
  }, [mappedTransactions]);

  return { 
    transactions: mappedTransactions, 
    addTransaction, 
    deleteTransaction, 
    totals, 
    CURRENCY_RATES: rates 
  };
}
