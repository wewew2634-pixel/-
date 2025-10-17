import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic OG Image Generator using Next.js ImageResponse
 * 
 * Usage: /api/og?title=JJIKMEOK&subtitle=Create%20Earn%20Explore
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'JJIKMEOK';
    const subtitle = searchParams.get('subtitle') || 'Create • Earn • Explore';
    const tagline = searchParams.get('tagline') || '로컬 미션 • 즉시 정산 • 나노 크리에이터';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0A0E1A 0%, #1E293B 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: 'white',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: '#94A3B8',
              marginBottom: 60,
              letterSpacing: '0.05em',
            }}
          >
            {subtitle}
          </div>
          
          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: '#60A5FA',
              letterSpacing: '0.1em',
            }}
          >
            {tagline}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e?.message);
    return new Response(`Failed to generate image: ${e?.message}`, {
      status: 500,
    });
  }
}
