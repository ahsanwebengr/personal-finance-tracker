import { useLiveQuery } from 'dexie-react-hooks';
import { useState, useCallback } from 'react';
import db from '../db/db';

export function useTransactions(filters = {}) {
  const { startDate, endDate, category, type, search } = filters;

  const transactions = useLiveQuery(async () => {
    let collection = db.transactions.orderBy('date').reverse();
    let results = await collection.toArray();

    if (startDate) {
      results = results.filter(t => t.date >= startDate);
    }
    if (endDate) {
      results = results.filter(t => t.date <= endDate);
    }
    if (category) {
      results = results.filter(t => t.category === category);
    }
    if (type) {
      results = results.filter(t => t.type === type);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        t =>
          t.note?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      );
    }

    return results;
  }, [startDate, endDate, category, type, search]);

  const addTransaction = useCallback(async (transaction) => {
    const id = await db.transactions.add({
      ...transaction,
      amount: Number(transaction.amount),
      createdAt: new Date().toISOString(),
    });
    return id;
  }, []);

  const updateTransaction = useCallback(async (id, updates) => {
    await db.transactions.update(id, {
      ...updates,
      amount: Number(updates.amount),
    });
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await db.transactions.delete(id);
  }, []);

  const getTransaction = useCallback(async (id) => {
    return await db.transactions.get(Number(id));
  }, []);

  return {
    transactions: transactions || [],
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    isLoading: transactions === undefined,
  };
}

export function useTransactionStats() {
  const stats = useLiveQuery(async () => {
    const all = await db.transactions.toArray();

    const totalIncome = all
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = all
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const monthlyTransactions = all.filter(
      t => t.date >= monthStart && t.date <= monthEnd
    );

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown for current month expenses
    const categoryBreakdown = {};
    monthlyTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];

      const mTransactions = all.filter(t => t.date >= mStart && t.date <= mEnd);
      const mIncome = mTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const mExpense = mTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      monthlyTrends.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        income: mIncome,
        expense: mExpense,
      });
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance: monthlyIncome - monthlyExpense,
      categoryBreakdown,
      monthlyTrends,
    };
  });

  return { stats: stats || null, isLoading: stats === undefined };
}
