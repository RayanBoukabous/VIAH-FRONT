'use client';

import { useState, useCallback } from 'react';

export function isLikelyPdfUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (/\.pdf(\?|#|$)/i.test(u)) return true;
  if (/application\/pdf/i.test(u)) return true;
  return false;
}

type Props = {
  url: string;
  title: string;
  locale: string;
};

export function CoursePdfViewer({ url, title, locale }: Props) {
  const [zoom, setZoom] = useState(100);
  const [reloadToken, setReloadToken] = useState(0);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(175, z + 12)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(55, z - 12)), []);
  const resetZoom = useCallback(() => setZoom(100), []);
  const reload = useCallback(() => setReloadToken((k) => k + 1), []);

  const hi = locale === 'hi';

  return (
    <div
      className="relative flex flex-col min-h-[72vh] max-h-[calc(100vh-12rem)] rounded-2xl overflow-hidden
        border border-slate-200/90 dark:border-white/[0.1]
        bg-gradient-to-br from-white via-slate-50/90 to-indigo-50/30
        dark:from-[#0c1222] dark:via-[#0a0f1e] dark:to-[#111827]
        shadow-[0_0_0_1px_rgba(99,102,241,0.06),0_25px_50px_-12px_rgba(15,23,42,0.35)]"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 dark:opacity-25">
        <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/20" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/15" />
      </div>

      <div className="relative z-10 flex flex-col min-h-0 flex-1">
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 dark:border-white/[0.07]
            bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600/80 dark:text-indigo-300/90">
                {hi ? 'पीडीएफ़ रीडर' : 'PDF reader'}
              </p>
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white" title={title}>
                {title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white/90 p-1 dark:border-white/[0.08] dark:bg-black/30">
            <button
              type="button"
              onClick={zoomOut}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.08]"
              aria-label={hi ? 'छोटा करें' : 'Zoom out'}
            >
              −
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="min-w-[3.25rem] rounded-lg px-2 py-1.5 text-center text-xs font-bold tabular-nums text-indigo-600 dark:text-indigo-300"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.08]"
              aria-label={hi ? 'बड़ा करें' : 'Zoom in'}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.1]"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {hi ? 'रीफ़्रेश' : 'Reload'}
          </button>
        </div>

        {/* Viewport */}
        <div className="relative flex-1 min-h-0 overflow-auto bg-slate-100/80 dark:bg-[#05080f]">
          <div
            className="min-h-full w-full p-2 sm:p-4"
            style={{
              zoom: `${zoom}%`,
            }}
          >
            <iframe
              key={`${url}-${reloadToken}`}
              src={url}
              title={title}
              className="block h-[min(85vh,1200px)] w-full rounded-lg border border-slate-200/60 bg-white shadow-inner dark:border-white/[0.08] dark:bg-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
