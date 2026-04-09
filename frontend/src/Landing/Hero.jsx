import React from 'react'
import Navbar from './components/Navbar'
import Problem from './components/Problem'
import Features from './components/Features'
import WhyUs from './components/WhyUs'
import Comparison from './components/Comparison'
import CTA from './components/Cta'

const Hero = () => {
  return (
    <div className='min-h-screen w-full bg-[#0a0a0a]'>
    <div className='relative min-h-screen w-full bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] font-chakra'>
      
      {/* Optional: Adds a subtle fade at the bottom so the grid doesn't just abruptly end if scrolling */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>

      <div className='relative z-10 max-w-5xl mx-auto text-zinc-100 flex flex-col items-center justify-center pt-4'>
        <Navbar />
        <div className='mt-32'>
          <h1 className='text-center text-7xl font-bold font-bebas tracking-wide drop-shadow-lg'>
            Ludo Was Luck. <br /> LudoX Is Strategy.
          </h1>
          <p className='text-base text-zinc-400 max-w-xl mx-auto text-center mt-6'>
            Play the AI-powered Ludo where every move matters.
            Powers, tactics, and real-time multiplayer — no two games are ever the same.
          </p>
        </div>
        
        <div className='flex items-center justify-center gap-6 mt-10'>
          <button className='bg-[#18181b] text-white font-bold uppercase tracking-wide px-4 py-1.5 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer'>
            Play Now
          </button>
          <button className='bg-transparent text-zinc-300 font-bold uppercase tracking-wide px-4 py-1.5 rounded-xl border-2 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer bg-black/50 backdrop-blur-sm'>
            Watch Gameplay
          </button>
        </div>
        
        <p className='text-zinc-600 text-sm font-semibold text-center mt-8 uppercase tracking-widest'>
          No downloads. Instant play. AI-powered matches.
        </p>
      </div>
     
    </div>
     <Problem />
     <Features />
     <WhyUs />
     <Comparison />
     <CTA />
     </div>
  )
}

export default Hero