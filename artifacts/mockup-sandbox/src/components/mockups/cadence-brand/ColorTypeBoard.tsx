import React from 'react';

// Exact paths from LogoBoard
const C = {
  canvas: '#FAF7F0',
  navy: '#1E2438',
  ink: '#1B2033',
  blue: '#3D52B4',
  yellow: '#F4C744',
  pink: '#E56D93',
  green: '#57B57F',
  orange: '#EE7B42',
  purple: '#8C67CB',
};

const Asterisk = ({ variant = 'full', fg = C.navy, bg, className }: any) => {
  const isMono = variant === 'monochrome';
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.6 155.7">
      <path fill={isMono ? fg : C.yellow} d="m94.2 31c0.2-9.2-4.8-20.8-18.3-22.3-1-0.1-2.1-0.2-3.2-0.2h-1c-12.7 0.4-21.3 8.1-21.3 21.4s4.6 19.1 8.7 25.7l4.9 8.3h16.5l8.5-16.6c2.4-4.6 5.2-11.3 5.2-16.3z"/>
      <path fill={isMono ? fg : C.yellow} d="m136.6 51.1c-0.9-5-4.6-14.2-13.9-17.4-4.7-1.5-10.3-2.1-16.9 0.7-8.3 3.7-14.7 11.4-16.1 13.4l-9.1 15.7 4.6 3.5c3.8-4.3 13.4-13.2 23.1-17.5 5.7-2.6 10.8-3.7 15.4-4 6.4 0.2 8.5 4 12.9 5.4v0.2z"/>
      <path fill={isMono ? fg : C.blue} d="m80.6 63.7 9.3-16.8c2.8-3.9 10.6-12.5 18.6-13.2 3.8-0.8 12.8-3.4 20.5 3.8 0.9 0.9 1.8 1.8 3.3 3.2-7.6-0.8-9.2 3.2-8.7 4.8-4.4 0-17.6 0.8-32.3 14.1l-6.1 7.4h-4.6z"/>
      <path fill={isMono ? fg : C.pink} d="m70.9 8.5c-0.3 1.8 0.5 5.5 4.4 7.7s8.4 3.8 12.4 10.5c2.3 4.6 4.9 5 6.5 3.6 0-11.3-7.3-22.7-22.8-21.8"/>
      <path fill={isMono ? fg : C.pink} d="m136.6 51.1c-0.4-3.3-2.1-7.1-4.2-10.4-7.3-0.8-9.4 2.8-8.9 4.8 5.1 0.5 9 4.2 13.1 5.6z"/>
      <path fill={isMono ? fg : C.blue} d="m64 63.7-9-16c-2.6-4.9-8.7-10.6-14.3-12.7-6.6-2.4-18.7-5.9-28.4 4.9-3.8 5.2-5.7 12.1-3.9 19.4 1.9 6.3 8.4 16.9 26.3 18.9h21.3l8-14.5z"/>
      <path fill={isMono ? fg : C.pink} d="m11.3 42.3c5-6.6 14.1-13.2 26.5-8.7 1 0.4 2 0.8 2.9 1.3v0.4c-1.3 1.5-1.7 1.9-5.1 2.2-3.8 0.1-6.6 0.5-13.5 4.2-3.5 1.9-8 3.3-10.8 0.6"/>
      <path fill={isMono ? fg : C.yellow} d="m36.5 78.2c-16.6 0.5-25.9 8.1-28.3 17.3-2.2 9.4 3.8 27.8 20.4 28.5 13.6 0.4 22-8.9 26.4-14.9l8.8-16.1-8.1-14.8h-19.2z"/>
      <path fill={isMono ? fg : C.blue} d="m80.8 92.2 9.8 17.1c1.7 4.2 3.6 8.5 3.6 16.7-0.9 8.6-4.8 20.6-21.7 21-18.7 0-22.8-14.2-22.1-23.9 0.4-5.4 2.9-12.1 4.6-15.2l9.2-15.7h16.6z"/>
      <path fill={isMono ? fg : C.yellow} d="m84.8 67c2.8 2.9 4.6 6.6 4.7 11.2h18.4c14.7 0 27.9-7 28.9-21.2 0.4-5.3-1.1-7.2-1.1-7.5-1.6 0.5-4.7-3.6-12.2-4-6.9 0.1-16.6 2.3-27.9 10.7-4.6 3.8-7.9 7.2-10.5 9.8l-0.3 1z"/>
      <path fill={isMono ? fg : C.blue} d="m84.8 89.5c2.9 4.9 12.7 24.4 30.1 26.6 2.1 0.3 5.2 0.3 5.5 0.3 1.3-1.5 6.8-9.8 15.7-10.3 2.8-11.5-3.6-18.7-9.6-22.4-4.8-3-10.4-4.8-18.3-5.5h-18.7c0 4.5-1.6 8.1-4.7 11.3z"/>
      <path fill={isMono ? fg : C.yellow} d="m84.8 89.7c5.2 8.7 16.4 26.7 34.6 26.8 0.9 0 3.2-0.6 5 0.6 1.2 0.8 2 2.3 1.5 4.2-4 2.5-8.9 3.1-13.2 2.5-8.7-1-16.2-6.6-21.6-13.3l-10.5-17.9 4.2-2.9z"/>
      <path fill={isMono ? fg : C.pink} d="m70.8 147c-0.8-3.4 2.3-6.3 5.7-7.7 7.1-3.1 8.9-4.8 12.1-10.8 1.9-2.9 4-3.7 5.6-2.5-0.4 15.6-11.4 21.2-23.4 21z"/>
      <path fill={isMono ? fg : C.pink} d="m125.9 121.4c2.8-1.7 8.6-6.5 10.3-15.3-4.2-1.7-11.6 3.1-16 10.4 2.6-0.1 6.2 0.6 5.7 4.9z"/>
      <path fill={isMono ? fg : C.navy} d="m64.1 63.5c2-1.2 4.7-2.2 8.1-2.3 9.2-0.2 17.3 7.2 17.3 16.9 0 8.3-6 16.8-17 16.8-10.1 0-17.1-7.3-17.3-16.2-0.1-6 3.9-12.8 8.9-15.2z"/>
    </svg>
  );
};

