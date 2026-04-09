import React from 'react'

const Features = () => {
  const features = [
    {
      title: "Color-Based Powers",
      description: "Every color isn’t just a token — it’s a playstyle.",
      visual: (
        <div className="flex gap-2 mb-6">
          <div className="flex-1 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          <div className="flex-1 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <div className="flex-1 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          <div className="flex-1 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
        </div>
      ),
      tags: ["🔴 Attack", "🔵 Defend", "🟢 Luck", "🟡 Speed"]
    },
    {
      title: "AI Power Engine",
      description: "You don’t choose powers. The game chooses for you. Balanced randomness ensures every match feels completely different.",
      visual: (
        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6">
          <div className="w-4 h-4 bg-[#a3e635] rounded-sm animate-pulse"></div>
        </div>
      ),
      tags: ["Context-Aware", "No Manual Selection"]
    },
    {
      title: "Multiplayer + AI Fallback",
      description: "No waiting. No excuses. Play with friends or randoms. AI fills empty slots instantly with bots that actually think, not dumb fillers.",
      visual: (
        <div className="flex items-center gap-1 mb-6">
          <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
          <div className="w-8 h-[1px] bg-zinc-700"></div>
          <div className="w-3 h-3 rounded-full bg-[#a3e635]"></div>
          <div className="w-8 h-[1px] bg-zinc-700"></div>
          <div className="w-3 h-3 rounded-full border border-zinc-500"></div>
        </div>
      ),
      tags: ["Instant Match", "Smart Bots"]
    },
    {
      title: "Strategic Gameplay",
      description: "Timing beats luck. Use your powers at the exact right moment — or lose.",
      visual: (
        <div className="w-full h-8 border-x-2 border-zinc-700 flex items-center justify-center mb-6 relative">
          <div className="absolute left-1/2 w-[1px] h-full bg-zinc-700"></div>
          <div className="w-2 h-8 bg-[#a3e635] absolute left-[70%]"></div>
        </div>
      ),
      tags: ["Timing Critical", "Zero Mercy"]
    }
  ]

  return (
    <div className='max-w-5xl mx-auto py-24 px-4 text-zinc-100'>
      <div className='text-center mb-16'>
        <span className='text-[#a3e635] font-bold tracking-widest text-sm uppercase mb-4 block'>
          Core Differentiation
        </span>
        <h2 className='font-bebas text-6xl md:text-7xl tracking-wide drop-shadow-md'>
          Not Your Basic Ludo
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {features.map((feature, index) => (
          <div 
            key={index} 
            className='bg-[#18181b] p-8 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 transition-all group'
          >
            {feature.visual}
            
            <h3 className='text-2xl font-bold text-white mb-3'>
              {feature.title}
            </h3>
            
            <p className='text-zinc-400 leading-relaxed mb-6'>
              {feature.description}
            </p>

            <div className='flex flex-wrap gap-2'>
              {feature.tags.map((tag, tagIndex) => (
                <span 
                  key={tagIndex} 
                  className='text-xs font-bold uppercase tracking-wider bg-zinc-900 text-zinc-300 px-3 py-1 rounded-md border border-zinc-800'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features