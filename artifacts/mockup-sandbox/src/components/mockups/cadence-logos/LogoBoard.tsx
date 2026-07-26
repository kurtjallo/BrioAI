import React from 'react';

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

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04]" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }} />
);

const WaveBlob = ({ variant = 'full', fg = C.blue, bg = C.canvas, className }: any) => {
  const isMono = variant === 'monochrome';
  const cMain = isMono ? fg : C.blue;
  const cCutout = isMono ? bg : C.canvas;

  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.4 80">
      <path fill={cMain} d="m8.3 38.1c0.2-12.5 10.6-28.3 24.5-34v-0.1c2.8-1.3 5.9-2.3 9.2-3 2-0.4 4.9-1 8.7-1 4.4 0 8.7 0.9 12.7 2.2 10.4 3.6 22.9 14.3 24.6 32.7v3.1"/>
      <path fill={cMain} d="m8.3 42.3c0.5 14.3 10.2 26.4 21.3 32.2 5.2 2.8 10 4.4 16.4 5.2 3.3 0.3 7.7 0.2 10.2-0.2 15.5-2.6 30.4-13.2 31.8-37.2h-7.7c-1.5 0-2.3 0.5-3.6 0.7s-1.9-0.4-2.9-0.9-2.2-0.4-2.8 0.4c-1.7 2.2-2.4 5.7-5.1 5.8s-3.6-3.3-5.2-6.6c-0.8-1.6-1.1-1.8-2.1-1.6-2.5 0.5-3.1 13.9-7.1 17.9-1.8 1.4-3.3 0.9-4.1 0-3.4-3.3-4.3-16-5.2-19.7s-2.6-3.3-3.6-0.2c-1.3 4.3-2.7 13.3-6.6 13.6-4.3 0.4-5.4-9.7-7.7-11.1-2.1-1-2.7 2.9-5.8 2.8-1.7 0-1.8-1.1-4.5-1.1h-5.7z"/>
      <path fill={cCutout} d="m8.3 38.1v4.2h5.7c2.7 0 2.8 1.1 4.5 1.2 3.1 0.1 3.8-3.9 5.8-2.9 2.4 1.3 3.4 11.4 7.3 11.1 3.9-0.1 5.1-7.5 6.6-12.5 1.1-4 3-4.6 4-1.2 1.2 4.3 2.1 16.8 5.3 19.9 0.8 0.8 2.2 1.5 3.8 0.2 3.8-3 4.9-17.6 7.3-18 0.9-0.2 1.4 0.3 2.2 2 1.6 3.5 2.6 6.3 4.9 6.2 3 0.1 3.9-3.9 5.4-5.6 0.6-0.9 1.7-1.1 2.7-0.8 1.4 0.6 2.3 1.5 4.2 0.8 0.7-0.2 1.7-0.4 2.2-0.4h7.8v-4.2h-9.7c-3.3 0-3.7-1.4-5.2-2.4-0.7-0.4-1.6-0.5-2.5-0.1-2.2 1-2.9 4.2-4.7 3.8-2.2-0.4-2.8-8.8-6.3-10.8-0.7-0.4-1.5-0.5-2.2-0.1-3.8 1.8-5.3 12.6-6.5 14.5-1 1.6-2.2 1.3-2.8-0.7-1.3-4.4-2.4-20-6.6-21.3-1.1-0.4-2.2 0.1-2.9 1-3.2 3.5-4.6 15.3-6.1 17.6-0.4 0.5-0.8 0.7-1.6 0.5-1.9-0.8-3.2-8.1-6.3-8.3-3.7-0.4-4.2 5-6.9 6-0.6 0.3-1.4 0.3-2.1 0.3h-7.3z"/>
    </svg>
  );
};

