export async function GET() {
    try {
        const response = await fetch('http://localhost:8000/api/practice-history?limit=50', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Practice history error:', error);
        return Response.json([], { status: 200 });
    }
}
