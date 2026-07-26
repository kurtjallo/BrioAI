import React from 'react';

const C = {
  canvas: '#FAF7F0',
  navy: '#1E2438',
  ink: '#1B2033',
  blue: '#3D52B4',
  blueSoft: '#E8ECF9',
  blueMid: '#8FA0DE',
  heroGradStart: '#4A61C4',
  heroGradEnd: '#33459C',
  yellow: '#F4C744',
  orange: '#EE7B42',
  green: '#57B57F',
  purple: '#8C67CB',
  pink: '#E56D93',
  softBlue: '#8CB8F3',
  border: '#EAE5DA',
  card: '#FFFFFF',
  muted: '#ECE8DF',
  mutedFg: '#6B7186',
};

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03]" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }} />
);

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

// 1. Phone Frame Mockup (Today Screen)
const PhoneMockup = () => {
  return (
    <div className="relative w-[340px] h-[720px] bg-[#FAF7F0] rounded-[48px] shadow-2xl border-[12px] border-[#1E2438] overflow-hidden shrink-0 flex flex-col">
      {/* Dynamic Island fake */}
      <div className="absolute top-0 w-full flex justify-center z-50">
        <div className="w-[120px] h-[32px] bg-[#1E2438] rounded-b-3xl"></div>
      </div>
      
      <div className="px-6 pt-16 pb-8 flex-1 overflow-y-auto hide-scrollbar flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="text-[#3D52B4] font-semibold tracking-[1.5px] text-sm uppercase">Feb 15</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#F4C744] px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B2033" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span className="font-bold text-[#1B2033] text-sm leading-none">4</span>
            </div>
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#EAE5DA]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B2033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div 
          className="rounded-[32px] p-7 pt-9 min-h-[190px] flex flex-col justify-center relative overflow-hidden mb-5 shrink-0" 
          style={{ 
            background: `linear-gradient(135deg, ${C.heroGradStart}, ${C.heroGradEnd})`,
            boxShadow: '0 8px 20px rgba(39, 51, 94, 0.08)' 
          }}
        >
          {/* Decorative SVG Blob / Sparkle fake */}
          <div className="absolute -top-12 -right-8 w-48 h-48 bg-[#8CB8F3] opacity-20 blur-xl rounded-full" />
          <svg className="absolute bottom-5 right-5 w-8 h-8 text-[#E56D93] opacity-80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
          </svg>
          
          <h2 className="text-white font-fraunces font-bold text-[40px] leading-[44px] mb-3 relative z-10">
            Daily<br/>practice.
          </h2>
          <p className="text-[#E8ECF9] font-medium text-[15px] leading-snug relative z-10">
            One take. Sixty seconds.<br/>Speak with intent.
          </p>
        </div>

        {/* From Last Time */}
        <div className="relative mb-5 shrink-0">
          <Asterisk className="absolute -top-3 -left-3 w-8 h-8 transform -rotate-6 z-10" />
          <div className="bg-white rounded-[32px] p-6 pt-7 shadow-[0_8px_20px_rgba(39,51,94,0.06)] relative border border-[#EAE5DA]">
            <div className="text-[#6B7186] font-semibold text-[11px] tracking-widest uppercase mb-2">From last time</div>
            <p className="text-[#1B2033] italic text-base leading-relaxed">
              "Try to eliminate 'like' as a filler word when pausing to think."
            </p>
          </div>
        </div>

        {/* Today's Prompt */}
        <div className="shrink-0 mb-4 flex-1">
          <div className="text-[#6B7186] font-medium text-[11px] tracking-widest uppercase mb-3 ml-2">Today's prompt</div>
          <div className="bg-white rounded-[32px] p-7 border border-[#EAE5DA] shadow-[0_8px_20px_rgba(39,51,94,0.06)] h-full">
            <p className="text-[#1B2033] font-fraunces text-[24px] leading-[32px]">
              Talk about a moment today that completely surprised you.
            </p>
          </div>
        </div>

        {/* Record Pill */}
        <div className="bg-[#1E2438] rounded-full p-2 pl-2 pr-10 flex items-center justify-between mt-auto mb-2 shadow-[0_12px_24px_rgba(39,51,94,0.15)] shrink-0">
          <div className="w-11 h-11 bg-[#E56D93] rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
          <span className="text-[#FAF8F2] font-semibold text-lg">Start recording</span>
          <div className="w-11" /> {/* balance */}
        </div>
        <p className="text-[#6B7186] text-center text-[13px] mb-2 shrink-0">Speak for up to 60 seconds. One take.</p>
      </div>
    </div>
  );
};

// 2. App Icon
const AppIcon = () => (
  <div className="w-[128px] h-[128px] bg-[#FAF7F0] rounded-[28px] shadow-[0_12px_24px_rgba(39,51,94,0.12)] flex items-center justify-center border border-white relative overflow-hidden shrink-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-[#1E2438]/5 to-transparent pointer-events-none" />
    <Asterisk className="w-20 h-20 drop-shadow-sm" />
  </div>
);

// 3. App Store Listing
const AppStoreListing = () => (
  <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#EAE5DA] w-full max-w-[420px] flex flex-col shrink-0">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 bg-[#FAF7F0] rounded-[20px] flex items-center justify-center border border-[#EAE5DA]/50 shadow-sm shrink-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1E2438]/5 to-transparent pointer-events-none" />
        <Asterisk className="w-12 h-12" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-[20px] text-gray-900 leading-tight mb-1">Cadence:<br/>Daily Speaking</h3>
        <p className="text-[#6B7186] text-[13px]">Speak with intent.</p>
      </div>
      <button className="bg-[#F1F2F6] text-[#3D52B4] font-bold text-[15px] px-5 py-1.5 rounded-full self-center tracking-wide">
        GET
      </button>
    </div>
    
    <div className="flex gap-3 overflow-hidden pb-1">
      {/* Mock Screenshot 1 */}
      <div className="w-[100px] h-[216px] bg-[#FAF7F0] rounded-[16px] border border-[#EAE5DA] overflow-hidden relative shadow-sm">
         <div className="w-full h-8 bg-[#1E2438] absolute top-0" />
         <div className="px-2 pt-10">
           <div className="w-full h-[60px] rounded-lg bg-gradient-to-br from-[#4A61C4] to-[#33459C] mb-2 shadow-sm" />
           <div className="w-full h-[40px] rounded-lg bg-white border border-[#EAE5DA] shadow-sm mb-2" />
           <div className="w-full h-8 rounded-full bg-[#1E2438] mt-6 shadow-sm" />
         </div>
      </div>
      {/* Mock Screenshot 2 */}
      <div className="w-[100px] h-[216px] bg-[#FAF7F0] rounded-[16px] border border-[#EAE5DA] overflow-hidden relative shadow-sm">
         <div className="px-2 pt-6">
            <div className="w-12 h-12 rounded-full border-[3px] border-[#3D52B4] mx-auto mb-3 opacity-60" />
            <div className="w-full h-[80px] rounded-lg bg-white border border-[#EAE5DA] shadow-sm mb-2" />
            <div className="w-full h-[20px] rounded-lg bg-white border border-[#EAE5DA] shadow-sm" />
         </div>
      </div>
      {/* Mock Screenshot 3 */}
      <div className="w-[100px] h-[216px] bg-[#FAF7F0] rounded-[16px] border border-[#EAE5DA] overflow-hidden relative shadow-sm">
         <div className="px-2 pt-6 flex flex-col gap-2">
            <div className="w-full h-10 rounded-lg bg-white border border-[#EAE5DA] shadow-sm" />
            <div className="w-full h-10 rounded-lg bg-white border border-[#EAE5DA] shadow-sm" />
            <div className="w-full h-10 rounded-lg bg-[#E56D93] shadow-sm" />
            <div className="w-full h-10 rounded-lg bg-white border border-[#EAE5DA] shadow-sm" />
         </div>
      </div>
    </div>
  </div>
);

// 4. Marketing Hero
const MarketingHero = () => (
  <div className="w-full bg-[#FAF7F0] rounded-[32px] overflow-hidden border border-[#EAE5DA] shadow-sm relative min-h-[500px] flex flex-col shrink-0">
    {/* Nav */}
    <nav className="flex justify-between items-center p-6 px-10 relative z-20">
      <div className="flex items-center gap-3">
        <Asterisk className="w-8 h-8 drop-shadow-sm" />
        <span className="font-fraunces font-bold text-2xl text-[#1E2438]">Cadence</span>
      </div>
      <div className="hidden md:flex gap-8 text-[#1B2033] font-medium text-sm">
        <a href="#" className="hover:text-[#3D52B4] transition-colors">Method</a>
        <a href="#" className="hover:text-[#3D52B4] transition-colors">Testimonials</a>
        <a href="#" className="hover:text-[#3D52B4] transition-colors">Pricing</a>
      </div>
      <div className="hidden md:flex gap-4 items-center">
        <a href="#" className="text-[#1B2033] font-medium text-sm hover:text-[#3D52B4] transition-colors">Log In</a>
        <button className="bg-[#1E2438] text-[#FAF7F0] px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#1B2033] transition-colors shadow-sm">Get Started</button>
      </div>
    </nav>

    {/* Hero Content */}
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-20 pb-16 text-center mt-8">
      <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-[#EAE5DA] mb-8">
        <span className="w-2 h-2 rounded-full bg-[#57B57F]"></span>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#1B2033]">Cadence 2.0 is live</span>
      </div>
      
      <h1 className="font-fraunces text-5xl md:text-7xl lg:text-[84px] text-[#1E2438] leading-[1.05] tracking-tight max-w-[900px] mb-8">
        Find your voice, <br/>
        <span className="text-[#3D52B4] italic font-light relative">
          one minute
          <svg className="absolute -bottom-2 left-0 w-full text-[#F4C744]" viewBox="0 0 100 10" preserveAspectRatio="none">
             <path d="M0,5 Q50,10 100,2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span> at a time.
      </h1>
      
      <p className="text-[#6B7186] font-inter text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
        Record a 60-second answer to a daily prompt. Get thoughtful, editorial feedback on your word choice and structure. Become a more intentional speaker.
      </p>

      <button className="bg-[#1E2438] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-[0_8px_20px_rgba(30,36,56,0.2)] hover:bg-[#1B2033] hover:scale-105 transition-all flex items-center gap-2 group">
        Start practicing — Free
        <svg className="transform group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>

    {/* Decorative Elements */}
    <Asterisk className="absolute top-[20%] right-[10%] w-32 h-32 opacity-20 transform rotate-12 pointer-events-none" />
    <Asterisk className="absolute bottom-[10%] left-[5%] w-24 h-24 opacity-[0.15] transform -rotate-45 pointer-events-none" />
    
    <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
  </div>
);

// 5. Social Post 1:1
const SocialPost = () => (
  <div className="w-[400px] h-[400px] bg-[#0D101A] rounded-[32px] overflow-hidden flex flex-col justify-between p-10 relative shadow-[0_16px_40px_rgba(13,16,26,0.3)] shrink-0 border border-[#262C3E]">
    <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#3A4EB5] rounded-full blur-[90px] opacity-50 pointer-events-none" />
    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#B24A6E] rounded-full blur-[90px] opacity-30 pointer-events-none" />
    
    <div className="relative z-10 flex justify-between items-start">
      <Asterisk className="w-10 h-10" variant="monochrome" fg={C.canvas} />
      <span className="text-[#A5B4F4] font-semibold text-xs tracking-widest uppercase">Milestone</span>
    </div>

    <div className="relative z-10">
      <div className="text-[140px] font-fraunces leading-[0.8] text-[#F1F2F8] mb-4 -ml-2 tracking-tighter drop-shadow-sm">30</div>
      <h3 className="font-fraunces text-4xl text-[#F1F2F8] mb-3 italic font-light drop-shadow-sm">Days of Cadence.</h3>
      <p className="text-[#C9D2F8] font-inter text-lg">A habit formed.</p>
    </div>
  </div>
);

export default function BrandInActionBoard() {
  return (
    <div className="min-h-[100dvh] bg-[#FFFFFF] text-[#1E2438] relative pb-32 font-inter">
      <NoiseOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600;700&display=swap');
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="px-6 md:px-12 lg:px-20 pt-20 pb-32 max-w-[1600px] mx-auto">
        <header className="mb-24 relative z-10 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-8 bg-[#FAF7F0] px-4 py-2 rounded-full border border-[#EAE5DA]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E56D93] animate-pulse" />
            <span className="font-inter text-xs font-bold text-[#1E2438] uppercase tracking-[0.15em]">Brand Book // Vol. 3</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-fraunces tracking-tight mb-8 leading-[1.05]">
            Brand in <br/> <span className="text-[#3D52B4] italic font-light">Action</span>
          </h1>
          <p className="text-xl md:text-2xl font-inter text-[#6B7186] max-w-3xl leading-relaxed">
            Applying the "Ink & Paper" aesthetic to real touchpoints. From the core product experience to marketing surfaces, everything feels warm, editorial, and intentionally crafted.
          </p>
        </header>

        <main className="flex flex-col gap-24 md:gap-32 relative z-10 max-w-6xl mx-auto">
          {/* Section 1: Product Context (App + Listing) */}
          <section>
             <div className="mb-12 border-b border-[#EAE5DA] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <span className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                     Touchpoint 01
                   </span>
                   <h2 className="text-4xl md:text-5xl font-fraunces text-[#1E2438]">The Daily Ritual</h2>
                </div>
                <p className="text-[#6B7186] font-inter max-w-sm text-base md:text-lg leading-relaxed">
                   The core Today screen designed as an immersive, focused entry point, paired with our App Store presence.
                </p>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 flex justify-center lg:justify-end lg:pr-12">
                   <PhoneMockup />
                </div>
                <div className="lg:col-span-6 flex flex-col gap-12">
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1E2438] mb-6">App Icon</h4>
                     <AppIcon />
                   </div>
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1E2438] mb-6">Store Listing</h4>
                     <AppStoreListing />
                   </div>
                </div>
             </div>
          </section>

          {/* Section 2: Marketing */}
          <section>
             <div className="mb-12 border-b border-[#EAE5DA] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <span className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                     Touchpoint 02
                   </span>
                   <h2 className="text-4xl md:text-5xl font-fraunces text-[#1E2438]">Marketing Surfaces</h2>
                </div>
                <p className="text-[#6B7186] font-inter max-w-sm text-base md:text-lg leading-relaxed">
                   Expansive cream canvases, massive typography, and playful brand marks translating the vibe to the web.
                </p>
             </div>
             
             <div className="w-full">
               <MarketingHero />
             </div>
          </section>

          {/* Section 3: Social */}
          <section>
             <div className="mb-12 border-b border-[#EAE5DA] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <span className="text-[#3D52B4] font-inter font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                     Touchpoint 03
                   </span>
                   <h2 className="text-4xl md:text-5xl font-fraunces text-[#1E2438]">Social & Community</h2>
                </div>
                <p className="text-[#6B7186] font-inter max-w-sm text-base md:text-lg leading-relaxed">
                   Deep night-mode jewels and high-contrast typography for shareable milestones and community celebration.
                </p>
             </div>
             
             <div className="flex justify-center lg:justify-start">
                <SocialPost />
             </div>
          </section>
        </main>

        <footer className="max-w-6xl mx-auto mt-40 pt-16 border-t border-[#EAE5DA] flex flex-col md:flex-row justify-between items-center text-[#6B7186] font-inter relative z-10">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Asterisk className="w-6 h-6" variant="monochrome" fg={C.navy} />
            <span className="font-medium text-[#1E2438]">Cadence Design System</span>
          </div>
          <span className="text-sm tracking-widest uppercase font-semibold">Internal Review — 2024</span>
        </footer>
      </div>
    </div>
  );
}