const SpeechDot = ({ variant = 'full', fg = C.navy, bg, className }: any) => {
  const isMono = variant === 'monochrome';
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="5 96.4 100 80">
      <path fill={isMono ? fg : C.blue} d="m23.4 176.4c-0.9 0-1.8-0.5-2.2-1.3-0.5-0.9-0.3-2 0.3-2.7 1.7-2.2 3.3-6.9 3.5-11.4-5.6-6.5-9.6-16-9.6-25v-1.3c0-17.4 13.7-32.5 26.7-36.7 3.8-1.3 7.8-1.9 12.8-1.6 20.5 0 39.7 17.1 40.1 38.1v1.5c0 19.9-15.2 38.4-39.6 38.7-4.8 0-9.4-0.8-15.2-2.8-4.1 2.1-9.7 3.9-16.6 4.5h-0.2z" />
      <path fill={isMono ? fg : C.navy} d="m55 100.4c-19.3 0-35.6 16.2-35.6 34.6v1c0 8.2 3.5 16.7 9.7 24 0 3.2-0.9 8-2.5 11.5 3.8-0.4 9.8-2 13.3-4.1l0.2-0.1 0.4 0.1c4 1.7 8.9 3 14.5 3 20.9 0 35.6-14.9 35.9-34.4v-1c0-17.5-15.5-34.6-35.9-34.6z" />
      <path fill={isMono ? fg : C.yellow} d="m74.4 112.4c-3.3 0-7 2.5-7 6.3s2.7 7.1 6.6 7.1 7.1-2.7 7.1-6.8-3.4-6.6-6.7-6.6z" />
    </svg>
  );
};

const CadenceArc = ({ variant = 'full', fg = C.navy, bg, className }: any) => {
  const isMono = variant === 'monochrome';
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176.9 187">
      <path fill={isMono ? fg : C.blue} d="m149 57c-10.6-15.1-28.4-29.6-55.7-29.6-30.3 0-60.7 21.7-66.2 54.6-2.5 14.7 0.4 32.4 9.9 46.6 10.7 16.7 29.6 30.9 56.3 30.9 20.5 0 41.4-9.1 53.2-25.5l2.5-3.5c3-4.5 3.4-11.3-1.4-15.6-4.8-5-13.2-3.9-17 1.1-7.5 11.4-20.2 20.7-37.3 20.8-24 0.3-39-17.1-42.5-34.4-2.5-11.8-0.4-24.9 9.3-36.4 6.2-7.2 16.1-15 32.4-15.8 14-0.2 25.4 5.3 34.6 16.2l2.5 3.5c2.5 3.8 7 6.1 12 5.4 7.4-1.1 11.8-9.2 7.4-18.3z"/>
      <path fill={isMono ? fg : C.navy} d="m164.9 53.3c-8.8-14.3-28.7-41.4-71.8-41.5-26.5-0.2-53.8 14.3-69 37.7-5.3 8.3-8 15.8-9.7 21.9-1.9 7.6-2.9 14.7-3.5 21.6-0.4 23.4 8.7 44.2 25.4 59.6s34.7 22.6 57 22.6c23.4 0 51.3-9.7 68.9-35.8l2.7-4.8c1.5-3 2.1-8.3-2.3-11.7-2.5-1.9-7.3-2.5-11.1 1.3l-1 1.1c-0.4 3.8-1.9 4.6-4 7.6-9.7 12.7-26.5 26.6-53.2 26.6-18.6 0-33.8-6.6-45.7-17.9-11.1-11.2-21-27.3-21.2-48-0.2-31.2 25-64.6 58.5-65.6 23.4-2.1 43.2 5.1 57.8 20.8l6.5 8 1.5 2.9c1.7 4.2 5.7 5.7 9.4 4.9 4-0.8 6.9-5.8 5.7-10.7z"/>
      <path fill={isMono ? fg : C.pink} d="m150.3 82.2c-6.3 0-11.4 4.7-11.4 11.3 0 5.2 3.8 11.5 11 11.6 7.1 0 12.7-5 12.5-11.8 0-6.3-5.6-11.3-12.1-11.1z"/>
    </svg>
  );
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

