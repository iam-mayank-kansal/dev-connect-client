import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Reconstruct the path
    const path = pathSegments.join('/');
    const url = `${BACKEND_URL}/${path}`;

    // Get request body if present
    let body = undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch {
        // No body
      }
    }

    // Forward headers (excluding host)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Skip host and connection headers
      if (
        !['host', 'connection', 'content-length'].includes(key.toLowerCase())
      ) {
        headers.set(key, value);
      }
    });

    // Get cookies from request and forward them
    const cookies = request.cookies.getAll();
    if (cookies.length > 0) {
      const cookieHeader = cookies
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');
      headers.set('Cookie', cookieHeader);
    }

    // Make the proxied request
    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    // Get response body
    const responseBody = await response.text();

    // Create response with same status
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward response headers
    response.headers.forEach((value, key) => {
      // Handle Set-Cookie specially
      if (key.toLowerCase() === 'set-cookie') {
        nextResponse.headers.set('Set-Cookie', value);
      } else if (
        !['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())
      ) {
        nextResponse.headers.set(key, value);
      }
    });

    // Ensure Content-Type is set for JSON responses
    if (!nextResponse.headers.has('content-type')) {
      nextResponse.headers.set('content-type', 'application/json');
    }

    return nextResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}
