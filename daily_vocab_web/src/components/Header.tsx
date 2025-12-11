"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="bg-white h-[63px] flex items-center">
            <div className="w-full max-w-[1440px] mx-auto px-[22px] flex items-center justify-between">
                {/* Left section: Logo + Nav */}
                <div className="flex items-center gap-[200px]">
                    <Link
                        href="/"
                        className="text-[24px] leading-[120%] font-semibold text-black hover:text-gray-800"
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        worddee.ai
                    </Link>

                    <nav className="hidden gap-8 md:flex">
                        <Link
                            href="/dashboard"
                            className={`text-[20px] leading-[23px] font-roboto font-light transition-colors ${pathname === '/dashboard' ? 'text-primary font-normal underline decoration-2 underline-offset-4 decoration-primary' : 'text-nav hover:text-primary'
                                }`}
                        >
                            My Progress
                        </Link>
                        <Link
                            href="/word-of-the-day"
                            className={`text-[20px] leading-[23px] font-roboto font-light transition-colors ${pathname === '/word-of-the-day' || pathname === '/' ? 'text-primary font-normal underline decoration-2 underline-offset-4 decoration-primary' : 'text-nav hover:text-primary'
                                }`}
                        >
                            Word of the Day
                        </Link>
                    </nav>
                </div>

                {/* Right: User icon */}
                <div className="flex items-center">
                    <button className="rounded-full bg-transparent p-0 hover:bg-gray-100">
                        {/* User Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-11 w-11 text-nav">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
