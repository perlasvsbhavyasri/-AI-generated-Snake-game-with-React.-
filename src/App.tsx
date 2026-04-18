import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [booted, setBooted] = useState(false);

  if (!booted) {
    return (
      <div className="h-screen w-full bg-dark-bg flex flex-col items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 static-noise z-50"></div>
        <div className="absolute inset-0 scanlines pointer-events-none z-40"></div>
        <div className="flex flex-col items-center z-10">
          <h1 className="text-[40px] text-white tracking-[8px] uppercase mb-12 glitch-text" data-text="V0ID.TERMINAL">
            V0ID.TERMINAL
          </h1>
          <button
             onClick={() => setBooted(true)}
             className="px-8 py-4 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black uppercase font-mono tracking-[4px] transition-none shadow-none text-xl relative overflow-hidden group"
          >
            SYS.INIT()
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-dark-bg font-sans overflow-hidden relative text-xl">
      <div className="absolute inset-0 static-noise z-50"></div>
      <div className="absolute inset-0 scanlines pointer-events-none z-40"></div>
      
      {/* Header */}
      <header className="h-[80px] px-[40px] flex items-center justify-between border-b-2 border-neon-magenta bg-surface shrink-0 z-10 relative">
         <div className="text-[28px] tracking-[6px] uppercase text-white glitch-text" data-text="V0ID.TERMINAL">
           V0ID.TERMINAL
         </div>
         
         <div className="flex gap-[40px] font-mono">
            <div className="flex flex-col items-end">
               <span className="text-[14px] text-text-dim">DATA_FRAGMENTS</span>
               <span className="text-[24px] text-neon-cyan">0x0042</span>
            </div>
            <div className="flex flex-col items-end hidden md:flex">
               <span className="text-[14px] text-text-dim">MAX_FRAGMENTS</span>
               <span className="text-[24px] text-neon-cyan">0x0128</span>
            </div>
            <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-[14px] text-text-dim">THREAT_LVL</span>
               <span className="text-[24px] text-neon-magenta">CRITICAL</span>
            </div>
         </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr_300px] gap-[4px] bg-neon-cyan overflow-hidden z-10 relative">
        
        {/* Left Panel */}
        <aside className="bg-dark-bg p-[30px] flex flex-col hidden md:flex border-r-2 border-neon-cyan">
          <h3 className="text-[18px] tracking-[4px] text-white bg-neon-magenta px-2 py-1 inline-block w-max mb-6">AUDIO_STREAM.OBJ</h3>
          
          <div className="mt-[10px]">
             <div className="p-[12px] mb-[12px] cursor-pointer transition-none border-l-4 border-neon-cyan bg-surface">
                <div className="text-[16px] mb-[4px] text-neon-cyan">PROC. HORIZON</div>
                <div className="text-[14px] text-text-dim">MEM_ADDR: 0x3F45</div>
             </div>
             
             <div className="p-[12px] mb-[12px] cursor-pointer transition-none border-l-4 border-[#333] hover:border-neon-magenta hover:bg-surface opacity-60">
                <div className="text-[16px] mb-[4px]">PROC. ECHOES</div>
                <div className="text-[14px] text-text-dim">MEM_ADDR: 0x22A0</div>
             </div>
             
             <div className="p-[12px] mb-[12px] cursor-pointer transition-none border-l-4 border-[#333] hover:border-neon-magenta hover:bg-surface opacity-60">
                <div className="text-[16px] mb-[4px]">PROC. VAPOR</div>
                <div className="text-[14px] text-text-dim">MEM_ADDR: 0x4B12</div>
             </div>
          </div>
          
          <div className="text-[14px] text-text-dim leading-[1.4] mt-[auto] tracking-[1px] border-t-2 border-dashed border-[#333] pt-4">
            [W/A/S/D] : MAP_NAV_VECTORS<br/>
            [TARGET]  : ABSORB_CORRUPTION<br/>
            [SYNC]    : AUDIO_CHRONO_LOCK
          </div>
        </aside>

        {/* Center Panel (Game Window) */}
        <section className="bg-[#000] flex flex-col items-center justify-center relative overflow-y-auto w-full h-full">
          <SnakeGame />
        </section>

        {/* Right Panel (Audio Control) */}
        <aside className="bg-dark-bg p-[30px] flex flex-col h-full overflow-hidden border-l-2 border-neon-cyan">
          <h3 className="text-[18px] tracking-[4px] text-white bg-neon-cyan px-2 py-1 inline-block w-max text-black mb-6">AMP_SPECTRUM</h3>
          
          <div className="h-[120px] flex items-end gap-[4px] mt-[10px] mb-8">
            <div className="flex-1 bg-neon-magenta h-[40%] animate-pulse"></div>
            <div className="flex-1 bg-neon-cyan h-[80%]"></div>
            <div className="flex-1 bg-neon-magenta h-[90%]"></div>
            <div className="flex-1 bg-neon-cyan h-[20%] animate-pulse"></div>
            <div className="flex-1 bg-neon-magenta h-[70%]"></div>
            <div className="flex-1 bg-neon-cyan h-[40%]"></div>
            <div className="flex-1 bg-neon-magenta h-[100%] animate-pulse"></div>
            <div className="flex-1 bg-neon-cyan h-[60%]"></div>
            <div className="flex-1 bg-neon-magenta h-[30%]"></div>
          </div>

          <MusicPlayer autoPlay={true} />
        </aside>
        
      </main>
    </div>
  );
}
