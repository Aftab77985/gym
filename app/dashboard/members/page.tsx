'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Add blink animation style
const blinkStyle = `
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
`;

function getDaysLeft(membershipEnd: string) {
  const end = new Date(membershipEnd);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
}

const PAGE_SIZE = 10;

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [renewingMember, setRenewingMember] = useState<any | null>(null);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewStart, setRenewStart] = useState('');
  const [renewEnd, setRenewEnd] = useState('');
  const [renewAmount, setRenewAmount] = useState('');
  const [renewError, setRenewError] = useState('');
  const [renewSuccess, setRenewSuccess] = useState('');
  const renewEndRef = useRef<HTMLInputElement>(null);
  const [viewingMemberId, setViewingMemberId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewMemberData, setViewMemberData] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
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

  // Fetch members function for reuse
  const fetchMembers = (pageToFetch = page) => {
    setLoading(true);
    fetch(`/api/members?page=${pageToFetch}&pageSize=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setMembers(data.members || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load members.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(members => members.filter(m => m.id !== id));
        setTotal(t => t - 1);
      } else {
        alert('Failed to delete member.');
      }
    } catch {
      alert('Failed to delete member.');
    }
  };

  const openRenewModal = (member: any) => {
    const today = new Date();
    const newStart = today.toISOString().slice(0, 10);
    const newEndDate = new Date(today);
    newEndDate.setMonth(today.getMonth() + 1);
    const newEnd = newEndDate.toISOString().slice(0, 10);
    setRenewingMember(member);
    setRenewStart(newStart);
    setRenewEnd(newEnd);
    setRenewAmount('');
    setRenewError('');
    setRenewSuccess('');
    setRenewModalOpen(true);
  };

  const closeRenewModal = () => {
    setRenewModalOpen(false);
    setRenewingMember(null);
    setRenewError('');
    setRenewSuccess('');
  };

  const handleQuickRenew = () => {
    const today = new Date();
    const newStart = today.toISOString().slice(0, 10);
    const newEndDate = new Date(today);
    newEndDate.setMonth(today.getMonth() + 1);
    const newEnd = newEndDate.toISOString().slice(0, 10);
    setRenewStart(newStart);
    setRenewEnd(newEnd);
    if (renewEndRef.current) renewEndRef.current.value = newEnd;
  };

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRenewError('');
    setRenewSuccess('');
    if (!renewStart || !renewEnd || renewAmount === '') {
      setRenewError('All fields are required.');
      return;
    }
    const start = new Date(renewStart);
    const end = new Date(renewEnd);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (end <= start) {
      setRenewError('End date must be after start date.');
      return;
    }
    try {
      const res = await fetch(`/api/members/${renewingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: renewingMember.name,
          phone: renewingMember.phone,
          membershipStart: renewStart,
          membershipEnd: renewEnd,
          amountPaid: parseFloat(renewAmount),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRenewSuccess('Membership renewed successfully!');
        setTimeout(() => {
          closeRenewModal();
          fetchMembers(1);
          setPage(1);
        }, 1000);
      } else {
        setRenewError(data.error || 'Failed to renew membership.');
      }
    } catch {
      setRenewError('Something went wrong.');
    }
  };

  const openViewModal = async (memberId: number) => {
    setViewingMemberId(memberId);
    setViewModalOpen(true);
    setViewLoading(true);
    setViewError('');
    setViewMemberData(null);
    try {
      const res = await fetch(`/api/members/${memberId}`);
      const data = await res.json();
      if (res.ok && data.member) {
        setViewMemberData(data.member);
      } else {
        setViewError(data.error || 'Failed to fetch member details.');
      }
    } catch {
      setViewError('Failed to fetch member details.');
    }
    setViewLoading(false);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewingMemberId(null);
    setViewMemberData(null);
    setViewError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
      {/* Header */}
      <header className="py-6 text-3xl font-bold text-blue-700 dark:text-blue-300 tracking-tight text-center border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur mb-8 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/dashboard" className="hover:underline focus:outline-none">Life Fitness Admin Dashboard</Link>
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
        <style>{blinkStyle}</style>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Gym Members</h1>
          <Link href="/dashboard/members/new" className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-800 transition">Add Member</Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Amount Paid</th>
                <th className="px-4 py-2 text-left">Days Left</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members
                .slice()
                .sort((a, b) => getDaysLeft(a.membershipEnd) - getDaysLeft(b.membershipEnd))
                .map(member => {
                  const daysLeft = getDaysLeft(member.membershipEnd);
                  let daysClass = '';
                  if (daysLeft === 3) daysClass = 'bg-yellow-200 text-yellow-900';
                  else if (daysLeft === 2) daysClass = 'bg-orange-300 text-orange-900';
                  else if (daysLeft === 1) daysClass = 'bg-red-500 text-white font-bold animate-blink';
                  else if (daysLeft === 0) daysClass = 'bg-red-700 text-white font-bold animate-blink';
                  return (
                    <tr key={member.id} className="border-t border-gray-200 dark:border-gray-800">
                      <td className="px-4 py-2">{member.name}</td>
                      <td className="px-4 py-2">{member.phone}</td>
                      <td className="px-4 py-2">{member.membershipStart ? new Date(member.membershipStart).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2">{member.membershipEnd ? new Date(member.membershipEnd).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2">Rs. {member.amountPaid?.toFixed(2)}</td>
                      <td className={`px-4 py-2 transition-all duration-300 ${daysClass}`} style={daysLeft <= 1 ? { animation: 'blink 1s infinite' } : {}}>{daysLeft}</td>
                      <td className="px-4 py-2">
                        {daysLeft > 0 ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Active</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <Link href={`/dashboard/members/${member.id}/edit`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">Edit</Link>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm" onClick={() => handleDelete(member.id)}>Delete</button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm" onClick={() => openRenewModal(member)}>Renew</button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm" onClick={() => openViewModal(member.id)}>View</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          {renewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" onClick={closeRenewModal}>&times;</button>
                <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">Renew Membership</h2>
                <div className="mb-2"><b>Name:</b> {renewingMember?.name}</div>
                <div className="mb-2"><b>Phone:</b> {renewingMember?.phone}</div>
                <div className="mb-2"><b>Current End Date:</b> {renewingMember?.membershipEnd ? new Date(renewingMember.membershipEnd).toLocaleDateString() : '-'}</div>
                <form onSubmit={handleRenewSubmit} className="flex flex-col gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">New Start Date</label>
                    <input type="date" value={renewStart} onChange={e => setRenewStart(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New End Date</label>
                    <input ref={renewEndRef} type="date" value={renewEnd} onChange={e => setRenewEnd(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount Paid (Rs.)</label>
                    <input type="number" min="0" step="0.01" value={renewAmount} onChange={e => setRenewAmount(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
                  </div>
                  <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition" onClick={handleQuickRenew}>Quick Renew (+1 Month)</button>
                  {(() => {
                    const start = new Date(renewStart);
                    const end = new Date(renewEnd);
                    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                    if (months > 1) {
                      return <div className="text-yellow-700 bg-yellow-100 rounded px-2 py-1 text-sm">You are renewing for more than 1 month. Please confirm the amount paid covers the full period.</div>;
                    }
                    return null;
                  })()}
                  {renewError && <div className="text-red-600 text-sm text-center">{renewError}</div>}
                  {renewSuccess && <div className="text-green-600 text-sm text-center">{renewSuccess}</div>}
                  <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800 transition mt-2 shadow disabled:opacity-60" disabled={loading}>{loading ? 'Renewing...' : 'Renew Membership'}</button>
                </form>
              </div>
            </div>
          )}
          {viewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-2xl relative print:static print:shadow-none print:bg-white print:dark:bg-white">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 print:hidden" onClick={closeViewModal}>&times;</button>
                <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300 print:hidden">Member Details</h2>
                {viewLoading ? (
                  <div>Loading...</div>
                ) : viewError ? (
                  <div className="text-red-600">{viewError}</div>
                ) : viewMemberData ? (
                  <>
                    {/* Invoice overlay */}
                    {showInvoice && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 print:bg-transparent print:relative print:inset-auto print:z-auto">
                        {/* Print-only CSS to show only invoice-section */}
                        <style>{`
                          @media print {
                            body * { visibility: hidden !important; }
                            #invoice-section, #invoice-section * { visibility: visible !important; }
                            #invoice-section {
                              position: absolute !important;
                              left: 0; top: 0; width: 100vw; min-height: 100vh; background: white !important; z-index: 9999;
                              box-shadow: none !important;
                            }
                          }
                        `}</style>
                        <div id="invoice-section" className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative print:shadow-none print:p-4 print:max-w-full print:rounded-none print:bg-white print:text-black text-gray-900">
                          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 print:hidden" onClick={() => setShowInvoice(false)}>&times;</button>
                          <div className="flex flex-col items-center mb-6">
                            <div className="text-2xl font-bold text-blue-700 mb-1 print:text-black">Life Fitness Gym Invoice</div>
                            <div className="text-sm text-gray-700 print:text-black mb-1">Phone: 03458308886</div>
                            <div className="text-sm text-gray-700 print:text-black mb-2 text-center">Killi Shaboo Chaman Housing Scheme, Quetta, 83700, Pakistan</div>
                            <div className="text-sm text-gray-500 mb-2 print:text-black">{new Date().toLocaleDateString()}</div>
                            <div className="w-16 h-1 bg-blue-200 rounded mb-4"></div>
                          </div>
                          <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Name:</b> <span className="font-normal print:text-black text-gray-900">{viewMemberData.name}</span></div>
                          <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Phone:</b> <span className="font-normal print:text-black text-gray-900">{viewMemberData.phone}</span></div>
                          <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Membership Period:</b> <span className="font-normal print:text-black text-gray-900">{viewMemberData.membershipStart ? new Date(viewMemberData.membershipStart).toLocaleDateString() : '-'} - {viewMemberData.membershipEnd ? new Date(viewMemberData.membershipEnd).toLocaleDateString() : '-'}</span></div>
                          {/* Show initial registration/payment info if no renewals */}
                          {(!viewMemberData.renewals || viewMemberData.renewals.length === 0) ? (
                            <>
                              <div className="w-full border-b border-gray-200 my-4"></div>
                              <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Amount Paid:</b> <span className="font-normal print:text-black text-gray-900">Rs. {viewMemberData.amountPaid?.toFixed(2)}</span></div>
                              <div className="mb-2 text-sm text-gray-500 print:text-black">No renewals have been made for this member yet.</div>
                            </>
                          ) : (
                            <>
                              <div className="w-full border-b border-gray-200 my-4"></div>
                              <div className="mb-2 font-semibold print:text-black text-gray-900">Last Renewal:</div>
                              <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Renewed By:</b> <span className="font-normal print:text-black text-gray-900">{viewMemberData.renewals[0].renewedBy?.name || viewMemberData.renewals[0].renewedBy?.email || 'Unknown'}</span></div>
                              <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Renewal Period:</b> <span className="font-normal print:text-black text-gray-900">{viewMemberData.renewals[0].renewStart ? new Date(viewMemberData.renewals[0].renewStart).toLocaleDateString() : '-'} - {viewMemberData.renewals[0].renewEnd ? new Date(viewMemberData.renewals[0].renewEnd).toLocaleDateString() : '-'}</span></div>
                              <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Amount Paid:</b> <span className="font-normal print:text-black text-gray-900">Rs. {viewMemberData.renewals[0].amountPaid?.toFixed(2)}</span></div>
                              <div className="mb-2 font-semibold print:text-black text-gray-900"><b>Renewed At:</b> <span className="font-normal print:text-black text-gray-900">{viewMemberData.renewals[0].createdAt ? new Date(viewMemberData.renewals[0].createdAt).toLocaleString() : '-'}</span></div>
                            </>
                          )}
                          <div className="w-full border-b border-gray-200 my-4"></div>
                          <div className="flex justify-between items-center mt-6 print:hidden">
                            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 mr-2" onClick={() => setShowInvoice(false)}>Close</button>
                            <button className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800" onClick={() => { window.print(); }}>Print</button>
                          </div>
                          {/* Electronically generated note */}
                          <div className="mt-8 text-center text-xs text-gray-500 print:text-gray-500">This is an electronically generated invoice and does not require a signature.</div>
                        </div>
                      </div>
                    )}
                    {/* End Invoice overlay */}
                    <div className="flex justify-end mb-2 print:hidden">
                      <button className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800" onClick={() => setShowInvoice(true)}>Print Invoice</button>
                    </div>
                    <div className="mb-2"><b>Name:</b> {viewMemberData.name}</div>
                    <div className="mb-2"><b>Phone:</b> {viewMemberData.phone}</div>
                    <div className="mb-2"><b>Membership Start:</b> {viewMemberData.membershipStart ? new Date(viewMemberData.membershipStart).toLocaleDateString() : '-'}</div>
                    <div className="mb-2"><b>Membership End:</b> {viewMemberData.membershipEnd ? new Date(viewMemberData.membershipEnd).toLocaleDateString() : '-'}</div>
                    <div className="mb-2"><b>Amount Paid:</b> Rs. {viewMemberData.amountPaid?.toFixed(2)}</div>
                    <div className="mb-4"><b>Status:</b> {getDaysLeft(viewMemberData.membershipEnd) > 0 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Active</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Inactive</span>
                    )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 mt-4">Renewal History</h3>
                    {viewMemberData.renewals && viewMemberData.renewals.length > 0 ? (
                      <div className={`overflow-x-auto ${viewMemberData.renewals.length > 4 ? 'max-h-56 overflow-y-auto border-t border-blue-200' : ''}`} style={{scrollbarWidth: 'thin'}}>
                        <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left">Renewed By</th>
                              <th className="px-3 py-2 text-left">Start</th>
                              <th className="px-3 py-2 text-left">End</th>
                              <th className="px-3 py-2 text-left">Amount</th>
                              <th className="px-3 py-2 text-left">Renewed At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {viewMemberData.renewals.map((renewal: any) => (
                              <tr key={renewal.id}>
                                <td className="px-3 py-2">{renewal.renewedBy?.name || renewal.renewedBy?.email || 'Unknown'}</td>
                                <td className="px-3 py-2">{renewal.renewStart ? new Date(renewal.renewStart).toLocaleDateString() : '-'}</td>
                                <td className="px-3 py-2">{renewal.renewEnd ? new Date(renewal.renewEnd).toLocaleDateString() : '-'}</td>
                                <td className="px-3 py-2">Rs. {renewal.amountPaid?.toFixed(2)}</td>
                                <td className="px-3 py-2">{renewal.createdAt ? new Date(renewal.createdAt).toLocaleString() : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-500">No renewals yet.</div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          )}
          </>
        )}
      </main>
    </div>
  );
} 