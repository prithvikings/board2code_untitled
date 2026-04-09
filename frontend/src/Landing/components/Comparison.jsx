import React from 'react'

const Comparison = () => {
  const rows = [
    { 
      feature: "Gameplay", 
      traditional: "Luck-based", 
      ludox: "Strategy + AI",
      highlight: false
    },
    { 
      feature: "Powers", 
      traditional: "❌ None", 
      ludox: "✅ Dynamic",
      highlight: false
    },
    { 
      feature: "Multiplayer", 
      traditional: "Basic", 
      ludox: "Smart + AI fallback",
      highlight: false
    },
    { 
      feature: "Replay Value", 
      traditional: "Low", 
      ludox: "Extremely High",
      highlight: true
    },
  ]

  return (
    <div className='max-w-5xl mx-auto py-24 px-4'>
      <div className='text-center mb-16'>
        <span className='text-[#a3e635] font-bold tracking-widest text-sm uppercase mb-4 block'>
          The Verdict
        </span>
        <h2 className='font-bebas text-6xl md:text-7xl text-white tracking-wide drop-shadow-md'>
          By The Numbers
        </h2>
      </div>

      <div className='bg-[#18181b] rounded-2xl border-2 border-zinc-800 overflow-hidden shadow-2xl relative'>
        
        {/* LudoX Column Highlight Background */}
        <div className='absolute top-0 right-0 w-1/3 h-full bg-[#a3e635]/5 pointer-events-none'></div>

        {/* Header */}
        <div className='grid grid-cols-3 bg-zinc-900 p-6 border-b-2 border-zinc-800 relative z-10'>
          <div className='font-bold text-zinc-500 uppercase tracking-widest text-xs md:text-sm'>Feature</div>
          <div className='font-bold text-zinc-500 uppercase tracking-widest text-xs md:text-sm text-center'>Traditional Ludo</div>
          <div className='font-bold text-[#a3e635] uppercase tracking-widest text-xs md:text-sm text-center'>LudoX</div>
        </div>

        {/* Rows */}
        <div className='relative z-10'>
          {rows.map((row, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-3 p-6 items-center transition-colors hover:bg-zinc-800/30 ${
                index !== rows.length - 1 ? 'border-b border-zinc-800/50' : ''
              }`}
            >
              <div className='font-medium text-white text-base md:text-lg'>{row.feature}</div>
              <div className='text-zinc-500 text-center font-medium text-sm md:text-base'>{row.traditional}</div>
              <div className={`text-center font-bold text-sm md:text-base ${row.highlight ? 'text-white' : 'text-[#a3e635]'}`}>
                {row.ludox}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Comparison