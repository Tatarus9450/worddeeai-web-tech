"use client";

import BarChart from "@/components/BarChart";
import RecentHistory from "@/components/RecentHistory";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [totalPractices, setTotalPractices] = useState(0);
  const [learningTime, setLearningTime] = useState(0); // Mocked for now

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('wordHistory') || '[]');
    setTotalPractices(history.length);
    // Estimate learning time: 5 mins per word
    setLearningTime(history.length * 5);
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <h1 className="mb-6 text-3xl font-bold text-primary font-serif">Guest's learner dashboard</h1>

      {/* Your missions today */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-primary font-serif">Your missions today</h2>
        <div className="rounded-xl bg-gray-100 p-4 text-gray-700">
          Well done! You've completed all your missions.
        </div>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-primary font-serif">Overview</h2>

        {/* Learning consistency */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-primary font-serif">Learning consistency</h3>
          <div className="flex flex-col justify-around gap-8 md:flex-row">

            {/* Day Streak */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-4xl">🔥</span>
                <span className="text-3xl font-bold text-gray-900">1</span>
              </div>
              <p className="text-sm text-gray-500">Day streak</p>
            </div>

            {/* Time Learned */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-4xl">🕒</span>
                <span className="text-3xl font-bold text-gray-900">{Math.floor(learningTime / 60)}</span>
                <span className="text-xl text-gray-500">h</span>
                <span className="text-3xl font-bold text-gray-900">{learningTime % 60}</span>
                <span className="text-xl text-gray-500">m</span>
              </div>
              <p className="text-sm text-gray-500">[Hours / Minutes] learned</p>
            </div>

          </div>
        </div>

        {/* Data Visualization / Test Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900">Vocabulary Practice</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <button className="text-xs text-blue-500 hover:underline">View scoring criteria</button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-sm font-bold text-gray-700">Latest scores</h4>
              <RecentHistory />
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold text-gray-700">Progress</h4>
              <BarChart />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/" className="rounded-full bg-primary px-8 py-3 font-medium text-white shadow-lg transition hover:bg-[#15332e] font-serif">
              Take the test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
