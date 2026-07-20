import { ImageResponse } from 'next/og';

export const alt = 'Siddharth G — UI/UX and Graphic Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(238,255,0,0.12) 0%, rgba(0,0,0,0) 60%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: -2,
            color: '#eeff00',
          }}
        >
          Siddharth G
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 44,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          UI UX and Graphic Designer
        </div>
      </div>
    ),
    { ...size }
  );
}
