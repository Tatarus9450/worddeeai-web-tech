"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Word } from '@/types';

const API_BASE_URL = '/api';

export default function Home() {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [sentence, setSentence] = useState('');
    const [score, setScore] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [sentence]);

    const getRandomWord = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/word`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data: Word = await response.json();
            setCurrentWord(data);
            setSentence('');
            setScore(0);
            setFeedbackMessage('');
            setIsSubmitted(false);
        } catch (err) {
            console.error('Error fetching word:', err);
            setCurrentWord(null);
            setError('ไม่สามารถดึงคำศัพท์ได้ กรุณาลองใหม่');
        }
    }, []);

    useEffect(() => {
        getRandomWord();
    }, [getRandomWord]);

    const handleSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSentence(e.target.value);
        if (isSubmitted) setIsSubmitted(false);
        setFeedbackMessage('');
        setError(null);
    };

    const handleSubmitSentence = async () => {
        if (!currentWord || !sentence.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/validate-sentence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word_id: currentWord.id, sentence: sentence.trim() }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const numericScore = typeof result.score === 'number' ? result.score : Number(result.score || 0);

            setScore(numericScore);
            setFeedbackMessage(result.suggestion || '');
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error validating sentence:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดระหว่างประเมินประโยค');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextWord = () => {
        setError(null);
        getRandomWord();
    };

    if (!currentWord) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4 text-white">
                {error ? (
                    <>
                        <p className="text-lg text-red-200">{error}</p>
                        <button onClick={getRandomWord} className="rounded-lg bg-white px-6 py-3 font-medium text-primary shadow-md hover:bg-gray-100">
                            Try Again
                        </button>
                    </>
                ) : (
                    <p>Loading word...</p>
                )}
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-2xl md:p-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary font-serif">Word of the day</h1>
                    <p className="mt-2 text-gray-500">Practice writing a meaningful sentence using today's word.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-12">
                    {/* Left Column: Image */}
                    <div className="md:col-span-5">
                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-200 shadow-inner">
                            {/* Placeholder Image matching the vibe */}
                            <img
                                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop"
                                alt="Word context"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                        <div className="relative rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="absolute -top-3 right-6 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-primary shadow-sm font-serif">
                                Level {currentWord.difficulty_level}
                            </div>

                            <div className="mb-4 flex items-center space-x-3">
                                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                                        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                                    </svg>
                                </button>
                                <h2 className="text-4xl font-bold text-primary font-serif">{currentWord.word}</h2>
                            </div>

                            <div className="mb-2 text-gray-500">
                                <span className="italic">Noun</span> <span className="text-gray-400">[{currentWord.word.toLowerCase()}]</span>
                            </div>

                            <div className="mb-4">
                                <span className="font-bold text-gray-900">Meaning: </span>
                                <span className="text-gray-600">{currentWord.definition}</span>
                            </div>

                            <p className="text-gray-500 italic">"The jet braked hard as its wheels touched the <span className="underline decoration-gray-400 decoration-2">{currentWord.word.toLowerCase()}</span>."</p>
                        </div>

                        <div className="mt-6">
                            <textarea
                                ref={textareaRef}
                                className="w-full resize-none overflow-hidden rounded-lg border border-gray-200 p-4 text-lg text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                rows={3}
                                placeholder={`The word "${currentWord.word.toLowerCase()}" is English language.`}
                                value={sentence}
                                onChange={handleSentenceChange}
                                disabled={isSubmitted || isSubmitting}
                            ></textarea>
                        </div>

                        {/* Feedback Area */}
                        {isSubmitted && (
                            <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-primary">Score: {score.toFixed(1)}</span>
                                </div>
                                <p className="text-sm text-gray-600">{feedbackMessage}</p>
                            </div>
                        )}

                        <div className="mt-8 flex items-center justify-between">
                            <button
                                onClick={handleNextWord}
                                className="rounded-full border border-gray-300 px-8 py-3 font-medium text-gray-700 transition hover:bg-gray-50 font-serif"
                            >
                                Do it later
                            </button>
                            <button
                                onClick={handleSubmitSentence}
                                disabled={!sentence.trim() || isSubmitting}
                                className="rounded-full bg-primary px-10 py-3 font-medium text-white shadow-lg transition hover:bg-[#15332e] disabled:opacity-70 font-serif"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
