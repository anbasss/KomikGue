import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return new Response('Missing URL parameter', { status: 400 });
        }

        // Tambahkan logging untuk debug
        console.log('Attempting to fetch image from:', imageUrl);

        const response = await fetch(imageUrl, {
            headers: {
                'Accept': 'image/*, */*',
                'Referer': 'https://kiryuu.id/',
                'Origin': 'https://kiryuu.id',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            },
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            console.error('Image fetch failed:', response.status, response.statusText);
            throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        const buffer = await response.arrayBuffer();

        // Tambahkan logging untuk debug
        console.log('Image fetch successful:', {
            contentType,
            contentLength,
            bufferSize: buffer.byteLength
        });

        return new Response(buffer, {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'Content-Length': contentLength,
                'Cache-Control': 'public, max-age=31536000',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new Response(
            JSON.stringify({ error: error.message }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}
