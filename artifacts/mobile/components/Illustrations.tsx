import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface BlobProps {
  color: string;
  size?: number;
  style?: any;
}

export function Blob1({ color, size = 100, style }: BlobProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" style={style}>
      <Path
        fill={color}
        d="M48.8,-63.3C60.5,-52.1,65.3,-33.4,69.5,-15.5C73.7,2.4,77.3,19.5,70.1,32.7C62.8,45.8,44.7,55.1,26.9,62.8C9.1,70.5,-8.5,76.6,-26.4,73.8C-44.2,71,-62.4,59.2,-71.4,43.2C-80.4,27.3,-80.1,7.2,-73.4,-10.1C-66.6,-27.4,-53.4,-41.9,-39,-52.6C-24.6,-63.2,-8.9,-70.1,5.6,-76.8C20.1,-83.4,40.1,-89.9,48.8,-63.3Z"
        transform="translate(100 100)"
      />
    </Svg>
  );
}

export function Blob2({ color, size = 100, style }: BlobProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" style={style}>
      <Path
        fill={color}
        d="M37.3,-46.8C52.4,-36.8,71.5,-28.9,79.5,-14.2C87.5,0.4,84.4,21.8,73.1,38C61.8,54.1,42.3,64.8,22.8,70.2C3.3,75.6,-16.2,75.6,-32.7,68.7C-49.2,61.8,-62.7,48,-70.7,31.4C-78.6,14.8,-81.1,-4.6,-73.7,-20.1C-66.3,-35.6,-49,-47.2,-33.1,-56.6C-17.1,-66,-0.5,-73.2,12.7,-69.3C26,-65.4,45,-60.3,37.3,-46.8Z"
        transform="translate(100 100)"
      />
    </Svg>
  );
}

export function Squiggle({ color, size = 50, style }: BlobProps) {
  return (
    <Svg width={size} height={size / 2} viewBox="0 0 100 50" style={style}>
      <Path
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        d="M10,25 Q20,5 30,25 T50,25 Q60,5 70,25 T90,25"
      />
    </Svg>
  );
}

export function Sparkle({ color, size = 40, style }: BlobProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Path
        fill={color}
        d="M50,0 C50,27.6 72.4,50 100,50 C72.4,50 50,72.4 50,100 C50,72.4 27.6,50 0,50 C27.6,50 50,27.6 50,0 Z"
      />
    </Svg>
  );
}

export function StickerAsterisk({ color, size = 50, style }: BlobProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <G transform="translate(50 50)">
        <Rect x="-8" y="-40" width="16" height="80" rx="8" fill={color} />
        <Rect x="-8" y="-40" width="16" height="80" rx="8" fill={color} transform="rotate(60)" />
        <Rect x="-8" y="-40" width="16" height="80" rx="8" fill={color} transform="rotate(120)" />
      </G>
    </Svg>
  );
}

/**
 * CadenceLogo — the official Cadence brand mark ("Sticker Asterisk").
 * Multicolor by default; pass `mono` for a single-color version
 * (e.g. white on dark surfaces, navy for subdued contexts).
 */
