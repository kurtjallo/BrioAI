import React from 'react';

const C = {
  canvas: '#FAF7F0',
  navy: '#1E2438',
  ink: '#1B2033',
  blue: '#3D52B4',
  softBlue: '#8CB8F3',
  yellow: '#F4C744',
  pink: '#E56D93',
  green: '#57B57F',
  orange: '#EE7B42',
  purple: '#8C67CB',
  border: '#EAE5DA',
  muted: '#6B7186',
  white: '#FFFFFF',
};

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03]" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }} />
);

const Asterisk = ({ variant = 'full', fg = C.navy, className }: any) => {
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

const ColorSwatch = ({ bg, name, hex, textClass = 'text-white' }: { bg: string, name: string, hex: string, textClass?: string }) => (
  <div className="flex flex-col gap-3">
    <div className={`h-32 w-full rounded-2xl shadow-sm border border-[${C.border}] relative overflow-hidden`} style={{ backgroundColor: bg }}>
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
    </div>
    <div>
      <div className="font-inter font-semibold text-sm" style={{ color: C.ink }}>{name}</div>
      <div className="font-inter text-xs" style={{ color: C.muted }}>{hex}</div>
    </div>
  </div>
);

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="mb-12 border-b border-[#EAE5DA] pb-8">
    <h2 className="text-3xl md:text-4xl font-fraunces mb-4" style={{ color: C.navy }}>{title}</h2>
    <p className="text-lg font-inter max-w-2xl leading-relaxed" style={{ color: C.muted }}>{description}</p>
  </div>
);

