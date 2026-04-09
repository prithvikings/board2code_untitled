import React from 'react'
import Problem from './Problem'

const Navbar = () => {
  return (
    <div className='max-w-7xl w-full mx-auto p-4 font-chakra'>
      <div className='flex justify-between items-center'>
        <div className='logo'>
          <h1 className='text-3xl dark:text-zinc-100 text-zinc-900 font-nunito font-bold tracking-tight'>
            Ludo<span className='text-lime-400'>X</span>
          </h1>
        </div>
        <div className='text flex items-center gap-8 dark:text-zinc-100 text-zinc-900 font-medium'>
          <a href="#" className='hover:text-lime-400 transition-colors'>Privacy Policy</a>
          
          <button className='bg-[#18181b] text-white font-chakra uppercase tracking-wide px-4 py-1.5 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer'>
            Play Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar