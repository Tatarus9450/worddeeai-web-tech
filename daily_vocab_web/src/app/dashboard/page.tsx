"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  day_streak: number;
  total_minutes: number;
  hours: number;
  minutes: number;
  time_display: string;
  practiced_today: boolean;
}

interface PracticeHistory {
  id: number;
  word: string;
  difficulty_level: string;
  score: number;
  user_sentence: string;
  feedback: string;
  practiced_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    day_streak: 0,
    total_minutes: 0,
    hours: 0,
    minutes: 0,
    time_display: "0m",
    practiced_today: false
  });
  const [history, setHistory] = useState<PracticeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popup, setPopup] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await fetch('/api/dashboard-stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch practice history
        const historyRes = await fetch('/api/practice-history');
        const historyData = await historyRes.json();
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-[#E7FFDE] text-[#0E6700]';
      case 'Intermediate': return 'bg-[#FFF3CD] text-[#856404]';
      case 'Advanced': return 'bg-[#F8D7DA] text-[#721C24]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-[#0E6700]';
    if (score >= 5) return 'text-[#856404]';
    return 'text-[#721C24]';
  };

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Body Content */}
      <div
        className="max-w-[1048px] mx-auto px-4 py-8 flex flex-col gap-8 h-full overflow-hidden"
        style={{
          transform: 'scale(0.9)',
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
          {isLoading ? (
            <div className="flex items-center px-8 py-5 bg-[#F1F6F6] rounded-[20px]">
              <p className="text-[18px] leading-[23px] font-bold text-gray-400 font-merriweather">
                Checking missions...
              </p>
            </div>
          ) : stats.practiced_today ? (
            <div className="flex items-center px-8 py-5 bg-[#F1F6F6] rounded-[20px]">
              <p className="text-[18px] leading-[23px] font-bold text-black/80 font-merriweather">
                Well done! You{"'"}ve completed all your missions.
              </p>
            </div>
          ) : (
            <div className="flex items-center px-8 py-5 bg-[#FFF4E5] rounded-[20px] border border-[#FFD8A8]">
              <p className="text-[18px] leading-[23px] font-bold text-[#D97706] font-merriweather">
                You haven{"'"}t practiced yet. Start your daily session now!
              </p>
            </div>
          )}
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
                <span className="text-[32px] leading-[40px] font-bold text-black/80 font-merriweather">
                  {isLoading ? '-' : stats.day_streak}
                </span>
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
                <span className="text-[32px] leading-[40px] font-bold text-black/80 font-merriweather">
                  {isLoading ? '-' : stats.time_display}
                </span>
              </div>
              <p className="text-[20px] leading-[23px] font-light text-black/80 font-roboto">Time learned</p>
            </div>
          </div>
        </div>

        {/* Practice History Section */}
        <div className="flex flex-col border border-[#D4D4D4] rounded-[20px] bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-[#F1F6F6] border-b border-[#D4D4D4]">
            <h3 className="text-[24px] leading-[30px] font-bold text-primary font-merriweather">
              Practice History
            </h3>
            <span className="text-[16px] text-primary/70 font-roboto">
              {history.length} sessions
            </span>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center p-16">
              <p className="text-[20px] text-gray-400 font-roboto">Loading...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 gap-4">
              <p className="text-[24px] text-gray-400 font-merriweather">No practice sessions yet</p>
              <p className="text-[16px] text-gray-400 font-roboto">Start practicing to see your history here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="w-full relative">
                <thead className="bg-[#E7FFDE] border-b border-[#D4D4D4] sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-left text-[14px] font-bold text-primary font-merriweather">Word</th>
                    <th className="px-4 py-3 text-left text-[14px] font-bold text-primary font-merriweather">Level</th>
                    <th className="px-4 py-3 text-center text-[14px] font-bold text-primary font-merriweather">Score</th>
                    <th className="px-4 py-3 text-left text-[14px] font-bold text-primary font-merriweather">Your Sentence</th>
                    <th className="px-4 py-3 text-left text-[14px] font-bold text-primary font-merriweather">Suggestion</th>
                    <th className="px-4 py-3 text-left text-[14px] font-bold text-primary font-merriweather">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id} className={`border-b border-gray-100 hover:bg-[#F1F6F6]/50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="px-4 py-4">
                        <span className="text-[16px] font-bold text-primary font-merriweather">{item.word}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${getLevelBadgeColor(item.difficulty_level)}`}>
                          {item.difficulty_level}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[18px] font-bold font-merriweather ${getScoreColor(item.score)}`}>
                          {item.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        <p
                          className="text-[14px] text-primary/80 font-roboto truncate cursor-pointer hover:text-primary hover:underline"
                          title="Click to view full text"
                          onClick={() => setPopup({ title: 'Your Sentence', content: item.user_sentence })}
                        >
                          {item.user_sentence}
                        </p>
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        <p
                          className="text-[14px] text-primary/70 font-roboto italic truncate cursor-pointer hover:text-primary hover:underline"
                          title="Click to view full text"
                          onClick={() => setPopup({ title: 'Suggestion', content: item.feedback })}
                        >
                          {item.feedback}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-primary/60 font-roboto whitespace-nowrap">
                          {formatDate(item.practiced_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Button */}
          <div className="flex justify-center py-6 bg-[#F1F6F6] border-t border-[#D4D4D4]">
            <Link
              href="/word-of-the-day"
              className="rounded-[40px] bg-primary px-8 py-3 text-[20px] leading-[25px] font-bold text-[#FBFCFD] font-merriweather hover:bg-[#1a3533] transition"
            >
              Practice New Word
            </Link>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setPopup(null)}>
          <div
            className="bg-white rounded-[25px] p-8 max-w-[625px] w-[90%] max-h-[80vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setPopup(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <h3 className="text-[36px] font-bold text-primary font-merriweather mb-5 pr-12">
              {popup.title}
            </h3>

            {/* Content */}
            <p className="text-[24px] text-primary/80 font-roboto leading-relaxed">
              {popup.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
