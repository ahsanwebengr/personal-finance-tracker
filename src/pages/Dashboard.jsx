import React, { useState, useMemo } from 'react';
import { useTransactionStats } from '@/hooks/useTransactions';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency } from '@/utils/currency';
import { getMonthYear } from '@/utils/dates';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Select from '@/components/Select';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CalendarDays } from 'lucide-react';

const CHART_COLORS = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#64748b'];

export default function Dashboard() {
    const [selectedDateValue, setSelectedDateValue] = useState(new Date().toISOString());
    const selectedDate = useMemo(() => new Date(selectedDateValue), [selectedDateValue]);

    const monthOptions = useMemo(() => {
        const options = [];
        const start = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(start.getFullYear(), start.getMonth() - i, 1);
            options.push({
                label: getMonthYear(d.toISOString()),
                value: d.toISOString(),
            });
        }
        return options;
    }, []);

    const { stats, isLoading } = useTransactionStats(selectedDate);
    const { currency } = useCurrency();

    if (isLoading) return <LoadingSpinner />;

    const categoryData = stats
        ? Object.entries(stats.categoryBreakdown).map(([name, value], i) => ({
            name,
            value,
            color: CHART_COLORS[i % CHART_COLORS.length],
        }))
        : [];

    return (
        <div className="space-y-5 pt-2 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Good {getGreeting()} 👋</p>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mera Hisab</h1>
                </div>
                <div className="w-10 h-10 rounded-full gradient-balance flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Wallet className="w-5 h-5 text-white" />
                </div>
            </div>

            {/* Balance Card */}
            <div className="gradient-balance rounded-2xl p-5 text-white shadow-xl shadow-primary-500/20 animate-slide-up">
                <p className="text-sm text-white/70 font-medium">Total Balance</p>
                <p className="text-3xl font-extrabold mt-1 tracking-tight">
                    {stats ? formatCurrency(stats.balance, currency) : formatCurrency(0, currency)}
                </p>
                <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/60 uppercase tracking-wide">Income</p>
                            <p className="text-sm font-bold">{stats ? formatCurrency(stats.totalIncome, currency) : formatCurrency(0, currency)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingDown className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/60 uppercase tracking-wide">Expense</p>
                            <p className="text-sm font-bold">{stats ? formatCurrency(stats.totalExpense, currency) : formatCurrency(0, currency)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Summary */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.05s' }}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary-500" />
                        <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Monthly Summary</h2>
                    </div>
                    <div className="w-32">
                        <Select
                            value={selectedDateValue}
                            onChange={setSelectedDateValue}
                            options={monthOptions}
                            selectClassName="!py-2.5 !pl-3 !pr-8 text-xs font-semibold"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-medium">Income</p>
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                            {stats ? formatCurrency(stats.monthlyIncome, currency) : formatCurrency(0, currency)}
                        </p>
                    </div>
                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-medium">Expense</p>
                        <p className="text-sm font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                            {stats ? formatCurrency(stats.monthlyExpense, currency) : formatCurrency(0, currency)}
                        </p>
                    </div>
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-primary-600 dark:text-primary-400 uppercase font-medium">Saved</p>
                        <p className="text-sm font-bold text-primary-700 dark:text-primary-300 mt-0.5">
                            {stats ? formatCurrency(stats.monthlyBalance, currency) : formatCurrency(0, currency)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Monthly Trends Chart */}
            {stats && stats.monthlyTrends.some(m => m.income > 0 || m.expense > 0) && (
                <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Monthly Trends</h2>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyTrends} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    width={45}
                                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(15,23,42,0.9)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        color: '#fff',
                                        padding: '8px 12px',
                                    }}
                                    formatter={(value) => formatCurrency(value, currency)}
                                />
                                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={24} />
                                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Category Spending */}
            {categoryData.length > 0 ? (
                <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Category Spending</h2>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {categoryData.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(15,23,42,0.9)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        color: '#fff',
                                        padding: '8px 12px',
                                    }}
                                    formatter={(value) => formatCurrency(value, currency)}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon="📊"
                    title="No spending data"
                    description="Add some expense transactions to see your category breakdown"
                />
            )}
        </div>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
}
