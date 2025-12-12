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
    const [wordImage, setWordImage] = useState<string>('');
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
            setError('System can\'t fetch word - Please try again');
        }
    }, []);

    useEffect(() => {
        getRandomWord();
    }, [getRandomWord]);

    // Fetch word image from Pexels
    useEffect(() => {
        if (currentWord?.word) {
            fetch(`/api/word-image?query=${encodeURIComponent(currentWord.word)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.url) {
                        setWordImage(data.url);
                    }
                })
                .catch(err => console.error('Error fetching word image:', err));
        }
    }, [currentWord?.word]);

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
        setWordImage(''); // Reset image immediately for faster UX
        getRandomWord();
    };

    // Loading Skeleton UI
    if (!currentWord) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#25444180' }}>
                <div
                    className="w-full max-w-[1000px] rounded-[20px] bg-white p-10 shadow-2xl md:p-12"
                    style={{
                        transform: 'scale(0.9)',
                        transformOrigin: 'top center'
                    }}
                >
                    {/* Skeleton Header */}
                    <div className="flex flex-col items-center gap-2 mb-9">
                        <div className="w-full h-[54px] bg-[#F6F6F6] rounded animate-pulse"></div>
                        <div className="w-[100px] h-[100px] bg-[#F6F6F6] rounded-full animate-pulse"></div>
                        <div className="w-[468px] h-[21px] bg-[#F6F6F6] rounded animate-pulse"></div>
                    </div>

                    {/* Skeleton Dialog boxes */}
                    <div className="flex flex-col gap-4 mb-9">
                        <div className="w-full h-[56px] bg-[#F6F6F6] rounded-[10px] animate-pulse"></div>
                        <div className="w-full h-[118px] bg-[#F6F6F6] rounded-[10px] animate-pulse"></div>
                    </div>

                    {/* Skeleton Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="w-[183px] h-[72px] bg-[#F6F6F6] rounded-[40px] animate-pulse"></div>
                        <div className="w-[154px] h-[72px] bg-[#F6F6F6] rounded-[40px] animate-pulse"></div>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-[20px]">
                            <p className="text-lg text-red-500 mb-4">{error}</p>
                            <button onClick={getRandomWord} className="rounded-[40px] bg-primary px-8 py-4 text-[20px] font-bold text-white font-merriweather hover:bg-[#1a3533]">
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Submitting Loading Screen - While waiting for API
    if (isSubmitting) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#25444180' }}>
                <div
                    className="w-full max-w-[1000px] rounded-[20px] bg-white p-10 shadow-2xl md:p-12"
                    style={{
                        transform: 'scale(0.9)',
                        transformOrigin: 'top center'
                    }}
                >
                    {/* Skeleton Header */}
                    <div className="flex flex-col items-center gap-2 mb-9">
                        <div className="w-full h-[54px] bg-[#F6F6F6] rounded animate-pulse"></div>
                        <div className="w-[100px] h-[100px] bg-[#F6F6F6] rounded-full animate-pulse"></div>
                        <div className="w-[468px] h-[21px] bg-[#F6F6F6] rounded animate-pulse"></div>
                    </div>

                    {/* Skeleton Dialog boxes */}
                    <div className="flex flex-col gap-4 mb-9">
                        <div className="w-full h-[56px] bg-[#F6F6F6] rounded-[10px] animate-pulse"></div>
                        <div className="w-full h-[118px] bg-[#F6F6F6] rounded-[10px] animate-pulse"></div>
                    </div>

                    {/* Skeleton Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="w-[183px] h-[72px] bg-[#F6F6F6] rounded-[40px] animate-pulse"></div>
                        <div className="w-[154px] h-[72px] bg-[#F6F6F6] rounded-[40px] animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Success Screen - After Submit
    if (isSubmitted) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#25444180' }}>
                <div
                    className="w-full max-w-[1000px] rounded-[20px] bg-white p-10 shadow-2xl md:p-12 flex flex-col items-center gap-8"
                    style={{
                        transform: 'scale(0.9)',
                        transformOrigin: 'top center'
                    }}
                >
                    {/* Header: Challenge completed */}
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-[32px] leading-[40px] font-bold text-primary font-merriweather text-center">
                            Challenge completed
                        </h2>
                        {/* Tags */}
                        <div className="flex gap-4">
                            <div className="rounded-[20px] bg-accent px-4 py-2.5 text-[18px] leading-[23px] font-bold text-[#474747] font-merriweather">
                                Level {currentWord?.difficulty_level || 'Beginner'}
                            </div>
                            <div className="rounded-[20px] bg-[#F3EDF7] px-4 py-2.5 text-[18px] leading-[23px] font-bold text-[#474747] font-merriweather">
                                Score {score.toFixed(1)}
                            </div>
                        </div>
                    </div>

                    {/* Dialog boxes */}
                    <div className="w-full flex flex-col gap-4">
                        {/* Your sentence box */}
                        <div className="w-full rounded-[10px] bg-white shadow-[0px_1px_9.1px_-3px_rgba(0,0,0,0.16)] p-4 border-l-4 border-gray-300">
                            <p className="text-[16px] leading-[19px] text-primary font-roboto">
                                <span className="font-bold">Your sentence: </span>
                                {sentence}
                            </p>
                        </div>

                        {/* Suggestion box */}
                        <div className="w-full rounded-[10px] bg-[#E7FFDE] shadow-[0px_1px_9.1px_-3px_rgba(0,0,0,0.16)] p-4 flex flex-col gap-2 border-l-4 border-[#B2E362]">
                            <p className="text-[16px] leading-[19px] font-bold text-primary font-roboto">
                                คำแนะนำจาก AI:
                            </p>
                            <p className="text-[16px] leading-[19px] font-light italic text-primary font-roboto">
                                {feedbackMessage || "ยอดเยี่ยม! ประโยคของคุณแสดงความเข้าใจคำศัพท์ได้ดีมาก"}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="w-full flex items-center justify-between">
                        <button
                            onClick={() => {
                                setSentence('');
                                setIsSubmitted(false);
                            }}
                            className="rounded-[40px] border border-[#98A7A5] bg-[#FBFCFD] px-8 py-5 text-[24px] leading-[30px] font-bold text-primary transition hover:bg-gray-50 font-merriweather"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="rounded-[40px] bg-primary px-8 py-5 text-[24px] leading-[30px] font-bold text-[#FBFCFD] shadow-md transition hover:bg-[#1a3533] font-merriweather"
                        >
                            View my progress
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#25444180' }}>
            <div
                className="w-full max-w-[1000px] rounded-[20px] bg-white p-10 shadow-2xl md:p-12"
                style={{
                    transform: 'scale(0.9)',
                    transformOrigin: 'top center'
                }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[32px] leading-[40px] font-bold text-primary font-merriweather">Word of the day</h1>
                    <p className="mt-2 text-[18px] leading-[21px] text-primary font-roboto font-light">Practice writing a meaningful sentence using today's word.</p>
                </div>

                {/* Main content grid */}
                <div className="flex gap-11">
                    {/* Left: Image - 240x240px */}
                    <div className="flex-shrink-0">
                        <div className="w-60 h-60 overflow-hidden rounded-[16.87px] bg-gray-200">
                            {wordImage ? (
                                <img
                                    src={wordImage}
                                    alt={currentWord?.word || 'Word context'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-[#F6F6F6] animate-pulse"></div>
                            )}
                        </div>
                    </div>

                    {/* Right: Word info with border */}
                    <div className="flex-1 relative rounded-[20px] border border-border p-4 gap-4 flex flex-col">
                        {/* Level badge */}
                        <div className="absolute -top-[26px] right-4 rounded-[20px] bg-accent px-4 py-2.5 text-[18px] leading-[23px] font-bold text-[#474747] font-merriweather">
                            Level {currentWord?.difficulty_level || 'Beginner'}
                        </div>

                        {/* Word with play icon */}
                        <div className="flex items-center gap-4">
                            <button className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FBFCFD] shadow text-primary hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <h2 className="text-[32px] leading-[40px] font-bold text-primary font-merriweather">{currentWord.word}</h2>
                        </div>

                        {/* Part of speech and pronunciation */}
                        <div className="text-[18px] leading-[21px] text-primary font-roboto font-light italic">
                            {currentWord.part_of_speech || 'noun'} [{currentWord.pronunciation || currentWord.word}]
                        </div>

                        {/* Meaning */}
                        <div className="text-[18px] leading-[21px] text-primary font-roboto">
                            <span className="font-bold">Meaning: </span>
                            <span className="font-bold">{currentWord.definition}</span>
                        </div>

                        {/* Example sentence */}
                        <p className="text-[18px] leading-[21px] text-primary font-roboto font-light">"{currentWord.example_sentence || `Use the word "${currentWord.word}" in a sentence.`}"</p>
                    </div>
                </div>

                {/* Text input */}
                <div className="mt-8">
                    <textarea
                        ref={textareaRef}
                        className="w-full resize-none overflow-hidden rounded border border-border p-4 text-[20px] leading-[23px] text-primary placeholder-primary font-roboto font-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                        rows={2}
                        placeholder={`Enter your sentence`}
                        value={sentence}
                        onChange={handleSentenceChange}
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={handleNextWord}
                        className="rounded-[40px] border border-[#98A7A5] bg-[#FBFCFD] px-8 py-5 text-[24px] leading-[30px] font-bold text-primary transition hover:bg-gray-50 font-merriweather"
                    >
                        Do it later
                    </button>
                    <button
                        onClick={handleSubmitSentence}
                        disabled={!sentence.trim() || isSubmitting}
                        className="rounded-[40px] bg-primary px-8 py-5 text-[24px] leading-[30px] font-bold text-[#FBFCFD] shadow-md transition hover:bg-[#1a3533] disabled:opacity-70 font-merriweather"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
