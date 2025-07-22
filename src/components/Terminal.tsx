'use client'

export default function Terminal({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-green-500 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="terminal-border rounded-lg p-6 bg-gray-950">
          {children}
        </div>
      </div>
    </div>
  )
}