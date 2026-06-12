'use client'

import { useState } from 'react'
import type { ContactFormData } from '@/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

const BUDGET_OPTIONS = ['Under $5k', '$5k–$15k', '$15k–$50k', '$50k+']

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState<ContactFormData>({
    name: '', company: '', building: '', budget: '', source: '',
  })

  const set = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Message received</div>
        <h2 className="font-headline font-bold text-3xl tracking-tight text-[#12120f] mb-3">We&apos;ll be in touch.</h2>
        <p className="text-[#888] text-sm">Usually within 24 hours.</p>
      </div>
    )
  }

  const inputCls = 'w-full bg-white border border-[#E2E2DF] text-[#12120f] font-body text-[14px] px-4 py-3.5 rounded-[2px] focus:outline-none focus:border-orange transition-colors placeholder:text-[#bbb]'
  const labelCls = 'font-mono text-[9px] tracking-[2px] text-[#aaa] uppercase mb-2 block'

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Name *</label>
          <input required value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input value={form.company} onChange={set('company')} placeholder="Company or project" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>What are you building? *</label>
        <textarea required value={form.building} onChange={set('building')} placeholder="Tell us about your idea, project, or challenge..." rows={5} className={`${inputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Budget Range</label>
          <select value={form.budget} onChange={set('budget')} className={inputCls}>
            <option value="">Select budget</option>
            {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>How did you hear about us?</label>
          <input value={form.source} onChange={set('source')} placeholder="Referral, social, search..." className={inputCls} />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-[13px] text-red-400">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-orange text-white font-mono font-bold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded-[2px] hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  )
}
