'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { WorkProject } from '@/types'

interface WorkCardProps {
  project: WorkProject
  index: number
  className?: string
  imageHeight?: number
}

export function WorkCard({ project, index, className = '', imageHeight = 300 }: WorkCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group relative bg-dark-surface rounded overflow-hidden block ${className}`}
    >
      <div className="relative overflow-hidden" style={{ height: imageHeight }}>
        {project.isVideo ? (
          <div className="w-full h-full bg-[#1a1a17] flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-lg group-hover:border-orange group-hover:text-orange transition-colors duration-300">
              ▶
            </div>
            <span className="font-mono text-[8px] tracking-[3px] text-[#333] uppercase">Video · Motion</span>
          </div>
        ) : project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-dark-border" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange rounded-[2px] flex items-center justify-center text-white text-sm font-bold opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
          ↗
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <p className="font-mono text-[8px] tracking-[2.5px] text-orange uppercase mb-2">{project.category}</p>
        <h3 className="font-headline font-bold text-white tracking-tight leading-tight" style={{ fontSize: 'clamp(15px, 1.5vw, 20px)' }}>
          {project.title}
        </h3>
        {project.description && (
          <p className="text-[12px] text-[#888] leading-[1.55] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-xs">
            {project.description}
          </p>
        )}
      </div>

      <div className="absolute top-4 left-4 font-mono text-[9px] text-white/25 z-10">
        {String(index + 1).padStart(2, '0')}
      </div>
    </Link>
  )
}