const NoiseOverlay = () => (
  <div className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.04]" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }} />
);

// WCAG Contrast Utilities
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const ContrastBadge = ({ ratio }: { ratio: number }) => {
  if (ratio >= 7) return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold whitespace-nowrap">AAA (Pass)</span>;
  if (ratio >= 4.5) return <span className="px-2 py-1 bg-[#F4C744]/20 text-[#6B5518] rounded-full text-xs font-semibold whitespace-nowrap">AA (Pass)</span>;
  if (ratio >= 3) return <span className="px-2 py-1 bg-[#EE7B42]/20 text-[#B85425] rounded-full text-xs font-semibold whitespace-nowrap">AA Large/UI</span>;
  return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold whitespace-nowrap">Fail</span>;
};

// Data
const colors = {
  light: {
    background: '#FAF7F0',
    card: '#FFFFFF',
    text: '#1B2033',
    primary: '#1E2438',
    secondary: '#F1EEE6',
    border: '#EAE5DA',
    mutedForeground: '#6B7186',
    
    accentSoft: '#E8ECF9',
    accentMid: '#8FA0DE',
    accent: '#3D52B4',
    gradientStart: '#4A61C4',
    gradientEnd: '#33459C',

    yellow: '#F4C744',
    orange: '#EE7B42',
    green: '#57B57F',
    purple: '#8C67CB',
    pink: '#E56D93',
    softBlue: '#8CB8F3',

    pinkText: '#C2456B',
    orangeText: '#B85425',
    greenText: '#2E7D54',
  },
  dark: {
    background: '#0D101A',
    card: '#171B28',
    text: '#F1F2F8',
    primary: '#F1F2F8',
    secondary: '#232939',
    border: '#262C3E',
    mutedForeground: '#A8AEC4',
    
    accentSoft: '#C9D2F8',
    accentMid: '#6C80D8',
    accent: '#A5B4F4',
    gradientStart: '#3A4EB5',
    gradientEnd: '#232F73',

    yellow: '#7D6118',
    orange: '#AC4E24',
    green: '#3D9269',
    purple: '#6E51A6',
    pink: '#B24A6E',
    softBlue: '#3A5E96',

    pinkText: '#E87DA2',
    orangeText: '#EE9059',
    greenText: '#7BD3A4',
  }
};

