import { useEffect } from 'react'

const clamp = value => Math.min(1, Math.max(0, value))

/** A local scroll timeline. Native scrolling and all application state stay untouched. */
export default function usePackageMotion(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !Element.prototype.animate) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 981px) and (min-height: 600px)')
    const navbar = document.querySelector('.navbar-wrapper')
    const scenes = [...section.querySelectorAll('.stem-package')]
    let tracks = []
    let frame = 0
    let disposed = false
    let printing = false

    const clear = () => {
      cancelAnimationFrame(frame)
      frame = 0
      tracks.forEach(({ animation }) => animation.cancel())
      tracks = []
      delete section.dataset.motion
      section.style.removeProperty('--package-motion-top')
      section.style.removeProperty('--package-motion-photo-height')
    }

    const addTrack = (element, keyframes, progress, easing = 'linear') => {
      const animation = element.animate(keyframes, { duration: 1000, fill: 'both', easing })
      animation.pause()
      animation.currentTime = 0
      tracks.push({ animation, progress })
    }

    const update = () => {
      frame = 0
      if (disposed || !tracks.length) return
      const viewport = window.innerHeight
      // Complete all layout reads before updating compositor animations.
      const times = tracks.map(({ progress }) => clamp(progress(viewport)) * 1000)
      tracks.forEach(({ animation }, index) => {
        if (Math.abs(animation.currentTime - times[index]) > 0.1) animation.currentTime = times[index]
      })
    }

    const schedule = () => {
      if (!frame && tracks.length && !document.hidden) frame = requestAnimationFrame(update)
    }

    const updateViewport = () => {
      if (!tracks.length) return
      const top = Math.ceil(navbar?.getBoundingClientRect().height || 0) + 20
      section.style.setProperty('--package-motion-top', `${top}px`)
      section.style.setProperty('--package-motion-photo-height', `${Math.max(320, window.innerHeight - top - 24)}px`)
      schedule()
    }

    const setup = () => {
      clear()
      if (disposed || printing || reducedMotion.matches) return
      const cinematic = desktop.matches
      section.dataset.motion = cinematic ? 'cinematic' : 'compact'

      scenes.forEach((scene, sceneIndex) => {
        const direction = sceneIndex === 1 ? 1 : -1
        const visual = scene.querySelector('.stem-package__visual')
        const reveal = scene.querySelector('.stem-package__reveal')
        const camera = scene.querySelector('.stem-package__camera')
        const title = scene.querySelector('.stem-package__title')
        const description = scene.querySelector('.stem-package__description')
        const slots = [...scene.querySelectorAll('.stem-package__feature-slot')]
        const entrance = element => viewport => (viewport - element.getBoundingClientRect().top) / (viewport * (cinematic ? 0.38 : 0.22))

        addTrack(reveal, cinematic ? [
          { clipPath: direction < 0 ? 'inset(0 92% 0 0)' : 'inset(0 0 0 92%)', transform: `translate3d(${direction * 54}px, 0, 0)`, opacity: 0.25 },
          { clipPath: 'inset(0 0% 0 0%)', transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ] : [
          { transform: 'translate3d(0, 26px, 0)', opacity: 0.35 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ], entrance(visual), 'cubic-bezier(0.22, 0.7, 0.2, 1)')

        if (cinematic) {
          // The mask remains fixed; the original photograph moves inside it.
          addTrack(camera, [
            { transform: 'translate3d(0, 12px, 0) scale(1.06)' },
            { transform: 'translate3d(0, -24px, 0) scale(1.18)' },
          ], viewport => {
            const bounds = scene.getBoundingClientRect()
            return (viewport - bounds.top) / (viewport + bounds.height)
          })
        }

        addTrack(title.firstElementChild, [
          { transform: `translate3d(0, ${cinematic ? 68 : 26}px, 0)`, opacity: 0 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ], entrance(title), 'cubic-bezier(0.22, 0.7, 0.2, 1)')

        addTrack(description.firstElementChild, [
          { transform: 'translate3d(0, 26px, 0)', opacity: 0 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ], entrance(description), 'cubic-bezier(0.22, 0.7, 0.2, 1)')

        slots.forEach((slot, index) => {
          const visualOrder = cinematic ? (index % 3) * 2 + Math.floor(index / 3) : index
          addTrack(slot.firstElementChild, [
            { transform: `translate3d(${cinematic ? direction * 24 : 0}px, ${cinematic ? 46 : 20}px, 0)`, opacity: 0 },
            { transform: 'translate3d(0, 0, 0)', opacity: 1 },
          ], viewport => (viewport - slot.getBoundingClientRect().top - (cinematic ? visualOrder * 12 : 0)) / (viewport * (cinematic ? 0.29 : 0.16)), 'cubic-bezier(0.22, 0.7, 0.2, 1)')
        })
      })

      if (cinematic) {
        addTrack(section, [
          { backgroundColor: '#f7f9f7' },
          { backgroundColor: '#edf4ef' },
        ], viewport => (viewport - scenes[2].getBoundingClientRect().top) / (viewport * 0.8))
      }

      updateViewport()
    }

    const beforePrint = () => { printing = true; clear() }
    const afterPrint = () => { printing = false; setup() }
    setup()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', updateViewport, { passive: true })
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)
    document.addEventListener('visibilitychange', schedule)
    reducedMotion.addEventListener('change', setup)
    desktop.addEventListener('change', setup)
    const observer = new ResizeObserver(updateViewport)
    if (navbar) observer.observe(navbar)
    scenes.forEach(scene => observer.observe(scene.querySelector('.stem-package__content')))

    return () => {
      disposed = true
      clear()
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', afterPrint)
      document.removeEventListener('visibilitychange', schedule)
      reducedMotion.removeEventListener('change', setup)
      desktop.removeEventListener('change', setup)
    }
  }, [sectionRef])
}