export default function GuidelinesBoard() {
  return (
    <div className="min-h-[100dvh] relative pb-32" style={{ backgroundColor: C.canvas, color: C.ink }}>
      <NoiseOverlay />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&display=swap');
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <div className="px-6 md:px-12 pt-20 pb-32 max-w-[1200px] mx-auto">
        <header className="mb-24 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-6 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-[#EAE5DA]">
              <div className="w-2 h-2 rounded-full bg-[#57B57F] animate-pulse" />
              <span className="font-inter text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.navy }}>Brand Guidelines</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-fraunces tracking-tight leading-tight" style={{ color: C.navy }}>
              Ink &amp; Paper<br/>
              <span className="italic font-light" style={{ color: C.blue }}>Design System</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 hidden md:flex pb-4">
            <Asterisk className="w-12 h-12" variant="full" />
            <span className="font-fraunces text-3xl" style={{ color: C.navy }}>Cadence</span>
          </div>
        </header>
        
        <div className="flex flex-col gap-32 relative z-10">
          
          {/* Logo Usage */}
          <section>
            <SectionHeader 
              title="1. Logo Usage" 
              description="The Sticker Asterisk is our primary mark. It should feel like a joyful footnote. Use the full-color version when possible, and monotone only when required."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-[2rem] p-12 border border-[#EAE5DA] shadow-sm flex flex-col items-center justify-center relative group min-h-[360px]">
                <div className="absolute top-6 left-6 text-xs font-inter uppercase tracking-widest font-semibold" style={{ color: C.muted }}>Primary Mark</div>
                <div className="flex items-center gap-6">
                  <Asterisk className="w-20 h-20" variant="full" />
                  <span className="font-fraunces text-6xl" style={{ color: C.navy }}>Cadence</span>
                </div>
              </div>
              
              <div className="bg-white rounded-[2rem] p-12 border border-[#EAE5DA] shadow-sm flex flex-col relative min-h-[360px]">
                <div className="absolute top-6 left-6 text-xs font-inter uppercase tracking-widest font-semibold" style={{ color: C.muted }}>Clear Space & Sizing</div>
                <div className="flex-1 flex flex-col items-center justify-center gap-12 mt-8">
                  <div className="relative">
                    <div className="absolute -inset-4 border border-dashed border-[#8CB8F3] bg-[#8CB8F3]/10 rounded-lg"></div>
                    <Asterisk className="w-16 h-16 relative z-10" variant="full" />
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <div className="w-[1px] h-4 bg-[#3D52B4]"></div>
                      <span className="text-[10px] font-inter font-medium text-[#3D52B4] uppercase">1x Petal</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <Asterisk className="w-6 h-6" variant="full" />
                    <span className="text-xs font-inter font-medium" style={{ color: C.muted }}>Minimum Size: 24px</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#1E2438] rounded-3xl p-8 flex flex-col items-center justify-center aspect-square shadow-sm">
                <div className="text-xs font-inter text-[#6B7186] uppercase tracking-widest font-semibold mb-6">Navy Canvas</div>
                <Asterisk className="w-16 h-16 mb-4" variant="monochrome" fg={C.white} />
              </div>
              <div className="bg-[#3D52B4] rounded-3xl p-8 flex flex-col items-center justify-center aspect-square shadow-sm">
                <div className="text-xs font-inter text-[#8FA0DE] uppercase tracking-widest font-semibold mb-6">Blue Canvas</div>
                <Asterisk className="w-16 h-16 mb-4" variant="monochrome" fg={C.yellow} />
              </div>
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center aspect-square border border-[#EAE5DA] shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-4 left-4 bg-[#E56D93] text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Don't</div>
                <Asterisk className="w-16 h-16 mb-4 relative z-10" variant="full" />
                <span className="text-xs font-inter text-center mt-2 relative z-10" style={{ color: C.muted }}>No busy backgrounds</span>
              </div>
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center aspect-square border border-[#EAE5DA] shadow-sm relative">
                <div className="absolute top-4 left-4 bg-[#E56D93] text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Don't</div>
                <Asterisk className="w-16 h-16 mb-4 scale-x-[1.5]" variant="full" />
                <span className="text-xs font-inter text-center mt-2" style={{ color: C.muted }}>No stretching or altering</span>
              </div>
            </div>
          </section>

          {/* Color System */}
          <section>
            <SectionHeader 
              title="2. Color System" 
              description="Our palette is built on a warm cream canvas and anchored by rich ink tones. Accents are applied sparingly like highlighters on paper."
            />
            
            <div className="mb-12">
              <h3 className="text-sm font-inter uppercase tracking-widest font-semibold mb-6" style={{ color: C.ink }}>Base & Anchors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ColorSwatch bg={C.canvas} name="Warm Canvas" hex="#FAF7F0" />
                <ColorSwatch bg={C.white} name="Card White" hex="#FFFFFF" />
                <ColorSwatch bg={C.navy} name="Ink Navy" hex="#1E2438" />
                <ColorSwatch bg={C.blue} name="Anchor Blue" hex="#3D52B4" />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-inter uppercase tracking-widest font-semibold mb-6" style={{ color: C.ink }}>Playful Accents</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                <ColorSwatch bg={C.yellow} name="Yellow" hex="#F4C744" />
                <ColorSwatch bg={C.orange} name="Orange" hex="#EE7B42" />
                <ColorSwatch bg={C.green} name="Green" hex="#57B57F" />
                <ColorSwatch bg={C.purple} name="Purple" hex="#8C67CB" />
                <ColorSwatch bg={C.pink} name="Pink" hex="#E56D93" />
                <ColorSwatch bg={C.softBlue} name="Soft Blue" hex="#8CB8F3" />
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <SectionHeader 
              title="3. Typography" 
              description="A pairing of highly expressive serif for moments of personality, and a clean, legible sans-serif for UI and dense text."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white rounded-[2rem] p-10 border border-[#EAE5DA] shadow-sm">
                <div className="flex justify-between items-end mb-10 pb-6 border-b border-[#EAE5DA]">
                  <div>
                    <div className="text-xs font-inter uppercase tracking-widest font-semibold mb-1" style={{ color: C.muted }}>Primary Display</div>
                    <div className="text-xl font-inter font-semibold" style={{ color: C.navy }}>Fraunces</div>
                  </div>
                  <div className="text-4xl font-fraunces" style={{ color: C.blue }}>Aa</div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] font-inter uppercase tracking-widest text-[#6B7186] block mb-2">Heading 1 / 48px+</span>
                    <div className="text-5xl font-fraunces leading-tight" style={{ color: C.navy }}>Find your rhythm.</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-inter uppercase tracking-widest text-[#6B7186] block mb-2">Heading 2 / 32px</span>
                    <div className="text-3xl font-fraunces leading-tight" style={{ color: C.navy }}>Daily speaking practice.</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-inter uppercase tracking-widest text-[#6B7186] block mb-2">Heading 3 / 24px</span>
                    <div className="text-xl font-fraunces leading-tight italic" style={{ color: C.navy }}>Thoughtful feedback.</div>
                  </div>
                </div>
                <div className="mt-10 p-4 bg-[#FAF7F0] rounded-xl text-sm font-inter text-[#6B7186] border border-[#EAE5DA]">
                  <strong className="text-[#1E2438] block mb-1">Rule:</strong> Never use Fraunces for body copy or UI elements. It is strictly for headings and expressive moments.
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-10 border border-[#EAE5DA] shadow-sm">
                <div className="flex justify-between items-end mb-10 pb-6 border-b border-[#EAE5DA]">
                  <div>
                    <div className="text-xs font-inter uppercase tracking-widest font-semibold mb-1" style={{ color: C.muted }}>Body & UI</div>
                    <div className="text-xl font-inter font-semibold" style={{ color: C.navy }}>Inter</div>
                  </div>
                  <div className="text-4xl font-inter font-medium" style={{ color: C.blue }}>Aa</div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] font-inter uppercase tracking-widest text-[#6B7186] block mb-2">Body Large / 18px</span>
                    <div className="text-lg font-inter leading-relaxed" style={{ color: C.navy }}>A premium daily speaking-practice app that gives you thoughtful feedback on word choice and structure.</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-inter uppercase tracking-widest text-[#6B7186] block mb-2">Body Regular / 16px (Web Min)</span>
                    <div className="text-base font-inter leading-relaxed" style={{ color: C.muted }}>Record a 60-second answer to a daily prompt, get thoughtful AI feedback, and improve your communication skills.</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-inter uppercase tracking-widest text-[#6B7186] block mb-2">UI Small / 14px (Mobile Min) / 12px (Caption)</span>
                    <div className="text-sm font-inter font-medium" style={{ color: C.navy }}>Recording saved • 1 min ago</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Voice & Tone */}
          <section>
            <SectionHeader 
              title="4. Voice & Tone" 
              description="Warm, encouraging, editorial, and a little playful. We sound like a great writing coach — never clinical, never robotic."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-[#EAE5DA] shadow-sm">
                <div className="text-[10px] font-inter uppercase tracking-widest text-[#8CB8F3] font-bold mb-4">Hero Headline</div>
                <div className="font-fraunces text-2xl text-[#1E2438] mb-4">Speak with intention.</div>
                <div className="text-sm font-inter text-[#6B7186]">Inspiring, direct, and focused on the user's growth.</div>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-[#EAE5DA] shadow-sm">
                <div className="text-[10px] font-inter uppercase tracking-widest text-[#57B57F] font-bold mb-4">Onboarding Welcome</div>
                <div className="font-fraunces text-2xl text-[#1E2438] mb-4">Let's find your voice.</div>
                <div className="text-sm font-inter text-[#6B7186]">Warm and collaborative. We are on this journey together.</div>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-[#EAE5DA] shadow-sm">
                <div className="text-[10px] font-inter uppercase tracking-widest text-[#E56D93] font-bold mb-4">Error Message</div>
                <div className="font-fraunces text-2xl text-[#1E2438] mb-4">We lost the thread.</div>
                <div className="text-sm font-inter text-[#6B7186] mb-4">"Your connection dropped, but your recording is safe. Let's try syncing again."</div>
                <div className="text-xs font-inter text-[#6B7186] italic">Reassuring, clear, no technical jargon.</div>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-[#EAE5DA] shadow-sm">
                <div className="text-[10px] font-inter uppercase tracking-widest text-[#F4C744] font-bold mb-4">Empty State</div>
                <div className="font-fraunces text-2xl text-[#1E2438] mb-4">A blank page.</div>
                <div className="text-sm font-inter text-[#6B7186] mb-4">"You haven't recorded anything yet today. Ready for your first prompt?"</div>
                <div className="text-xs font-inter text-[#6B7186] italic">Inviting and suggestive, not a dead end.</div>
              </div>
              
              <div className="bg-[#1E2438] p-8 rounded-3xl shadow-sm lg:col-span-2 flex flex-col justify-center">
                <div className="text-[10px] font-inter uppercase tracking-widest text-[#8CB8F3] font-bold mb-6">Call to Action</div>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="bg-white text-[#1E2438] px-6 py-3 rounded-full font-inter font-semibold text-sm shadow-sm hover:scale-105 transition-transform">
                    Start Recording
                  </button>
                  <button className="bg-[#3D52B4] text-white px-6 py-3 rounded-full font-inter font-semibold text-sm shadow-sm hover:scale-105 transition-transform">
                    Review Feedback
                  </button>
                  <div className="text-sm font-inter text-[#8FA0DE] ml-4 max-w-sm">
                    Action-oriented, clear verbs. Never vague like "Click here" or "Submit".
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Standards */}
          <section>
            <SectionHeader 
              title="5. Accessibility Standards" 
              description="Design is only good if everyone can use it. We adhere strictly to inclusive practices."
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-[2rem] p-8 border border-[#EAE5DA] shadow-sm text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#E8ECF9] flex items-center justify-center text-[#3D52B4] font-bold font-inter text-xl mb-4">
                  AA
                </div>
                <h4 className="font-inter font-semibold text-[#1E2438] mb-2">Contrast Ratios</h4>
                <p className="text-xs font-inter text-[#6B7186]">All text meets WCAG AA 4.5:1 minimum against its background.</p>
              </div>
              
              <div className="bg-white rounded-[2rem] p-8 border border-[#EAE5DA] shadow-sm text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#EAE5DA] flex items-center justify-center relative mb-4">
                  <div className="w-11 h-11 bg-[#1E2438] rounded-full opacity-20 absolute"></div>
                  <div className="w-2 h-2 bg-[#1E2438] rounded-full"></div>
                </div>
                <h4 className="font-inter font-semibold text-[#1E2438] mb-2">44px Touch Targets</h4>
                <p className="text-xs font-inter text-[#6B7186]">All interactive elements have a minimum 44x44px hit area on mobile.</p>
              </div>
              
              <div className="bg-white rounded-[2rem] p-8 border border-[#EAE5DA] shadow-sm text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#57B57F] flex items-center justify-center mb-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#57B57F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                </div>
                <h4 className="font-inter font-semibold text-[#1E2438] mb-2">Reduced Motion</h4>
                <p className="text-xs font-inter text-[#6B7186]">Respect system preferences. Animations degrade gracefully to static states.</p>
              </div>
              
              <div className="bg-white rounded-[2rem] p-8 border border-[#EAE5DA] shadow-sm text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-[#FAF7F0] flex items-center justify-center mb-4 border border-[#EAE5DA]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E2438" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                </div>
                <h4 className="font-inter font-semibold text-[#1E2438] mb-2">Icon Clarity</h4>
                <p className="text-xs font-inter text-[#6B7186]">Designed on a 24px grid. 2px strokes. Recognizable at small sizes.</p>
              </div>
            </div>
          </section>

          {/* Applications */}
          <section>
            <SectionHeader 
              title="6. Applications" 
              description="How the system comes together in physical and digital touchpoints."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Business Card */}
              <div>
                <h3 className="text-sm font-inter uppercase tracking-widest font-semibold mb-6" style={{ color: C.ink }}>Business Card (3.5" x 2")</h3>
                <div className="flex flex-col gap-6">
                  {/* Front */}
                  <div className="w-full aspect-[3.5/2] max-w-[420px] bg-[#FAF7F0] rounded-xl shadow-md border border-[#EAE5DA] p-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}></div>
                    <div className="flex justify-between items-start relative z-10">
                      <Asterisk className="w-10 h-10" variant="full" />
                      <div className="text-right">
                        <div className="font-inter font-bold text-sm tracking-widest uppercase text-[#3D52B4] mb-1">Cadence</div>
                      </div>
                    </div>
                    <div className="relative z-10 mt-auto">
                      <div className="font-fraunces text-2xl text-[#1E2438] mb-1">Elena Rostova</div>
                      <div className="font-inter text-xs text-[#6B7186] uppercase tracking-widest">Head of Product</div>
                    </div>
                  </div>
                  
                  {/* Back */}
                  <div className="w-full aspect-[3.5/2] max-w-[420px] bg-[#1E2438] rounded-xl shadow-md p-8 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#3D52B4] rounded-full blur-[40px] opacity-40"></div>
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#E56D93] rounded-full blur-[40px] opacity-20"></div>
                    <Asterisk className="w-20 h-20 relative z-10" variant="monochrome" fg={C.canvas} />
                  </div>
                </div>
              </div>

              {/* Social Post */}
              <div>
                <h3 className="text-sm font-inter uppercase tracking-widest font-semibold mb-6" style={{ color: C.ink }}>Social Post (1:1)</h3>
                <div className="w-full max-w-[420px] aspect-square bg-[#FAF7F0] rounded-[2rem] shadow-md border border-[#EAE5DA] p-12 flex flex-col justify-center relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8ECF9] rounded-full blur-[60px] opacity-60 -translate-y-1/2 translate-x-1/4"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <Asterisk className="w-16 h-16 mb-10" variant="full" />
                    <h4 className="font-fraunces text-4xl leading-tight text-[#1E2438] mb-6">
                      Great speaking <br/> starts with <span className="text-[#3D52B4] italic">listening.</span>
                    </h4>
                    <p className="font-inter text-[#6B7186] text-sm">
                      Daily prompts to find your rhythm.
                    </p>
                  </div>
                  
                  <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-[#1E2438] opacity-40 text-xs font-inter tracking-widest uppercase">
                    <span>cadence.app</span>
                    <span>@cadence</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
        
        <footer className="mt-40 pt-12 border-t border-[#EAE5DA] flex flex-col md:flex-row justify-between items-center text-[#6B7186] font-inter text-sm">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Asterisk className="w-5 h-5" variant="monochrome" fg={C.muted} />
            <span>Cadence Brand Guidelines v1.0</span>
          </div>
          <span className="uppercase tracking-widest text-[10px]">Confidential — Do not distribute</span>
        </footer>
      </div>
    </div>
  );
}
