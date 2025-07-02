'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
      {/* Header */}
      <header className="py-6 text-3xl font-bold text-blue-700 dark:text-blue-300 tracking-tight text-center border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur mb-8 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span>Life Fitness Admin Dashboard</span>
        <div className="relative ml-4">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Open menu"
          >
            <svg className="w-7 h-7 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
            {user && user.name && (
              <span className="ml-2 text-base font-semibold text-gray-800 dark:text-white">{user.name}</span>
            )}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-900 dark:bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="font-semibold text-base text-blue-400">{user?.name || 'User'}</div>
                <div className="text-gray-300 text-xs break-all">{user?.email || ''}</div>
                <div className="text-gray-500 text-xs mt-1">{user?.role}</div>
              </div>
              <div className="flex flex-col">
                <a href="/dashboard/profile" className="px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 transition rounded-t-lg text-left">Profile</a>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-gray-800 transition rounded-b-lg text-left">Logout</button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col gap-8">
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Welcome, Admin!</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your gym efficiently using the sections below.</p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Members Section */}
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Members</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">View and manage all gym members.</p>
            <Link href="/dashboard/members" className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-800 transition">Go to Members</Link>
          </div>
          {/* Analytics Section */}
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">View gym analytics and performance data.</p>
            <Link href="/dashboard/analytics" className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-800 transition">View Analytics</Link>
          </div>
          {/* Add Staff Section */}
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Add Staff</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Register new staff for the gym.</p>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-800 transition">Register Staff</button>
          </div>
          {/* Manage Staff Section */}
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Manage Staff</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">View, edit, or delete staff members.</p>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-800 transition">Manage Staff</button>
          </div>
        </section>
      </main>
    </div>
  );
} 