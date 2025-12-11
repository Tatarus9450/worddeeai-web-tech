export async function GET() {
    try {
        const response = await fetch('http://localhost:8000/api/dashboard-stats', {
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
        console.error('Dashboard stats error:', error);
        return Response.json({
            day_streak: 0,
            total_minutes: 0,
            hours: 0,
            minutes: 0,
            time_display: "0m"
        }, { status: 200 });
    }
}
