import React from 'react'

const Problem = () => {
  return (
    <div className='text-zinc-100 max-w-5xl mx-auto py-24 px-4'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
        <div className='flex-1'>
          <h2 className='font-bebas text-6xl md:text-7xl leading-[0.9] tracking-wide drop-shadow-md'>
            Traditional <br />
            <span className='text-[#a3e635]'>Ludo </span>
            is Broken.
          </h2>
        </div>
        
        <div className='flex-1'>
          <div className='bg-[#18181b] p-8 rounded-2xl border-2 border-zinc-800 shadow-[8px_8px_0px_0px_#27272a] relative'>
            <div className='absolute -top-4 -left-4 bg-[#a3e635] text-zinc-900 font-nunito font-bold px-4 py-1 rounded-md transform -rotate-3 border-2 border-[#18181b] tracking-wider text-sm'>
              THE PROBLEM
            </div>
            <p className='text-xl text-zinc-100 font-poppins leading-relaxed mt-2'>
              Rolling dice and hoping for luck? That’s not strategy — that’s boredom.
            </p>
            <div className='w-full h-[1px] bg-zinc-800 my-4'></div>
            <p className='text-base text-zinc-500 font-chakra'>
              LudoX transforms the game into a skill-based battle using AI-powered abilities and smart gameplay mechanics.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Problem