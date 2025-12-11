"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/word-of-the-day');
    }, [router]);

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <p className="text-primary text-lg font-roboto">Redirecting...</p>
        </div>
    );
}
