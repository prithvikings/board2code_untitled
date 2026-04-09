import React from 'react'

const CTA = () => {
  return (
    <div className='max-w-4xl mx-auto py-32 px-4'>
      <div className='bg-[#a3e635] rounded-3xl p-10 md:p-16 text-center border-4 border-[#18181b] shadow-[12px_12px_0px_0px_#27272a] relative overflow-hidden'>
        
        {/* Abstract background elements to maintain depth */}
        <div className='absolute -top-24 -right-24 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none'></div>
        <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none'></div>

        <div className='relative z-10'>
          <h2 className='font-bebas text-6xl md:text-8xl text-[#18181b] tracking-wide leading-[0.9] mb-6 drop-shadow-sm'>
            Stop Rolling.<br />Start Thinking.
          </h2>
          
          <p className='text-zinc-800 text-lg md:text-xl font-bold max-w-xl mx-auto mb-10'>
            The board is set. The AI is waiting. Are you going to rely on luck, or are you going to dominate?
          </p>
          
          <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
            <button className='w-full sm:w-auto bg-[#18181b] text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl border-2 border-[#18181b] shadow-[0px_6px_0px_0px_#27272a] hover:bg-[#27272a] hover:shadow-[0px_4px_0px_0px_#27272a] hover:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#27272a] active:translate-y-[6px] transition-all cursor-pointer text-xl'>
              Play Now — Free
            </button>
          </div>
          
          <p className='text-zinc-700 text-xs font-black uppercase tracking-widest mt-8'>
            No downloads • Matchmaking is live
          </p>
        </div>
      </div>
    </div>
  )
}

export default CTA