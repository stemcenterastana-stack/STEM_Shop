const clamp = value => Math.max(0, Math.min(1, value))
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t) }
const mix = (from, to, t) => from + (to - from) * t
const interpolate = (from, to, t) => from.map((value, index) => mix(value, to[index], t))

export default function createPhotoJourney(home) {
  const layer = home.querySelector('.stem-photo-journey')
  const source = home.querySelector('.stem-hero__media')
  const sourceCopy = home.querySelector('.stem-hero__copy')
  const environment = home.querySelector('.stem-environment')
  const copy = environment.querySelector('.stem-environment__copy')
  const destination = environment.querySelector('.stem-environment__media')
  const images = layer.querySelectorAll('img')
  const viewports = layer.querySelectorAll('.stem-photo-journey__viewport')
  const startFrame = layer.querySelector('.stem-photo-journey__frame--start')
  const endFrame = layer.querySelector('.stem-photo-journey__frame--end')
  let eligible = null
  let wasVisible = false
  let progress = null
  let previousTime = 0
  let sourceSize
  let insets
  let rowPadding = 0
  let geometry = null

  const measure = () => {
    const bounds = source.getBoundingClientRect()
    const homeBounds = home.getBoundingClientRect()
    sourceSize = [bounds.left - homeBounds.left, bounds.width, bounds.height]
    rowPadding = parseFloat(getComputedStyle(environment).paddingTop)
    const padding = getComputedStyle(destination)
    insets = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].map(side => parseFloat(padding[side]))
    geometry = null
  }
  const reset = () => {
    layer.style.visibility = 'hidden'
    source.style.removeProperty('opacity')
    sourceCopy.style.removeProperty('opacity')
    destination.style.removeProperty('opacity')
    copy.style.removeProperty('opacity')
    copy.style.removeProperty('translate')
    delete home.dataset.photoJourney
    wasVisible = false
  }
  measure()

  return {
    measure,
    // Only geometry reads here. The returned paint writes transforms, not layout sizes.
    prepare(headerHeight, height, homeBounds, timestamp, geometryChanged = true) {
      if (geometryChanged || !geometry) {
        const rowBounds = environment.getBoundingClientRect()
        geometry = {
          rowBounds,
          target: destination.getBoundingClientRect(),
          distance: Math.max(1, rowBounds.top - homeBounds.top + rowPadding - 20),
        }
      }
      const { rowBounds, target, distance } = geometry
      const offset = headerHeight - homeBounds.top
      const next = clamp(offset / distance)
      const elapsed = timestamp - previousTime
      // An idle interval is not a long animation frame: resume at the normal cadence.
      const dt = previousTime && elapsed <= 80 ? elapsed : 1000 / 60
      previousTime = timestamp
      // A short time-based settle smooths wheel steps without replacing native scrolling.
      // Only skip the journey for navigation well beyond it, never for a large wheel step inside it.
      if (progress === null || offset < 0 || offset > distance + height * 0.5) progress = next
      else progress = mix(progress, next, 1 - Math.exp(-dt / 140))
      if (Math.abs(next - progress) < 0.0004) progress = next
      const photoSelected = !source.classList.contains('stem-hero__media--product')
      if (next < 0.003 && progress < 0.006) eligible = null
      if (eligible === null && next >= 0.003) eligible = photoSelected
      if (!photoSelected && document.activeElement?.closest('.stem-hero__controls')) eligible = false
      if (!eligible || progress <= 0 || progress >= 1) return () => { if (wasVisible) reset() }

      const open = smooth(progress / 0.36)
      // Overlap the approach and arrival. Ending arrival at 70% caused a visible hold.
      const arrive = smooth((progress - 0.26) / 0.74)
      const start = [homeBounds.left + sourceSize[0], headerHeight, sourceSize[1], sourceSize[2]]
      const wide = [homeBounds.left + 18, headerHeight + 8, homeBounds.width - 36, Math.min(740, height - headerHeight - 16)]
      // Keep the room at the reading line while its real section catches up below.
      const end = [target.left, Math.min(Math.ceil(headerHeight) + 20, target.top), target.width, target.height]
      const box = interpolate(interpolate(start, wide, open), end, arrive)
      const easedRowTop = rowBounds.top + offset - progress * distance
      const easedRowProgress = clamp((height - easedRowTop) / (height + rowBounds.height))
      const liveRowProgress = clamp((height - rowBounds.top) / (height + rowBounds.height))
      const rowProgress = mix(easedRowProgress, liveRowProgress, smooth((progress - 0.9) / 0.1))
      const zoom = mix(mix(1, 1.48, open), mix(1.06, 1.18, rowProgress), arrive)
      const panX = mix(mix(0, -24, open), mix(-10, 16, rowProgress), arrive)
      const panY = mix(mix(0, -18, open), mix(12, -24, rowProgress), arrive)
      const [top, right, bottom, left] = insets.map(value => value * arrive)
      const width = box[2] - left - right
      const imageHeight = box[3] - top - bottom
      const cover = Math.max(width / 1536, imageHeight / 1024)
      const sx = box[2] / 1000
      const sy = box[3] / 1000
      const ix = left + width * (1 - zoom) / 2 + (width - 1536 * cover) * mix(0.58, 0.43, arrive) * zoom + panX
      const iy = top + imageHeight * (1 - zoom) / 2 + (imageHeight - 1024 * cover) / 2 * zoom + panY
      const copyReveal = smooth((progress - 0.84) / 0.14)
      const paint = () => {
        if (!wasVisible) {
          home.dataset.photoJourney = 'active'
          layer.style.visibility = 'visible'
          wasVisible = true
        }
        source.style.opacity = String(1 - smooth(progress / 0.045))
        sourceCopy.style.opacity = String(1 - smooth(progress / 0.24))
        // Reveal the real frame over the matching decorative pixels before releasing it.
        destination.style.opacity = String(smooth((progress - 0.985) / 0.015))
        copy.style.opacity = String(copyReveal)
        copy.style.translate = `${28 * (1 - copyReveal)}px 0`
        layer.style.transform = `translate3d(${box[0] - homeBounds.left}px, ${box[1] - homeBounds.top}px, 0) scale(${sx}, ${sy})`
        // Counter-scale the original-resolution image to keep its proportions exact.
        const imageTransform = `translate3d(${ix / sx}px, ${iy / sy}px, 0) scale(${cover * zoom / sx}, ${cover * zoom / sy})`
        const imageClip = `inset(${top / sy}px ${right / sx}px ${bottom / sy}px ${left / sx}px round 0 ${70 * arrive / sx}px ${110 * arrive / sx}px ${70 * arrive / sx}px / 0 ${70 * arrive / sy}px ${110 * arrive / sy}px ${70 * arrive / sy}px)`
        images.forEach(image => { image.style.transform = imageTransform })
        viewports.forEach(viewport => { viewport.style.clipPath = imageClip })
        startFrame.style.opacity = String(1 - smooth((progress - 0.48) / 0.24))
        endFrame.style.opacity = String(smooth((progress - 0.04) / 0.2))
      }
      // The destination camera uses the same progress, avoiding a crop jump at handoff.
      paint.cameraProgress = rowProgress
      paint.needsFrame = Math.abs(next - progress) >= 0.0004
      return paint
    },
    destroy() { reset(); layer.removeAttribute('style') },
  }
}
