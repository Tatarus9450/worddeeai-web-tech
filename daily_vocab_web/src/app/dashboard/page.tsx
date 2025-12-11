"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [totalPractices, setTotalPractices] = useState(0);
  const [learningTime, setLearningTime] = useState(10);
  const [dayStreak, setDayStreak] = useState(1);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('wordHistory') || '[]');
    setTotalPractices(history.length);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Body Content */}
      <div
        className="max-w-[1048px] mx-auto px-4 py-8 flex flex-col gap-8"
        style={{
          transform: 'scale(0.8)',
          transformOrigin: 'top center'
        }}
      >
        {/* Page Header */}
        <h1 className="text-[40px] leading-[50px] font-bold text-primary font-merriweather">
          My Progress
        </h1>

        {/* Section: Your missions today */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[32px] leading-[40px] font-bold text-primary font-merriweather">
            Your missions today
          </h2>

          {/* Mission Item */}
          <div className="flex items-center px-8 py-5 bg-[#F1F6F6] rounded-[20px]">
            <p className="text-[18px] leading-[23px] font-bold text-black/80 font-merriweather">
              Well done! You've completed all your missions.
            </p>
          </div>
        </div>

        {/* Section: Overview */}
        <h2 className="text-[32px] leading-[40px] font-bold text-primary font-merriweather">
          Overview
        </h2>

        {/* Learning Consistency Card */}
        <div className="flex flex-col gap-10 p-5 border border-[#D4D4D4] rounded-[20px] bg-white">
          <h3 className="text-[24px] leading-[30px] font-bold text-primary font-merriweather">
            Learning consistency
          </h3>

          <div className="flex justify-center gap-4">
            {/* Day Streak */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                {/* Flame Icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C16 0 5 8 5 18C5 24 10 29 16 29C22 29 27 24 27 18C27 8 16 0 16 0Z" fill="#B2E362" />
                  <path d="M16 10C16 10 10 14 10 19C10 22 12 24 16 24C20 24 22 22 22 19C22 14 16 10 16 10Z" fill="#E7FFDE" />
                </svg>
                <span className="text-[32px] leading-[40px] font-bold text-black/80 font-merriweather">{dayStreak}</span>
              </div>
              <p className="text-[20px] leading-[23px] font-light text-black/80 font-roboto">Day streak</p>
            </div>

            {/* Time Learned */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                {/* Clock Icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="#8FBFFA" />
                  <path d="M16 8V16H22" stroke="#2859C5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[32px] leading-[40px] font-bold text-black/80 font-merriweather">{learningTime}</span>
              </div>
              <p className="text-[20px] leading-[23px] font-light text-black/80 font-roboto">[Hours / Minutes] learned</p>
            </div>
          </div>
        </div>

        {/* Data Visualization Section */}
        <div className="flex flex-col border border-[#D4D4D4] rounded-lg bg-white min-h-[780px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-8">
              {/* Dropdown 1 */}
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-[18px] leading-[23px] font-bold text-primary font-merriweather">IELTS speaking test</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {/* Dropdown 2 */}
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-[18px] leading-[23px] font-bold text-primary font-merriweather">All parts</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            <button className="text-[16px] font-normal text-[#1DA4DE] underline opacity-80 hover:opacity-100 font-roboto">
              View scoring criteria
            </button>
          </div>

          {/* Labels */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[15px] leading-[19px] font-bold text-primary font-merriweather">Latest band scores</span>
            <span className="text-[15px] leading-[19px] font-bold text-primary font-merriweather">Progress</span>
          </div>

          {/* Placeholder Area */}
          <div className="flex-grow flex items-center justify-center p-8">
            <p className="text-[40px] leading-[48px] font-normal text-[#A2A2A2] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              &lt;Create your own data visualization graph or table &gt;
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-center pb-8">
            <Link
              href="/word-of-the-day"
              className="rounded-[40px] bg-primary px-8 py-2 text-[20px] leading-[25px] font-bold text-[#FBFCFD] font-merriweather hover:bg-[#1a3533] transition"
            >
              Take the test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
