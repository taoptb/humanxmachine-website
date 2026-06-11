// src/app/courses/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { getCourses } from '@/lib/notion'
import type { Course } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Courses — HumanxMachine',
  description: 'Learn the systems we use every day — brand building, content production, and AI workflows.',
  openGraph: { title: 'Courses — HumanxMachine', description: 'Learn brand, content, and AI systems.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        {course.thumbnailUrl ? (
          <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-dark-border flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[2px] text-[#333] uppercase">Course</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="font-mono text-[9px] tracking-[2px] text-orange uppercase mb-2">{course.category}</p>
        <h3 className="font-headline font-bold text-white text-lg tracking-tight mb-3">{course.title}</h3>
        <p className="text-[13px] text-[#555] leading-relaxed mb-5">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-headline font-bold text-white text-lg">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
          <a
            href={course.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange text-white font-mono text-[10px] tracking-[1.5px] uppercase px-5 py-2.5 rounded-[2px] hover:opacity-85 transition-opacity"
          >
            Enroll →
          </a>
        </div>
      </div>
    </div>
  )
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Learn</p>
        <h1 className="font-headline font-bold tracking-tightest text-white mb-3 leading-none" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
          Courses
        </h1>
        <p className="text-[14px] text-[#444] mb-12 max-w-xl">
          Build brands, produce content, and launch businesses — learn the systems we use every day.
        </p>

        {courses.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">Coming Soon</p>
            <p className="text-[#555] mt-3 text-sm">Our first courses are in production.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
