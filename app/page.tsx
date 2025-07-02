'use client';
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 relative">
          {/* Gym Name */}
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 tracking-tight">Life Fitness</div>
          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex gap-8 text-gray-700 dark:text-gray-200 font-medium">
            <li><a href="#" className="hover:text-blue-700">Home</a></li>
            <li><a href="#features" className="hover:text-blue-700">Features</a></li>
            <li><a href="#trainers" className="hover:text-blue-700">Trainers</a></li>
            <li><a href="#membership" className="hover:text-blue-700">Membership</a></li>
            <li><a href="#contact" className="hover:text-blue-700">Contact</a></li>
          </ul>
          {/* Desktop Login Button */}
          <a href="/login" className="ml-4 bg-blue-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-800 transition text-sm shadow hidden md:inline-block">Login</a>
          {/* Hamburger Icon */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-7 h-7 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 md:hidden animate-fade-in z-50">
              <ul className="flex flex-col gap-2 py-4 px-6 text-gray-700 dark:text-gray-200 font-medium">
                <li><a href="#" className="block py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Home</a></li>
                <li><a href="#features" className="block py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Features</a></li>
                <li><a href="#trainers" className="block py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Trainers</a></li>
                <li><a href="#membership" className="block py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Membership</a></li>
                <li><a href="#contact" className="block py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Contact</a></li>
                <li><a href="/login" className="block py-2 bg-blue-700 text-white rounded-full text-center font-semibold hover:bg-blue-800 transition mt-2" onClick={() => setMenuOpen(false)}>Login</a></li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">Life Fitness</h1>
        <p className="text-lg sm:text-2xl mb-8 max-w-2xl mx-auto font-medium">Unleash your potential. Modern equipment, expert trainers, and a community that motivates you every day.</p>
        <a href="#membership" className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-100 transition">Join Now</a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 max-w-5xl mx-auto grid gap-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Why Choose Life Fitness?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/file.svg" alt="Equipment" width={40} height={40} className="mb-4" />
            <h3 className="font-semibold text-lg mb-2">State-of-the-Art Equipment</h3>
            <p className="text-gray-600 dark:text-gray-300">Train with the latest machines and free weights for all fitness levels.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/window.svg" alt="Trainers" width={40} height={40} className="mb-4" />
            <h3 className="font-semibold text-lg mb-2">Expert Trainers</h3>
            <p className="text-gray-600 dark:text-gray-300">Certified professionals to guide, motivate, and personalize your workouts.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/globe.svg" alt="Community" width={40} height={40} className="mb-4" />
            <h3 className="font-semibold text-lg mb-2">Supportive Community</h3>
            <p className="text-gray-600 dark:text-gray-300">Join group classes, events, and a community that keeps you accountable.</p>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-16 px-4 bg-blue-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Meet Our Trainers</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center w-64">
            <Image src="/vercel.svg" alt="Trainer 1" width={64} height={64} className="mb-4 rounded-full" />
            <h3 className="font-semibold text-lg mb-1">Alex Carter</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">Strength & Conditioning</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">10+ years experience. Passionate about helping you reach your goals.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center w-64">
            <Image src="/vercel.svg" alt="Trainer 2" width={64} height={64} className="mb-4 rounded-full" />
            <h3 className="font-semibold text-lg mb-1">Maya Lee</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">Yoga & Mobility</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Certified yoga instructor. Focused on flexibility and holistic health.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center w-64">
            <Image src="/vercel.svg" alt="Trainer 3" width={64} height={64} className="mb-4 rounded-full" />
            <h3 className="font-semibold text-lg mb-1">Chris Evans</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">Personal Trainer</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Personalized plans and 1-on-1 coaching for all fitness levels.</p>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Membership Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 flex flex-col items-center border-2 border-blue-600">
            <h3 className="font-semibold text-xl mb-2">Basic</h3>
            <p className="text-3xl font-bold mb-4">$29<span className="text-base font-normal">/mo</span></p>
            <ul className="text-gray-600 dark:text-gray-300 mb-6 text-sm space-y-2">
              <li>24/7 Gym Access</li>
              <li>Locker Room</li>
              <li>1 Group Class/week</li>
            </ul>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Get Started</button>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 flex flex-col items-center border-2 border-indigo-700 scale-105 z-10">
            <h3 className="font-semibold text-xl mb-2">Premium</h3>
            <p className="text-3xl font-bold mb-4">$49<span className="text-base font-normal">/mo</span></p>
            <ul className="text-gray-600 dark:text-gray-300 mb-6 text-sm space-y-2">
              <li>All Basic Features</li>
              <li>Unlimited Classes</li>
              <li>Personal Trainer (2 sessions/mo)</li>
              <li>Sauna & Spa Access</li>
            </ul>
            <button className="bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-800 transition">Get Started</button>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 flex flex-col items-center border-2 border-gray-300">
            <h3 className="font-semibold text-xl mb-2">Elite</h3>
            <p className="text-3xl font-bold mb-4">$79<span className="text-base font-normal">/mo</span></p>
            <ul className="text-gray-600 dark:text-gray-300 mb-6 text-sm space-y-2">
              <li>All Premium Features</li>
              <li>Unlimited PT Sessions</li>
              <li>Nutrition Consultation</li>
              <li>VIP Lounge</li>
            </ul>
            <button className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-900 transition">Get Started</button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Contact Us</h2>
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8">
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Your Name" className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Your Email" className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Your Message" rows={4} className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Send Message</button>
          </form>
          <div className="mt-6 text-center text-gray-600 dark:text-gray-300">
            Or email us at <a href="mailto:info@lifefitness.com" className="text-blue-700 dark:text-blue-300 underline">info@lifefitness.com</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-center gap-6 mb-2">
          <a href="#" className="hover:text-blue-700">Instagram</a>
          <a href="#" className="hover:text-blue-700">Facebook</a>
          <a href="#" className="hover:text-blue-700">Twitter</a>
        </div>
        <div>© {new Date().getFullYear()} Life Fitness. All rights reserved.</div>
      </footer>
    </div>
  );
}
