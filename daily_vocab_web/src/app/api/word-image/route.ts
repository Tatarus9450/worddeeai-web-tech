import { NextResponse } from 'next/server';

const PEXELS_API_KEY = 'xwGoxlLq86EKoAyWe7JW2QHQAm7A3sJjYqTaWWwXvqIscbpyc0alcMbl';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'vocabulary';

    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY,
                },
                next: { revalidate: 3600 } // Cache for 1 hour
            }
        );

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            const photo = data.photos[0];
            return NextResponse.json({
                url: photo.src.medium, // 350x350 approx
                alt: photo.alt || query,
                photographer: photo.photographer,
                photographer_url: photo.photographer_url,
            });
        }

        // Fallback: search for 'vocabulary' if no results found
        const fallbackResponse = await fetch(
            `https://api.pexels.com/v1/search?query=vocabulary&per_page=1&orientation=square`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY,
                },
            }
        );
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.photos && fallbackData.photos.length > 0) {
            const photo = fallbackData.photos[0];
            return NextResponse.json({
                url: photo.src.medium,
                alt: photo.alt || 'Vocabulary',
                photographer: photo.photographer,
                photographer_url: photo.photographer_url,
            });
        }

        return NextResponse.json({ url: '', alt: '', photographer: '', photographer_url: '' });

    } catch (error) {
        console.error('Pexels API error:', error);
        return NextResponse.json({ url: '', alt: '', photographer: '', photographer_url: '' });
    }
}