const RhythmBars = ({ variant = 'full', fg = C.navy, bg, className }: any) => {
  const isMono = variant === 'monochrome';
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 161">
      <polyline fill="none" stroke={isMono ? fg : C.pink} strokeWidth="5" strokeMiterlimit="10" points="30 92.5 74.9 108.2 120 93"/>
      <path fill={isMono ? fg : C.orange} d="m28 42.9c-8.9 0-17 7.2-17 15.9v2l34 0.2v-2c0-8.9-8.3-16.1-17-16.1z"/>
      <path fill={isMono ? fg : C.orange} d="m122 42.9c-8.9 0-16.7 7.2-16.7 16.1h34.3v-1.1c0.1-7.8-7.7-15-17.6-15z"/>
      <path fill={isMono ? fg : C.yellow} d="m75 11.8c-8.7 0-16.6 7.2-16.6 15.7v3.5h33.6v-4.1c-0.7-7.9-8.6-15.1-17-15.1z"/>
      <path fill={isMono ? fg : C.blue} d="m75 15c-8.7 0-16.6 7.3-16.6 16.3v102.1c0 7.8 6.6 16 16.4 16 4.9 0 8.7-1.3 11.9-4.2 3.2-2.8 5.1-6.9 5.1-11.7v-102.2c0-7.9-7.2-16.3-16.8-16.3z"/>
      <path fill={isMono ? fg : C.navy} d="m28 46c-9.2 0-17 7.6-17 16.5v39.1c0 8.3 6.2 17.1 17 17.1 10 0 16.8-7.1 16.8-17v-39.2c-0.5-8.2-7.5-16.5-16.8-16.5z"/>
      <path fill={isMono ? fg : C.navy} d="m122 46c-9 0-17.3 7.6-17.3 16.7v39c0 8.2 6.3 17 17.4 17 8.9 0 17.1-6.4 17.1-16.9v-39.3c0-8.2-7.2-16.5-17.2-16.5z"/>
    </svg>
  );
};

const CONCEPTS = [
  {
    name: "The Waveform Blob",
    rationale: "An organic, sticker-like blob interrupted by a sharp, rhythmic soundwave. Balances the playful, messy nature of learning with the precision of technical feedback.",
    Icon: WaveBlob
  },
  {
    name: "The Speech Dot",
    rationale: "A minimal, geometric speech bubble anchored by a single intentional dot. Represents the exact moment of focus and clarity when pressing record.",
    Icon: SpeechDot
  },
  {
    name: "The Cadence Arc",
    rationale: "An open, 60-second arc that subtly reads as a 'C'. It captures the feeling of motion, timing, and a safe, contained space for daily practice.",
    Icon: CadenceArc
  },
  {
    name: "The Asterisk",
    rationale: "A dynamic, bursting asterisk made of overlapping colorful petals. It feels like a joyful, editorial footnote or a spark of insight.",
    Icon: Asterisk
  },
  {
    name: "The Rhythm Bars",
    rationale: "Three rounded, pill-like rhythm bars that abstract a soundwave into a structured, architectural mark. Solid, reliable, and deeply tied to voice.",
    Icon: RhythmBars
  }
];