const Swatch = ({ name, hex, role, darkText = false }: { name: string, hex: string, role: string, darkText?: boolean }) => (
  <div 
    className={`rounded-[32px] p-6 border flex flex-col justify-between h-48 transition-transform hover:-translate-y-1 duration-300 shadow-sm hover:shadow-md`}
    style={{ 
      backgroundColor: hex, 
      borderColor: darkText ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
      color: darkText ? '#1B2033' : '#FFFFFF',
    }}
  >
    <div className="flex justify-between items-start mb-4 gap-2">
      <div className="text-sm font-semibold tracking-wide uppercase leading-tight font-inter">{name}</div>
      <div className="text-sm font-mono opacity-80 shrink-0">{hex}</div>
    </div>
    <div className="text-sm opacity-80 mt-auto font-inter leading-snug">{role}</div>
  </div>
);

const SwatchDark = ({ name, hex, role, lightText = false }: { name: string, hex: string, role: string, lightText?: boolean }) => (
  <div 
    className={`rounded-[32px] p-6 border flex flex-col justify-between h-48 transition-transform hover:-translate-y-1 duration-300 shadow-sm hover:shadow-md`}
    style={{ 
      backgroundColor: hex, 
      borderColor: lightText ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      color: lightText ? '#F1F2F8' : '#131625',
    }}
  >
    <div className="flex justify-between items-start mb-4 gap-2">
      <div className="text-sm font-semibold tracking-wide uppercase leading-tight font-inter">{name}</div>
      <div className="text-sm font-mono opacity-80 shrink-0">{hex}</div>
    </div>
    <div className="text-sm opacity-80 mt-auto font-inter leading-snug">{role}</div>
  </div>
);

