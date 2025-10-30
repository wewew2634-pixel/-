// Live Hash API - Design Review System
// Watches for file changes in design-critical directories
import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const dynamic = 'force-dynamic'; // Disable caching for dev/preview
export const runtime = 'nodejs'; // Required for fs access

const ROOT = process.cwd();
const WATCH = [
  'src/styles',              // Design tokens & global styles
  'src/components',          // UI components
  'src/app',                 // Pages & layouts
  'public/og',               // OG images
  'public/logos',            // Logo assets
  'public/icons',            // Icon assets
  'public/manifest.json',    // PWA manifest
];

/**
 * Recursively get the latest modification time (mtime) from a directory or file
 */
function latestMtimeMillis(dirOrFile: string): number {
  const fullPath = path.join(ROOT, dirOrFile);
  
  // Return 0 if path doesn't exist
  if (!fs.existsSync(fullPath)) {
    return 0;
  }
  
  const stat = fs.statSync(fullPath);
  
  // If it's a file, return its mtime
  if (stat.isFile()) {
    return stat.mtimeMs;
  }
  
  // If it's a directory, recursively check all children
  let maxMtime = stat.mtimeMs;
  
  try {
    const entries = fs.readdirSync(fullPath);
    for (const entry of entries) {
      // Skip node_modules, .next, .git, etc.
      if (entry.startsWith('.') || entry === 'node_modules') {
        continue;
      }
      
      const childPath = path.join(dirOrFile, entry);
      const childMtime = latestMtimeMillis(childPath);
      maxMtime = Math.max(maxMtime, childMtime);
    }
  } catch (error) {
    // If we can't read directory, just return directory's own mtime
    console.error(`Error reading directory ${fullPath}:`, error);
  }
  
  return maxMtime;
}

/**
 * GET /api/live-hash
 * Returns a hash of the latest modification times of watched directories
 * Client polls this endpoint to detect changes
 */
export async function GET() {
  try {
    const mtimes = WATCH.map(watchPath => latestMtimeMillis(watchPath));
    const payload = JSON.stringify({ mtimes, t: Date.now() });
    const hash = crypto.createHash('sha1').update(payload).digest('hex');
    
    const response = NextResponse.json({
      hash,
      updatedAt: Math.max(...mtimes) || Date.now(),
      watched: WATCH,
      timestamp: new Date().toISOString(),
    });
    
    // Strong cache prevention headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('CDN-Cache-Control', 'no-store');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error in live-hash API:', error);
    return NextResponse.json(
      { error: 'Failed to generate hash' },
      { status: 500 }
    );
  }
}
