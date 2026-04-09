'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Simulated data: study time & progression for Rayan Boukabous
const STUDY_BY_DAY = [
  { day: 'Mon', hours: 2.5, lessons: 4 },
  { day: 'Tue', hours: 1.8, lessons: 3 },
  { day: 'Wed', hours: 3.2, lessons: 5 },
  { day: 'Thu', hours: 2.0, lessons: 3 },
  { day: 'Fri', hours: 2.8, lessons: 4 },
  { day: 'Sat', hours: 4.0, lessons: 6 },
  { day: 'Sun', hours: 1.5, lessons: 2 },
];

const PROGRESS_BY_MODULE = [
  { name: 'Mathematics', value: 42, color: '#3496E2' },
  { name: 'Physics', value: 28, color: '#164780' },
  { name: 'Chemistry', value: 18, color: '#98D8F3' },
  { name: 'Other', value: 12, color: '#6B7280' },
];

const WEEKLY_PROGRESSION = [
  { week: 'W1', progress: 12 },
  { week: 'W2', progress: 22 },
  { week: 'W3', progress: 28 },
  { week: 'W4', progress: 35 },
  { week: 'W5', progress: 41 },
  { week: 'W6', progress: 40.8 },
];

type ChartType = 'bar' | 'line' | 'area' | 'pie';

export default function ProgressPage() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [metric, setMetric] = useState<'hours' | 'lessons'>('hours');

  const stats = [
    {
      label: 'Study time this week',
      value: '18h 48min',
      sub: '7 days',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark',
    },
    {
      label: 'Lessons completed',
      value: '58',
      sub: 'of 142 total',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-primary-dark to-primary',
    },
    {
      label: 'Average score',
      value: '84.2%',
      sub: 'quizzes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark',
    },
    {
      label: 'Current streak',
      value: '5 days',
      sub: 'keep it up!',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      color: 'from-primary-dark to-primary',
    },
  ];

  const renderStudyChart = () => {
    const dataKey = metric === 'hours' ? 'hours' : 'lessons';
    const commonProps = {
      data: STUDY_BY_DAY,
      margin: { top: 10, right: 20, left: 0, bottom: 0 },
    };

    if (chartType === 'pie') {
      const pieData = STUDY_BY_DAY.map((d, i) => ({
        name: d.day,
        value: d[dataKey],
        color: ['#3496E2', '#164780', '#98D8F3', '#3496E2', '#164780', '#98D8F3', '#6B7280'][i],
      }));
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                const v = typeof value === 'number' ? value : 0;
                return [metric === 'hours' ? `${v}h` : v, metric === 'hours' ? 'Hours' : 'Lessons'];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="day" className="text-xs" stroke="currentColor" />
            <YAxis className="text-xs" stroke="currentColor" />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid var(--gray-200)' }}
              formatter={(value) => {
                const v = typeof value === 'number' ? value : 0;
                return [metric === 'hours' ? `${v}h` : v, metric === 'hours' ? 'Study time' : 'Lessons'];
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke="#3496E2" strokeWidth={2} dot={{ fill: '#3496E2', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3496E2" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3496E2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="day" className="text-xs" stroke="currentColor" />
            <YAxis className="text-xs" stroke="currentColor" />
            <Tooltip
              formatter={(value) => {
                const v = typeof value === 'number' ? value : 0;
                return [metric === 'hours' ? `${v}h` : v, metric === 'hours' ? 'Study time' : 'Lessons'];
              }}
            />
            <Area type="monotone" dataKey={dataKey} stroke="#3496E2" strokeWidth={2} fill="url(#colorStudy)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // bar (default)
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="day" className="text-xs" stroke="currentColor" />
          <YAxis className="text-xs" stroke="currentColor" />
          <Tooltip
            formatter={(value) => {
              const v = typeof value === 'number' ? value : 0;
              return [metric === 'hours' ? `${v}h` : v, metric === 'hours' ? 'Study time' : 'Lessons'];
            }}
          />
          <Bar dataKey={dataKey} fill="#3496E2" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <DashboardNavbar />

      <main className="relative z-10 ml-0 min-w-0 w-full px-3 pb-6 pt-[88px] sm:px-4 sm:pt-28 lg:ml-64 lg:w-auto lg:max-w-none lg:p-6 lg:pt-72">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 pt-20">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your study time and learning statistics
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-5 text-white relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                <div className="relative">
                  <div className="mb-3 opacity-90">{stat.icon}</div>
                  <p className="text-xs font-medium opacity-90 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm opacity-80 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Study time chart + dropdowns */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Study time this week
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as 'hours' | 'lessons')}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="hours">By hours</option>
                  <option value="lessons">By lessons</option>
                </select>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="bar">Bar chart</option>
                  <option value="line">Line chart</option>
                  <option value="area">Area chart</option>
                  <option value="pie">Pie chart</option>
                </select>
              </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 min-h-[320px]">
              {renderStudyChart()}
            </div>
          </div>

          {/* Two columns: progression + module breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progression over weeks */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Overall progression
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={WEEKLY_PROGRESSION} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3496E2" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3496E2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="week" stroke="currentColor" className="text-xs" />
                  <YAxis stroke="currentColor" className="text-xs" tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(value) => {
                      const v = typeof value === 'number' ? value : 0;
                      return [`${v}%`, 'Progress'];
                    }}
                  />
                  <Area type="monotone" dataKey="progress" stroke="#3496E2" strokeWidth={2} fill="url(#colorProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Progress by module (pie) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Progress by module
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={PROGRESS_BY_MODULE}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {PROGRESS_BY_MODULE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => {
                      const v = typeof value === 'number' ? value : 0;
                      return [`${v}%`, 'Share'];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
