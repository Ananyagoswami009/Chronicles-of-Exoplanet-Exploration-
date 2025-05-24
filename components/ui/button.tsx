// components/ui/button.tsx
import React from 'react'

export function Button({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-white-500 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-200"
    >
      {children}
    </button>
  )
}