function ConceptShowcase({ concept, index }: { concept: any; index: number }) {
  const Icon = concept.Icon;
  return (
    <div className="relative">
      <div className="mb-10 border-b border-[#EAE5DA] pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-xl">
          <span className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
            Concept 0{index + 1}
          </span>
          <h2 className="text-4xl md:text-5xl font-fraunces text-[#1E2438]">{concept.name}</h2>
        </div>
        <p className="text-[#6B7186] font-inter max-w-sm text-base md:text-lg leading-relaxed">
          {concept.rationale}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Hero Showcase */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-12 md:p-24 flex items-center justify-center min-h-[400px] border border-[#EAE5DA] shadow-sm relative overflow-hidden group">
           <div className="absolute inset-0 bg-[#FAF7F0] opacity-60"></div>
           <Icon className="w-48 h-48 md:w-72 md:h-72 relative z-10 transform transition-transform duration-700 group-hover:scale-105" variant="full" />
        </div>

        {/* Variations Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center flex-1 border border-[#EAE5DA] shadow-sm">
            <div className="mb-6 text-xs font-inter text-[#6B7186] uppercase tracking-widest font-semibold">Favicon / 32px</div>
            <div className="w-20 h-20 rounded-2xl bg-[#FAF7F0] flex items-center justify-center border border-[#EAE5DA]">
              <Icon className="w-8 h-8" variant="full" />
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center flex-1 border border-[#EAE5DA] shadow-sm">
            <div className="mb-6 text-xs font-inter text-[#6B7186] uppercase tracking-widest font-semibold">Monotone Ink</div>
            <Icon className="w-24 h-24 text-[#1E2438]" fg={C.navy} bg="#FFFFFF" variant="monochrome" />
          </div>
        </div>
      </div>

      {/* Swatches Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Light Swatch */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center border border-[#EAE5DA] shadow-sm hover:shadow-md transition-shadow">
           <div className="mb-12 text-xs font-inter text-[#6B7186] uppercase tracking-widest font-semibold">Light Swatch</div>
           <Icon className="w-24 h-24 mb-12" fg={C.navy} bg="#FFFFFF" variant="monochrome" />
           <div className="flex items-center gap-3">
             <Icon className="w-8 h-8" fg={C.navy} bg="#FFFFFF" variant="monochrome" />
             <span className="font-fraunces text-2xl text-[#1E2438]">Cadence</span>
           </div>
        </div>

        {/* Dark Swatch */}
        <div className="bg-[#1E2438] rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
           <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3D52B4] rounded-full blur-[80px] opacity-40"></div>
           <div className="mb-12 text-xs font-inter text-[#8FA0DE] uppercase tracking-widest font-semibold relative z-10">Dark Swatch</div>
           <Icon className="w-24 h-24 mb-12 relative z-10" fg={C.canvas} bg={C.navy} variant="monochrome" />
           <div className="flex items-center gap-3 relative z-10">
             <Icon className="w-8 h-8" fg={C.canvas} bg={C.navy} variant="monochrome" />
             <span className="font-fraunces text-2xl text-[#FAF7F0]">Cadence</span>
           </div>
        </div>
        
        {/* Anchor Swatch */}
        <div className="bg-[#3D52B4] rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
           <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#8C67CB] rounded-full blur-[80px] opacity-40"></div>
           <div className="mb-12 text-xs font-inter text-[#C9D2F8] uppercase tracking-widest font-semibold relative z-10">Anchor Swatch</div>
           <Icon className="w-24 h-24 mb-12 relative z-10" fg={C.yellow} bg={C.blue} variant="monochrome" />
           <div className="flex items-center gap-3 relative z-10">
             <Icon className="w-8 h-8" fg={C.yellow} bg={C.blue} variant="monochrome" />
             <span className="font-fraunces text-2xl text-[#F4C744]">Cadence</span>
           </div>
        </div>
      </div>
    </div>
  )
}

export default function LogoBoard() {
  return (
    <div className="min-h-[100dvh] bg-[#FAF7F0] text-[#1E2438] relative pb-32">
      <NoiseOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&display=swap');
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <div className="px-8 md:px-16 pt-24 pb-32 max-w-[1400px] mx-auto">
        <header className="max-w-6xl mx-auto mb-32 relative z-10">
          <div className="inline-flex items-center gap-3 mb-8 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-[#EAE5DA]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E56D93] animate-pulse" />
            <span className="font-inter text-xs font-bold text-[#1E2438] uppercase tracking-[0.15em]">Brand Book // Vol. 1</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-fraunces tracking-tight mb-8">
            Cadence <br/> <span className="text-[#3D52B4] italic font-light">Identity</span> Concepts
          </h1>
          <p className="text-xl md:text-2xl font-inter text-[#6B7186] max-w-3xl leading-relaxed">
            Exploring five distinct directions for the primary brand mark. Designed for the "Ink &amp; Paper" aesthetic — warm, editorial, playful, and undeniably crafted.
          </p>
        </header>
        
        <main className="max-w-6xl mx-auto flex flex-col gap-40 relative z-10">
          {CONCEPTS.map((concept, idx) => (
            <ConceptShowcase key={idx} concept={concept} index={idx} />
          ))}
        </main>
        
        <footer className="max-w-6xl mx-auto mt-40 pt-16 border-t border-[#EAE5DA] flex flex-col md:flex-row justify-between items-center text-[#6B7186] font-inter relative z-10">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <SpeechDot className="w-6 h-6" variant="monochrome" fg={C.navy} />
            <span className="font-medium text-[#1E2438]">Cadence Design System</span>
          </div>
          <span className="text-sm tracking-widest uppercase">Internal Review — 2024</span>
        </footer>
      </div>
    </div>
  );
}
