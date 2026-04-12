import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const UPSTREAM = (process.env.API_UPSTREAM ?? process.env.NEXT_PUBLIC_API_URL ?? 'https://viah.aidaki.ai').replace(
  /\/+$/,
  ''
);

/** Do not forward hop-by-hop / connection headers to the upstream API. */
const DROP_REQUEST_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-connection',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

/**
 * Response headers that must not be copied blindly when piping the body.
 * Node's fetch decompresses gzip/br bodies but may still expose Content-Encoding /
 * Content-Length from upstream — forwarding those makes the browser try to decode again
 * → net::ERR_CONTENT_DECODING_FAILED on public catalog routes (GET /levels/public, etc.).
 */
const DROP_RESPONSE_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-connection',
  'transfer-encoding',
  'upgrade',
  'content-encoding',
  'content-length',
]);

function upstreamUrl(pathSegments: string[], search: string): string {
  const tail = pathSegments.length ? pathSegments.join('/') : '';
  return `${UPSTREAM}/api/v1/${tail}${search}`;
}

async function proxy(req: NextRequest, pathSegments: string[]): Promise<Response> {
  const url = upstreamUrl(pathSegments, req.nextUrl.search);
  const outHeaders = new Headers();

  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (DROP_REQUEST_HEADERS.has(lower)) return;
    outHeaders.set(key, value);
  });

  /** Ensure Cookie is sent (HttpOnly cookies are only visible here, not in JS). */
  const cookie = req.headers.get('cookie');
  if (cookie) {
    outHeaders.set('Cookie', cookie);
  }

  const method = req.method.toUpperCase();
  const hasBody = !['GET', 'HEAD'].includes(method);

  const upstream = await fetch(url, {
    method,
    headers: outHeaders,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: 'manual',
    cache: 'no-store',
  });

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });

  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (DROP_RESPONSE_HEADERS.has(lower)) return;
    if (lower === 'set-cookie') {
      res.headers.append('set-cookie', value);
    } else {
      res.headers.set(key, value);
    }
  });

  return res;
}

type RouteCtx = { params: { path: string[] } };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
