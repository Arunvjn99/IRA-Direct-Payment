import { useState, useEffect, useCallback } from 'react'

const BG_IMAGE = 'https://vrivhbghtffppkezvkfg.supabase.co/storage/v1/object/public/Logo%20and%20images/background%20auth.png'

const SLIDES = [
  { image: 'https://vrivhbghtffppkezvkfg.supabase.co/storage/v1/object/public/Logo%20and%20images/Image%201.png', title: 'Secure IRA Contributions', subtitle: 'Make direct IRA contributions seamlessly and securely.', icon: '💰' },
  { image: 'https://vrivhbghtffppkezvkfg.supabase.co/storage/v1/object/public/Logo%20and%20images/Image%202.png', title: 'Track Your Progress', subtitle: 'Monitor contribution limits and balances in real time.', icon: '📊' },
  { image: 'https://vrivhbghtffppkezvkfg.supabase.co/storage/v1/object/public/Logo%20and%20images/Image%203.png', title: 'Plan for Retirement', subtitle: 'Build a smarter financial future with CORE.', icon: '🏦' },
]

function Carousel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const goTo = useCallback((idx: number) => {
    setFading(true)
    setTimeout(() => { setCurrent(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length); setFading(false) }, 180)
  }, [])

  useEffect(() => {
    const t = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(t)
  }, [current, goTo])

  const slide = SLIDES[current]

  return (
    <div className="flex flex-col items-center justify-center px-6 pb-10 gap-6 h-full">
      <div
        className="rounded-2xl border border-white/20 shadow-xl transition-opacity duration-200 flex items-center justify-center bg-white/5 overflow-hidden"
        style={{ width: '100%', maxWidth: 480, height: 380, opacity: fading ? 0 : 1 }}
      >
        {imgErrors[current] ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white/10">
            <span className="text-6xl">{slide.icon}</span>
          </div>
        ) : (
          <img
            key={current}
            src={slide.image}
            alt={slide.title}
            className="max-h-full max-w-full object-contain"
            onError={() => setImgErrors((p) => ({ ...p, [current]: true }))}
          />
        )}
      </div>

      <div className="text-center max-w-sm">
        <h2 className="text-xl font-bold text-white mb-2">{slide.title}</h2>
        <p className="text-white/70 text-sm">{slide.subtitle}</p>
      </div>

      <div className="flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative flex-col min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="relative z-10 flex-1 overflow-hidden">
          <Carousel />
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 overflow-y-auto min-h-screen">
        {children}
      </div>
    </div>
  )
}
