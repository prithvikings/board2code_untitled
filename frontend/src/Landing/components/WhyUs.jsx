import React from 'react'

const WhyUs = () => {
  return (
    <div className='max-w-5xl mx-auto py-32 px-4 text-center'>
      
      {/* The Hook */}
      <h2 className='font-bebas text-6xl md:text-8xl text-white uppercase tracking-wide mb-12 leading-[0.9] drop-shadow-md'>
        This Isn’t Just Ludo.<br />
        <span className='text-[#a3e635]'>It’s a Mind Game.</span>
      </h2>

      {/* The Build-up */}
      <div className='flex flex-col gap-4 text-xl md:text-2xl text-zinc-400 font-medium mb-16'>
        <p>Every decision matters.</p>
        <p>Every move has consequences.</p>
        <p>Every match is unpredictable.</p>
      </div>

      {/* The Ultimatum */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left'>
        
        {/* Loser Card */}
        <div className='bg-[#18181b] p-8 rounded-2xl border-2 border-zinc-800 opacity-80 hover:opacity-100 transition-opacity'>
          <span className='text-zinc-500 font-bold tracking-widest text-sm uppercase mb-3 block'>
            Traditional
          </span>
          <p className='text-3xl font-bold text-zinc-300 leading-snug'>
            If you rely on luck, <br />
            <span className='text-red-500'>you lose.</span>
          </p>
        </div>

        {/* Winner Card */}
        <div className='bg-[#18181b] p-8 rounded-2xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] transform md:-translate-y-2'>
          <span className='text-[#a3e635] font-bold tracking-widest text-sm uppercase mb-3 block'>
            LudoX
          </span>
          <p className='text-3xl font-bold text-white leading-snug'>
            If you think ahead, <br />
            you dominate.
          </p>
        </div>

      </div>
    </div>
  )
}

export default WhyUs