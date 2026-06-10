// src/lib/animations.ts
// All functions must be called inside useEffect (client-side only)
// GSAP and ScrollTrigger are imported lazily to avoid SSR issues

export async function loadGSAP() {
  const { default: gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger }
}

/** Fade + translateY reveal on scroll enter */
export async function scrollReveal(
  targets: string | Element | NodeListOf<Element> | Element[],
  options: {
    y?: number
    delay?: number
    stagger?: number
    duration?: number
  } = {}
) {
  const { gsap, ScrollTrigger } = await loadGSAP()
  const { y = 40, delay = 0, stagger = 0, duration = 0.8 } = options

  const trigger = typeof targets === 'string'
    ? document.querySelector(targets)
    : targets instanceof NodeList
    ? targets[0]
    : Array.isArray(targets)
    ? targets[0]
    : targets

  gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger as Element,
        start: 'top 85%',
        once: true,
      },
    }
  )
}

/** Slide in from X on scroll enter */
export async function scrollSlideIn(
  target: Element,
  direction: 'left' | 'right',
  options: { duration?: number; delay?: number } = {}
) {
  const { gsap, ScrollTrigger } = await loadGSAP()
  const { duration = 0.9, delay = 0 } = options
  const x = direction === 'left' ? -60 : 60

  gsap.fromTo(
    target,
    { opacity: 0, x },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: target,
        start: 'top 85%',
        once: true,
      },
    }
  )
}

/** Word-by-word color reveal — container must have children with data-word attribute */
export async function wordReveal(containerEl: Element) {
  const { gsap } = await loadGSAP()
  const words = containerEl.querySelectorAll<HTMLElement>('[data-word]')

  gsap.fromTo(
    words,
    { color: '#333' },
    {
      color: '#fffefd',
      stagger: 0.06,
      duration: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: containerEl,
        start: 'top 70%',
        once: true,
      },
    }
  )
}

/** Number count-up animation — call inside IntersectionObserver or scrollTrigger */
export async function countUp(
  el: HTMLElement,
  target: number,
  duration = 1.6
) {
  const { gsap } = await loadGSAP()
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.floor(obj.val).toString()
    },
    onComplete: () => {
      el.textContent = target.toString()
    },
  })
}

/** Animate an element's scaleX from 0→1 (left-to-right line draw) */
export async function drawLine(
  el: Element,
  options: { delay?: number; duration?: number } = {}
) {
  const { gsap } = await loadGSAP()
  const { delay = 0, duration = 0.8 } = options

  gsap.fromTo(
    el,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el as Element,
        start: 'top 85%',
        once: true,
      },
    }
  )
}
