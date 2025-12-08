"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [totalPractices, setTotalPractices] = useState(0);
  const [learningTime, setLearningTime] = useState(0);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('wordHistory') || '[]');
    setTotalPractices(history.length);
    // Estimate learning time: 10 mins per word for realistic mock
    // Estimate learning time: 10 mins per word for realistic mock
    setLearningTime(10);
  }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <h1 className="mb-6 text-4xl font-bold text-primary font-serif">Guest's learner dashboard</h1>

      {/* Your missions today */}
      <h2 className="mb-4 text-xl font-bold text-primary font-serif">Your missions today</h2>
      <div className="mb-10 rounded-lg bg-[#f0f2f1] px-6 py-4 text-primary font-medium">
        Well done! You've completed all your missions.
      </div>

      {/* Overview */}
      <h2 className="mb-6 text-2xl font-bold text-primary font-serif">Overview</h2>

      {/* Learning consistency */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h3 className="mb-8 text-lg font-bold text-primary font-serif">Learning consistency</h3>
        <div className="flex flex-col justify-around gap-12 md:flex-row">

          {/* Day Streak */}
          <div className="flex flex-col items-center">
            <div className="mb-3 flex items-center space-x-3">
              {/* Flame Icon */}
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 0C25 0 8 13 8 28C8 38 16 45 25 45C34 45 42 38 42 28C42 13 25 0 25 0Z" fill="#A3E635" />
                <path d="M25 15C25 15 16 21 16 29C16 34 20 37 25 37C30 37 34 34 34 29C34 21 25 15 25 15Z" fill="#ECFCCB" />
              </svg>
              <span className="text-4xl font-bold font-serif text-[#333333]">1</span>
            </div>
            <p className="text-sm text-gray-500">Day streak</p>
          </div>

          {/* Time Learned */}
          <div className="flex flex-col items-center">
            <div className="mb-3 flex items-center space-x-3">
              {/* Clock Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-[#60a5fa]">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
              <span className="text-4xl font-bold text-primary">{learningTime}</span>
            </div>
            <p className="text-sm text-gray-500">[Hours / Minutes] learned</p>
          </div>

        </div>
      </div>

      {/* Test / Visuals Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm min-h-[500px] flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Dropdown 1 */}
            <div className="flex items-center space-x-1 font-bold text-gray-700 cursor-pointer">
              <span>IELTS speaking test</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            {/* Dropdown 2 */}
            <div className="flex items-center space-x-1 font-bold text-gray-700 cursor-pointer">
              <span>All parts</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
          <button className="text-xs font-medium text-blue-400 hover:text-blue-600 hover:underline">View scoring criteria</button>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-primary mb-auto">
          <span>Latest band scores</span>
          <span>Progress</span>
        </div>

        {/* Placeholder Area */}
        <div className="flex-grow flex items-center justify-center">
          <p className="text-2xl text-gray-400 font-medium text-center">&lt;Create your own data visualization graph or table &gt;</p>
        </div>

        <div className="mt-8 flex justify-center pb-4">
          <Link href="/" className="rounded-full bg-primary px-16 py-3 font-medium text-white shadow-lg transition hover:bg-[#15332e] font-serif">
            Take the test
          </Link>
        </div>
      </div>
    </div>
  );
}