export default function ColorTypeBoard() {
  const contrastPairs = [
    { name: 'Body Text on Canvas', bg: colors.light.background, fg: colors.light.text, bgName: 'Canvas', fgName: 'Ink Text' },
    { name: 'Body Text on Card', bg: colors.light.card, fg: colors.light.text, bgName: 'Card', fgName: 'Ink Text' },
    { name: 'Muted Text on Card', bg: colors.light.card, fg: colors.light.mutedForeground, bgName: 'Card', fgName: 'Muted Text' },
    { name: 'Primary Button', bg: colors.light.primary, fg: colors.light.background, bgName: 'Primary (Navy)', fgName: 'Cream' },
    { name: 'Anchor CTA', bg: colors.light.accent, fg: '#FFFFFF', bgName: 'Anchor Blue', fgName: 'White' },
    { name: 'Green Text (Badge)', bg: colors.light.card, fg: colors.light.greenText, bgName: 'Card', fgName: 'Green Text' },
    { name: 'Pink Text (Badge)', bg: colors.light.card, fg: colors.light.pinkText, bgName: 'Card', fgName: 'Pink Text' },
    { name: 'Orange Text (Badge)', bg: colors.light.card, fg: colors.light.orangeText, bgName: 'Card', fgName: 'Orange Text' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#FAF7F0] text-[#1E2438] relative pb-32">
      <NoiseOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600;700&display=swap');
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <div className="px-8 md:px-16 pt-24 pb-32 max-w-[1400px] mx-auto relative z-10">
        
        {/* Header */}
        <header className="max-w-6xl mx-auto mb-32">
          <div className="inline-flex items-center gap-3 mb-8 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-[#EAE5DA]">
            <Asterisk className="w-3.5 h-3.5" variant="full" />
            <span className="font-inter text-xs font-bold text-[#1E2438] uppercase tracking-[0.15em]">Brand Book // Vol. 2</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-fraunces tracking-tight mb-8">
            Cadence <br/> <span className="text-[#3D52B4] italic font-light">Color & Type</span>
          </h1>
          <p className="text-xl md:text-2xl font-inter text-[#6B7186] max-w-3xl leading-relaxed">
            The foundation of "Ink & Paper". A warm editorial aesthetic balanced with structural clarity and joyful moments of color.
          </p>
        </header>

        {/* Core Palette */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-8">Core Foundation</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Swatch name="Warm Canvas" hex={colors.light.background} role="App Background" darkText />
            <Swatch name="White Card" hex={colors.light.card} role="Floating Surfaces" darkText />
            <Swatch name="Ink Navy" hex={colors.light.primary} role="Primary CTAs & Prominent text" />
            <Swatch name="Text Ink" hex={colors.light.text} role="Body Text" />
          </div>
        </section>

        {/* Anchor Blue Ramp */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-8">The Anchor Blue</div>
          <div className="flex flex-col md:flex-row rounded-[32px] overflow-hidden border border-[#EAE5DA] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1 p-8 h-48 flex flex-col justify-between" style={{ backgroundColor: colors.light.accentSoft, color: '#1B2033' }}>
              <div className="font-mono text-xs opacity-60">{colors.light.accentSoft}</div>
              <div>
                <div className="font-inter text-sm font-bold uppercase tracking-wide">Soft Tint</div>
                <div className="font-inter text-sm opacity-80 mt-1">Backgrounds for primary states</div>
              </div>
            </div>
            <div className="flex-1 p-8 h-48 flex flex-col justify-between" style={{ backgroundColor: colors.light.accentMid, color: '#FFFFFF' }}>
              <div className="font-mono text-xs opacity-80">{colors.light.accentMid}</div>
              <div>
                <div className="font-inter text-sm font-bold uppercase tracking-wide">Mid Blue</div>
                <div className="font-inter text-sm opacity-90 mt-1">Borders and secondary marks</div>
              </div>
            </div>
            <div className="flex-1 p-8 h-48 flex flex-col justify-between" style={{ backgroundColor: colors.light.accent, color: '#FFFFFF' }}>
              <div className="font-mono text-xs opacity-80">{colors.light.accent}</div>
              <div>
                <div className="font-inter text-sm font-bold uppercase tracking-wide">Anchor Blue</div>
                <div className="font-inter text-sm opacity-90 mt-1">Brand accent & active states</div>
              </div>
            </div>
            <div className="flex-[2] p-8 h-48 flex flex-col justify-between relative overflow-hidden text-white">
              <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(135deg, ${colors.light.gradientStart} 0%, ${colors.light.gradientEnd} 100%)` }} />
              <div className="relative z-10 font-mono text-xs opacity-80">{colors.light.gradientStart} → {colors.light.gradientEnd}</div>
              <div className="relative z-10">
                <div className="font-inter text-sm font-bold uppercase tracking-wide">Hero Gradient</div>
                <div className="font-inter text-sm opacity-90 mt-1">Deep blue family for high-impact surfaces</div>
              </div>
            </div>
          </div>
        </section>

        {/* Playful Accents */}
        <section className="max-w-6xl mx-auto mb-40">
          <div className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-8">Playful Accents</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Swatch name="Yellow" hex={colors.light.yellow} role="Streaks & Stars" darkText />
            <Swatch name="Orange" hex={colors.light.orange} role="Warnings & Warmth" darkText />
            <Swatch name="Green" hex={colors.light.green} role="Success & Growth" />
            <Swatch name="Soft Blue" hex={colors.light.softBlue} role="Secondary hints" darkText />
            <Swatch name="Purple" hex={colors.light.purple} role="Insights & AI" />
            <Swatch name="Pink" hex={colors.light.pink} role="Feedback marks" />
          </div>
        </section>

        {/* Typography */}
        <section className="max-w-6xl mx-auto mb-40">
          <div className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-12">Typography System</div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Fraunces */}
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE5DA]">
                <div className="font-fraunces text-3xl">Fraunces</div>
                <div className="font-mono text-xs text-[#6B7186]">Display / Headings</div>
              </div>
              <div className="flex flex-col gap-10">
                <div>
                  <div className="font-mono text-[10px] text-[#6B7186] uppercase tracking-widest mb-2">Display 6XL</div>
                  <div className="font-fraunces text-6xl md:text-7xl leading-[1.1] tracking-tight">Express<br/>Yourself.</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#6B7186] uppercase tracking-widest mb-2">Heading 4XL</div>
                  <div className="font-fraunces text-4xl leading-tight">Daily Speaking Practice</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#6B7186] uppercase tracking-widest mb-2">Heading 2XL</div>
                  <div className="font-fraunces text-2xl leading-snug">The right word at the right time.</div>
                </div>
              </div>
            </div>

            {/* Inter */}
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE5DA]">
                <div className="font-inter text-3xl font-medium tracking-tight">Inter</div>
                <div className="font-mono text-xs text-[#6B7186]">Body / UI</div>
              </div>
              <div className="flex flex-col gap-10">
                <div>
                  <div className="font-mono text-[10px] text-[#6B7186] uppercase tracking-widest mb-2">Body Large</div>
                  <div className="font-inter text-lg leading-relaxed text-[#1B2033]">
                    The way you speak matters. Cadence helps you practice articulating your thoughts with clarity and confidence, just one minute a day.
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#6B7186] uppercase tracking-widest mb-2">Body Base</div>
                  <div className="font-inter text-base leading-relaxed text-[#1B2033]">
                    We noticed you used "like" four times in your last recording. Try replacing it with a brief pause to gather your thoughts. Silence is a powerful tool.
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#6B7186] uppercase tracking-widest mb-2">UI Controls</div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="font-inter text-sm font-semibold px-5 py-2.5 bg-[#1E2438] text-white rounded-full shadow-sm">
                      Start Recording
                    </div>
                    <div className="font-inter text-sm font-medium px-5 py-2.5 bg-white border border-[#EAE5DA] text-[#1B2033] rounded-full shadow-sm">
                      View History
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contrast Audit */}
        <section className="max-w-6xl mx-auto mb-40">
          <div className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-8">Contrast Audit (Light Mode)</div>
          <div className="bg-white rounded-[32px] border border-[#EAE5DA] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE5DA] bg-[#FAF7F0]/50">
                    <th className="py-4 px-6 font-inter text-xs font-semibold text-[#6B7186] uppercase tracking-wider">Pairing</th>
                    <th className="py-4 px-6 font-inter text-xs font-semibold text-[#6B7186] uppercase tracking-wider">Background</th>
                    <th className="py-4 px-6 font-inter text-xs font-semibold text-[#6B7186] uppercase tracking-wider">Foreground</th>
                    <th className="py-4 px-6 font-inter text-xs font-semibold text-[#6B7186] uppercase tracking-wider">Ratio</th>
                    <th className="py-4 px-6 font-inter text-xs font-semibold text-[#6B7186] uppercase tracking-wider">WCAG Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DA]">
                  {contrastPairs.map((pair, idx) => {
                    const ratio = contrastRatio(pair.bg, pair.fg);
                    return (
                      <tr key={idx} className="hover:bg-[#FAF7F0]/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: pair.bg, color: pair.fg }}>Aa</div>
                            <span className="font-inter text-sm font-medium">{pair.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: pair.bg }} />
                            <span className="font-mono text-xs">{pair.bgName} ({pair.bg})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: pair.fg }} />
                            <span className="font-mono text-xs">{pair.fgName} ({pair.fg})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-sm">
                          {ratio.toFixed(2)}:1
                        </td>
                        <td className="py-4 px-6">
                          <ContrastBadge ratio={ratio} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Dark Mode */}
        <section className="max-w-6xl mx-auto">
          <div className="bg-[#0D101A] rounded-[40px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Subtle glow behind dark mode content */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#3A4EB5] rounded-full blur-[120px] opacity-20 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6E51A6] rounded-full blur-[120px] opacity-20 pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10">
              <div className="text-[#A5B4F4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-4">Dark Mode</div>
              <h2 className="text-4xl md:text-5xl font-fraunces text-[#F1F2F8] mb-16">Ink & Paper, <i className="font-light">after dark</i>.</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <SwatchDark name="Blue-Black Canvas" hex={colors.dark.background} role="Deep background" lightText />
                <SwatchDark name="Slate-Navy Card" hex={colors.dark.card} role="Elevated surfaces" lightText />
                <SwatchDark name="Light Pill CTA" hex={colors.dark.primary} role="Primary actions" />
                <SwatchDark name="Text Anchor" hex={colors.dark.text} role="Primary readability" lightText />
              </div>

              <div className="text-[#A5B4F4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-6">Jewel-toned Accents</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <SwatchDark name="Deep Amber" hex={colors.dark.yellow} role="Streaks & stars" lightText />
                <SwatchDark name="Burnt Orange" hex={colors.dark.orange} role="Warnings" lightText />
                <SwatchDark name="Forest Green" hex={colors.dark.green} role="Success" lightText />
                <SwatchDark name="Muted Blue" hex={colors.dark.softBlue} role="Secondary hints" lightText />
                <SwatchDark name="Deep Purple" hex={colors.dark.purple} role="Insights & AI" lightText />
                <SwatchDark name="Berry Pink" hex={colors.dark.pink} role="Feedback marks" lightText />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
