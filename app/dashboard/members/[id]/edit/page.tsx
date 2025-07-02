'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92');
  const [membershipStart, setMembershipStart] = useState('');
  const [membershipEnd, setMembershipEnd] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/members/${id}`)
      .then(res => res.json())
      .then(data => {
        const member = data.member;
        if (member) {
          setName(member.name || '');
          setPhone(member.phone || '+92');
          setMembershipStart(member.membershipStart ? member.membershipStart.slice(0, 10) : '');
          setMembershipEnd(member.membershipEnd ? member.membershipEnd.slice(0, 10) : '');
          setAmountPaid(member.amountPaid?.toString() || '');
        } else {
          setError('Member not found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load member.');
        setLoading(false);
      });
  }, [id]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('92')) digits = digits.slice(2);
    digits = digits.slice(0, 10);
    setPhone('+92' + digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim() || !phone.trim() || !membershipStart || !membershipEnd || amountPaid === '') {
      setError('All fields are required.');
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.startsWith('+92') || phoneDigits.length !== 12) {
      setError('Phone must start with +92 and be followed by 10 digits.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          membershipStart,
          membershipEnd,
          amountPaid: parseFloat(amountPaid),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Member updated successfully!');
        setTimeout(() => router.push('/dashboard/members'), 1000);
      } else {
        setError(data.error || 'Failed to update member.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">Edit Member</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-center mb-4">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="text" value={phone} onChange={handlePhoneChange} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required maxLength={13} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Membership Start</label>
            <input type="date" value={membershipStart} onChange={e => setMembershipStart(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Membership End</label>
            <input type="date" value={membershipEnd} onChange={e => setMembershipEnd(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount Paid (Rs.)</label>
            <input type="number" min="0" step="0.01" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-800 transition mt-2 shadow disabled:opacity-60" disabled={loading}>{loading ? 'Updating...' : 'Update Member'}</button>
        </form>
      )}
    </div>
  );
} 