export function CadenceLogo({ size = 48, mono, style }: { size?: number; mono?: string; style?: any }) {
  const C = { yellow: '#F4C744', blue: '#3D52B4', pink: '#E56D93', navy: '#1E2438' };
  return (
    <Svg width={size} height={size * (155.7 / 144.6)} viewBox="0 0 144.6 155.7" style={style}>
      <Path fill={mono ?? C.yellow} d="m94.2 31c0.2-9.2-4.8-20.8-18.3-22.3-1-0.1-2.1-0.2-3.2-0.2h-1c-12.7 0.4-21.3 8.1-21.3 21.4s4.6 19.1 8.7 25.7l4.9 8.3h16.5l8.5-16.6c2.4-4.6 5.2-11.3 5.2-16.3z" />
      <Path fill={mono ?? C.yellow} d="m136.6 51.1c-0.9-5-4.6-14.2-13.9-17.4-4.7-1.5-10.3-2.1-16.9 0.7-8.3 3.7-14.7 11.4-16.1 13.4l-9.1 15.7 4.6 3.5c3.8-4.3 13.4-13.2 23.1-17.5 5.7-2.6 10.8-3.7 15.4-4 6.4 0.2 8.5 4 12.9 5.4v0.2z" />
      <Path fill={mono ?? C.blue} d="m80.6 63.7 9.3-16.8c2.8-3.9 10.6-12.5 18.6-13.2 3.8-0.8 12.8-3.4 20.5 3.8 0.9 0.9 1.8 1.8 3.3 3.2-7.6-0.8-9.2 3.2-8.7 4.8-4.4 0-17.6 0.8-32.3 14.1l-6.1 7.4h-4.6z" />
      <Path fill={mono ?? C.pink} d="m70.9 8.5c-0.3 1.8 0.5 5.5 4.4 7.7s8.4 3.8 12.4 10.5c2.3 4.6 4.9 5 6.5 3.6 0-11.3-7.3-22.7-22.8-21.8" />
      <Path fill={mono ?? C.pink} d="m136.6 51.1c-0.4-3.3-2.1-7.1-4.2-10.4-7.3-0.8-9.4 2.8-8.9 4.8 5.1 0.5 9 4.2 13.1 5.6z" />
      <Path fill={mono ?? C.blue} d="m64 63.7-9-16c-2.6-4.9-8.7-10.6-14.3-12.7-6.6-2.4-18.7-5.9-28.4 4.9-3.8 5.2-5.7 12.1-3.9 19.4 1.9 6.3 8.4 16.9 26.3 18.9h21.3l8-14.5z" />
      <Path fill={mono ?? C.pink} d="m11.3 42.3c5-6.6 14.1-13.2 26.5-8.7 1 0.4 2 0.8 2.9 1.3v0.4c-1.3 1.5-1.7 1.9-5.1 2.2-3.8 0.1-6.6 0.5-13.5 4.2-3.5 1.9-8 3.3-10.8 0.6" />
      <Path fill={mono ?? C.yellow} d="m36.5 78.2c-16.6 0.5-25.9 8.1-28.3 17.3-2.2 9.4 3.8 27.8 20.4 28.5 13.6 0.4 22-8.9 26.4-14.9l8.8-16.1-8.1-14.8h-19.2z" />
      <Path fill={mono ?? C.blue} d="m80.8 92.2 9.8 17.1c1.7 4.2 3.6 8.5 3.6 16.7-0.9 8.6-4.8 20.6-21.7 21-18.7 0-22.8-14.2-22.1-23.9 0.4-5.4 2.9-12.1 4.6-15.2l9.2-15.7h16.6z" />
      <Path fill={mono ?? C.yellow} d="m84.8 67c2.8 2.9 4.6 6.6 4.7 11.2h18.4c14.7 0 27.9-7 28.9-21.2 0.4-5.3-1.1-7.2-1.1-7.5-1.6 0.5-4.7-3.6-12.2-4-6.9 0.1-16.6 2.3-27.9 10.7-4.6 3.8-7.9 7.2-10.5 9.8l-0.3 1z" />
      <Path fill={mono ?? C.blue} d="m84.8 89.5c2.9 4.9 12.7 24.4 30.1 26.6 2.1 0.3 5.2 0.3 5.5 0.3 1.3-1.5 6.8-9.8 15.7-10.3 2.8-11.5-3.6-18.7-9.6-22.4-4.8-3-10.4-4.8-18.3-5.5h-18.7c0 4.5-1.6 8.1-4.7 11.3z" />
      <Path fill={mono ?? C.yellow} d="m84.8 89.7c5.2 8.7 16.4 26.7 34.6 26.8 0.9 0 3.2-0.6 5 0.6 1.2 0.8 2 2.3 1.5 4.2-4 2.5-8.9 3.1-13.2 2.5-8.7-1-16.2-6.6-21.6-13.3l-10.5-17.9 4.2-2.9z" />
      <Path fill={mono ?? C.pink} d="m70.8 147c-0.8-3.4 2.3-6.3 5.7-7.7 7.1-3.1 8.9-4.8 12.1-10.8 1.9-2.9 4-3.7 5.6-2.5-0.4 15.6-11.4 21.2-23.4 21z" />
      <Path fill={mono ?? C.pink} d="m125.9 121.4c2.8-1.7 8.6-6.5 10.3-15.3-4.2-1.7-11.6 3.1-16 10.4 2.6-0.1 6.2 0.6 5.7 4.9z" />
      <Path fill={mono ?? C.navy} d="m64.1 63.5c2-1.2 4.7-2.2 8.1-2.3 9.2-0.2 17.3 7.2 17.3 16.9 0 8.3-6 16.8-17 16.8-10.1 0-17.1-7.3-17.3-16.2-0.1-6 3.9-12.8 8.9-15.2z" />
    </Svg>
  );
}
