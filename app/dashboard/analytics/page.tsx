"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import Link from "next/link";

export default function AnalyticsPage() {
  const [data, setData] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeInactive, setActiveInactive] = useState<{ active: number; inactive: number } | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState("");
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState("");
  const [renewalsData, setRenewalsData] = useState<{ month: string; count: number }[]>([]);
  const [renewalsLoading, setRenewalsLoading] = useState(true);
  const [renewalsError, setRenewalsError] = useState("");

  useEffect(() => {
    fetch("/api/analytics/new-members-per-month")
      .then((res) => res.json())
      .then((d) => {
        setData(d.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/analytics/active-inactive-members")
      .then((res) => res.json())
      .then((d) => {
        setActiveInactive(d);
        setAiLoading(false);
      })
      .catch(() => {
        setAiError("Failed to load active/inactive analytics.");
        setAiLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/analytics/revenue-per-month")
      .then((res) => res.json())
      .then((d) => {
        setRevenueData(d.data || []);
        setRevenueLoading(false);
      })
      .catch(() => {
        setRevenueError("Failed to load revenue analytics.");
        setRevenueLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/analytics/renewals-per-month")
      .then((res) => res.json())
      .then((d) => {
        setRenewalsData(d.data || []);
        setRenewalsLoading(false);
      })
      .catch(() => {
        setRenewalsError("Failed to load renewals analytics.");
        setRenewalsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
      <header className="py-6 text-3xl font-bold text-blue-700 dark:text-blue-300 tracking-tight text-center border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur mb-8 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/dashboard" className="hover:underline focus:outline-none">Life Fitness Admin Dashboard</Link>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">New Members Per Month</h2>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Active vs. Inactive Members</h2>
            {aiLoading ? (
              <div>Loading...</div>
            ) : aiError ? (
              <div className="text-red-600">{aiError}</div>
            ) : activeInactive ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={[
                  { name: "Active", value: activeInactive.active },
                  { name: "Inactive", value: activeInactive.inactive },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" barSize={40}>
                    <Cell fill="#2563eb" />
                    <Cell fill="#6b7280" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </section>
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Per Month</h2>
            {revenueLoading ? (
              <div>Loading...</div>
            ) : revenueError ? (
              <div className="text-red-600">{revenueError}</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} tickFormatter={v => `Rs. ${v.toLocaleString()}`} />
                  <Tooltip formatter={v => `Rs. ${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#2563eb" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Renewals Per Month</h2>
            {renewalsLoading ? (
              <div>Loading...</div>
            ) : renewalsError ? (
              <div className="text-red-600">{renewalsError}</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={renewalsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>
      </main>
    </div>
  );
} 