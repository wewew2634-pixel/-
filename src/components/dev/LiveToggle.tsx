/**
 * LiveToggle Component
 * 
 * Fixed bottom-right toggle for real-time design review
 * 
 * Features:
 * - ON/OFF toggle with visual feedback
 * - Manual reload button
 * - Expandable info panel
 * - Last check timestamp
 * - URL tip (?live=1)
 * - Preserves URL during refreshes
 * 
 * Usage:
 * <LiveToggle />
 * 
 * Add to layout.tsx or any page that needs live preview
 */

'use client';

import { useLivePreview } from '@/hooks/useLivePreview';
import { useState } from 'react';

export function LiveToggle() {
  const { active, enable, disable, lastChecked } = useLivePreview({ 
    enabled: false, 
    intervalMs: 5000, 
    mode: 'refresh' 
  });
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="fixed right-3 bottom-3 z-[9999] select-none"
      style={{ isolation: 'isolate' }}
    >
      <div className="rounded-2xl bg-black/60 text-white/90 backdrop-blur-md px-3 py-2 shadow-2xl border border-white/10">
        {/* Main Controls */}
        <div className="flex items-center gap-2">
          {/* Label */}
          <span className="text-xs font-medium opacity-80">
            Live 5s
          </span>

          {/* ON/OFF Toggle */}
          <button
            type="button"
            className={`
              h-6 px-3 rounded-xl text-xs font-semibold
              transition-all duration-200 ease-out
              ${active 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' 
                : 'bg-neutral-700 text-white hover:bg-neutral-600'
              }
            `}
            onClick={active ? disable : enable}
            aria-pressed={active}
            aria-label={active ? 'Disable live preview' : 'Enable live preview'}
          >
            {active ? 'ON' : 'OFF'}
          </button>

          {/* Manual Reload Button */}
          <button
            type="button"
            className="
              h-6 px-3 rounded-xl text-xs font-semibold
              bg-orange-500 text-black
              hover:bg-orange-400
              transition-colors duration-200
              shadow-lg shadow-orange-500/30
            "
            onClick={() => window.location.reload()}
            title="강제 새로고침 (Hard Reload)"
            aria-label="Force reload page"
          >
            Reload
          </button>

          {/* Expand/Collapse Button */}
          <button
            type="button"
            className="
              h-6 w-6 rounded-xl text-xs font-semibold
              bg-neutral-700 text-white
              hover:bg-neutral-600
              transition-colors duration-200
              flex items-center justify-center
            "
            onClick={() => setExpanded(prev => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide info' : 'Show info'}
          >
            {expanded ? '−' : '⋯'}
          </button>
        </div>

        {/* Expanded Info Panel */}
        {expanded && (
          <div 
            className="mt-2 pt-2 border-t border-white/10 animate-fade-in"
            role="region"
            aria-label="Live preview info"
          >
            <div className="space-y-1 text-[10px] opacity-70">
              {/* Last Check Timestamp */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-white/60">Last check:</span>
                <span className="font-mono text-white/90">
                  {lastChecked > 0 
                    ? new Date(lastChecked).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                    : '—'
                  }
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-white/60">Status:</span>
                <span className={`font-semibold ${active ? 'text-emerald-400' : 'text-neutral-400'}`}>
                  {active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Tip */}
              <div className="mt-2 pt-2 border-t border-white/5">
                <p className="text-white/50 leading-relaxed">
                  💡 <strong className="text-white/70">Tip:</strong> URL 뒤에{' '}
                  <code className="px-1 py-0.5 bg-white/10 rounded text-emerald-400">
                    ?live=1
                  </code>
                  {' '}을 붙이면 자동 활성화됩니다
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
