import React from 'react'
import { Code, Sun } from 'lucide-react';

// This function returns a Navbar component
const Navbar = () => {
  // Return a JSX element
  return (
    <>
      <div className="nav flex items-center justify-between h-[70px] bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border-b border-purple-500/20 px-8">
        <div className="logo flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
            <Code size={24} color='#ffffff' />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Code Sensei
            </h1>
            <p className="text-xs text-gray-400 -mt-1">AI-Powered Code Review</p>
          </div>
        </div>
        <div className="icons flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-zinc-800 text-xs text-gray-300 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            AI Active
          </div>
          <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all duration-200">
            <Sun size={20} className="text-yellow-300" />
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar
// Refactored structure