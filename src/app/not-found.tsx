import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PixelIcon } from '@/components/ui/PixelIcon'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">

      <div className="opacity-20 mb-10">
        <PixelIcon name="x" size={16} />
      </div>

      <p className="font-mono text-[9px] tracking-[4px] text-orange uppercase mb-6">
        404 — Not Found
      </p>

      <h1
        className="font-headline font-bold text-white leading-none tracking-tightest mb-6"
        style={{
          fontSize: 'clamp(80px, 18vw, 200px)',
          color: '#1a1a17',
          WebkitTextStroke: '1px #2a2a27',
        }}
      >
        404
      </h1>

      <h2 className="font-headline font-bold text-white text-2xl tracking-tight mb-4">
        This page doesn&apos;t exist.
      </h2>
      <p className="text-[14px] text-[#444] mb-10 max-w-sm">
        The link might be broken, or the page may have moved.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="primary" href="/">
          Back to Home
        </Button>
        <Button variant="ghost" href="/work">
          See Our Work
        </Button>
      </div>

    </main>
  )
}
