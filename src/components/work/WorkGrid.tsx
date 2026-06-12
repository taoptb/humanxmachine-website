'use client'

import { useState } from 'react'
import { WorkCard } from './WorkCard'
import type { WorkProject } from '@/types'

const FILTERS = ['All', 'Original IP', 'Creative Production', 'Business Creation', 'Video']

interface WorkGridProps {
  projects: WorkProject[]
}

export function WorkGrid({ projects }: WorkGridProps) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : active === 'Video'
    ? projects.filter((p) => p.isVideo)
    : projects.filter((p) => p.pillar === active || p.category.includes(active))

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`font-mono text-[9px] tracking-[2px] uppercase px-[14px] py-[7px] rounded-[2px] transition-colors ${
              active === f
                ? 'bg-orange text-white'
                : 'border border-dark-border text-[#555] hover:border-[#555] hover:text-[#aaa]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-3">
        {filtered.map((project, i) => {
          if (i === 0) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-7" imageHeight={520} />
          )
          if (i === 1) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-5" imageHeight={520} />
          )
          if (i === 2) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-7" imageHeight={280} />
          )
          if (i === 3) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-5" imageHeight={280} />
          )
          return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-4" imageHeight={240} />
          )
        })}

        {/* Coming soon card */}
        <div className="col-span-12 md:col-span-4 bg-[#111110] border border-[#1f1f1c] rounded flex flex-col items-center justify-center gap-3 min-h-[240px]">
          <div className="opacity-10 text-orange font-mono text-4xl">×</div>
          <span className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">Next Project</span>
          <span className="font-mono text-[8px] tracking-[1px] text-[#222] uppercase">In production</span>
        </div>
      </div>

      <p className="mt-6 font-mono text-[10px] tracking-[2px] text-[#444]">
        Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
