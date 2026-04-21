import { useState, useEffect } from 'react';

const CURRENCY_RATES = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  CHF: 1.02,
  AED: 0.25, // Dubai
  THB: 0.026, // Tailandia
  MXN: 0.054, // Messico
  BRL: 0.18, // Brasile
};

export function useFinance() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('nomad_finance');
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  const save = (data) => {
    setTransactions(data);
    localStorage.setItem('nomad_finance', JSON.stringify(data));
  };

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now().toString(), amountEur: (parseFloat(tx.amount) * (CURRENCY_RATES[tx.currency] || 1)).toFixed(2) };
    save([...transactions, newTx]);
  };

  const deleteTransaction = (id) => {
    save(transactions.filter(t => t.id !== id));
  };

  const totals = transactions.reduce((acc, tx) => {
    const val = parseFloat(tx.amountEur);
    if (tx.type === 'income') acc.income += val;
    else acc.expenses += val;
    return acc;
  }, { income: 0, expenses: 0 });

  totals.net = totals.income - totals.expenses;

  return { transactions, addTransaction, deleteTransaction, totals, CURRENCY_RATES };
}
