import { useEffect } from 'react'
import createPhotoJourney from './createPhotoJourney'

const clamp = value => Math.max(0, Math.min(1, value))
const ease = 'cubic-bezier(0.22, 0.7, 0.2, 1)'

export default function useHomeMotion(homeRef) {
  useEffect(() => {
    const home = homeRef.current
    if (!home || !Element.prototype.animate) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 981px) and (min-height: 600px)')
    const navbar = document.querySelector('.navbar-wrapper')
    const hero = home.querySelector('.stem-hero')
    const heroMedia = hero.querySelector('.stem-hero__media')
    const heroCopy = hero.querySelector('.stem-hero__copy')
    const environment = home.querySelector('.stem-environment')
    const environmentCamera = environment.querySelector('.stem-environment__camera')
    const visual = environment.querySelector('.stem-environment__visual')
    const title = environment.querySelector('.stem-environment__title')
    const description = environment.querySelector('.stem-environment__description')
    const action = environment.querySelector('.stem-environment__action')
    let tracks = []
    let frame = 0
    let headerHeight = 0
    let disposed = false
    let printing = false
    let journey = null
    let geometryDirty = true
    let previousFrameTime = 0
    let homeBounds = null

    const clear = () => {
      cancelAnimationFrame(frame)
      frame = 0
      tracks.forEach(({ animation }) => animation.cancel())
      tracks = []
      journey?.destroy()
      journey = null
      geometryDirty = true
      previousFrameTime = 0
      homeBounds = null
      delete home.dataset.homeMotion
      for (const name of ['--home-motion-top', '--home-motion-photo-height', '--home-atmosphere-y']) {
        home.style.removeProperty(name)
      }
    }
    const add = (element, keyframes, progress, easing = ease) => {
      const animation = element.animate(keyframes, { duration: 1000, fill: 'both', easing })
      animation.pause()
      animation.currentTime = 0
      const camera = element.classList.contains('stem-hero__camera') || element.classList.contains('stem-environment__camera')
      tracks.push({ element, animation, progress, camera, target: 0 })
    }
    const update = (timestamp) => {
      frame = 0
      if (disposed || !tracks.length) return
      const viewport = window.innerHeight
      const remeasure = geometryDirty
      if (geometryDirty) {
        homeBounds = home.getBoundingClientRect()
        tracks.forEach(track => { track.target = clamp(track.progress(viewport)) * 1000 })
        geometryDirty = false
      }
      const paintJourney = journey?.prepare(headerHeight, viewport, homeBounds, timestamp, remeasure)
      const elapsed = timestamp - previousFrameTime
      const dt = previousFrameTime && elapsed <= 80 ? elapsed : 1000 / 60
      previousFrameTime = timestamp
      let settling = false
      tracks.forEach(({ element, animation, camera, target }) => {
        if (element === environmentCamera && paintJourney?.cameraProgress !== undefined) {
          animation.currentTime = paintJourney.cameraProgress * 1000
          return
        }
        const difference = target - animation.currentTime
        if (Math.abs(difference) <= 0.1) return
        const next = camera && Math.abs(difference) < 650
          ? animation.currentTime + difference * (1 - Math.exp(-dt / 90)) : target
        animation.currentTime = Math.abs(target - next) < 0.2 ? target : next
        if (Math.abs(target - animation.currentTime) > 0.1) settling = true
      })
      paintJourney?.()
      if (paintJourney?.needsFrame || settling) queueFrame()
    }
    const queueFrame = () => {
      if (!frame && tracks.length && !document.hidden) frame = requestAnimationFrame(update)
    }
    const schedule = () => { geometryDirty = true; queueFrame() }
    const resize = () => {
      if (!tracks.length) return
      headerHeight = navbar?.getBoundingClientRect().height || 0
      const top = Math.ceil(headerHeight) + 20
      home.style.setProperty('--home-motion-top', `${top}px`)
      home.style.setProperty('--home-motion-photo-height', `${Math.max(300, window.innerHeight - top - 24)}px`)
      journey?.measure()
      schedule()
    }
    const setup = () => {
      clear()
      if (disposed || printing || reduced.matches) return
      const cinematic = desktop.matches
      home.dataset.homeMotion = cinematic ? 'cinematic' : 'compact'
      const enter = element => viewport => (viewport - element.getBoundingClientRect().top) / (viewport * (cinematic ? 0.36 : 0.22))
      const heroExit = () => (headerHeight - hero.getBoundingClientRect().top) / hero.getBoundingClientRect().height

      if (cinematic) {
        journey = createPhotoJourney(home)
        add(hero.querySelector('.stem-hero__camera'), [
          { transform: 'translate3d(0, 0, 0) scale(1)' },
          { transform: 'translate3d(-18px, -22px, 0) scale(1.12)' },
        ], () => heroMedia.classList.contains('stem-hero__media--product') ? 0 : heroExit(), 'linear')
        add(heroCopy, [
          { transform: 'translate3d(0, 0, 0)' },
          { transform: 'translate3d(-10px, -42px, 0)' },
        ], heroExit, 'linear')
      } else {
        add(hero.querySelector('.stem-hero__camera'), [
          { transform: 'translate3d(0, 0, 0) scale(1)' },
          { transform: 'translate3d(0, -8px, 0) scale(1.12)' },
        ], () => heroMedia.classList.contains('stem-hero__media--product') ? 0 :
          (headerHeight - heroMedia.getBoundingClientRect().top) / heroMedia.getBoundingClientRect().height, 'linear')
      }

      home.querySelectorAll('.stem-catalog__slot').forEach((slot, index) => {
        add(slot.firstElementChild, [
          { translate: `0 ${cinematic ? 54 : 22}px`, scale: cinematic ? '0.95' : '1', opacity: 0.3 },
          { translate: '0 0px', scale: '1', opacity: 1 },
        ], viewport => (viewport - slot.getBoundingClientRect().top - index * (cinematic ? 18 : 6)) / (viewport * (cinematic ? 0.28 : 0.18)))
      })

      add(environment.querySelector('.stem-environment__reveal'), cinematic ? [
        { clipPath: 'inset(9% 52% 9% 0)', transform: 'translate3d(-44px, 30px, 0) scale(0.94)', opacity: 0.35 },
        { clipPath: 'inset(0% 0% 0% 0)', transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
      ] : [
        { transform: 'translate3d(0, 24px, 0)', opacity: 0.4 },
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      ], enter(visual))
      if (cinematic) {
        add(environment.querySelector('.stem-environment__camera'), [
          { transform: 'translate3d(-10px, 12px, 0) scale(1.06)' },
          { transform: 'translate3d(16px, -24px, 0) scale(1.18)' },
        ], viewport => {
          const bounds = environment.getBoundingClientRect()
          return (viewport - bounds.top) / (viewport + bounds.height)
        }, 'linear')
      } else {
        add(environment.querySelector('.stem-environment__camera'), [
          { transform: 'translate3d(0, 8px, 0) scale(1.03)' },
          { transform: 'translate3d(0, -12px, 0) scale(1.12)' },
        ], viewport => (viewport - visual.getBoundingClientRect().top) / (viewport + visual.getBoundingClientRect().height), 'linear')
      }
      add(title.firstElementChild, [
        { transform: `translate3d(${cinematic ? 24 : 0}px, 52px, 0)`, opacity: 0 },
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      ], enter(title))
      add(description.firstElementChild, [
        { transform: 'translate3d(0, 26px, 0)', opacity: 0 },
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      ], enter(description))
      environment.querySelectorAll('.stem-environment__feature-slot').forEach((slot, index) => {
        add(slot.firstElementChild, [
          { transform: `translate3d(${cinematic ? 28 : 0}px, 30px, 0)`, opacity: 0 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ], viewport => (viewport - slot.getBoundingClientRect().top - index * 12) / (viewport * 0.24))
      })
      add(action.firstElementChild, [
        { translate: '0 20px', opacity: 0.45 },
        { translate: '0 0px', opacity: 1 },
      ], enter(action))
      resize()
    }
    const beforePrint = () => { printing = true; clear() }
    const afterPrint = () => { printing = false; setup() }
    setup()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)
    document.addEventListener('visibilitychange', schedule)
    reduced.addEventListener('change', setup)
    desktop.addEventListener('change', setup)
    const observer = new ResizeObserver(resize)
    if (navbar) observer.observe(navbar)
    observer.observe(heroCopy)
    observer.observe(environment.querySelector('.stem-environment__copy'))
    const slideObserver = new MutationObserver(schedule)
    slideObserver.observe(heroMedia, { attributes: true, attributeFilter: ['class'] })

    return () => {
      disposed = true
      clear()
      observer.disconnect()
      slideObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', resize)
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', afterPrint)
      document.removeEventListener('visibilitychange', schedule)
      reduced.removeEventListener('change', setup)
      desktop.removeEventListener('change', setup)
    }
  }, [homeRef])
}
