import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { homeContent } from '../i18n/homeContent'
import './HeroSlider.css'

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [interacting, setInteracting] = useState(false)
  const [focused, setFocused] = useState(false)
  const { lang, t } = useLang()
  const copy = homeContent[lang]
  const slides = [
    { title: copy.heroTitle, subtitle: copy.heroDescription, button: copy.catalogButton, path: '/#catalog', image: '/img/home/stem-classroom.png', photo: true },
    { title: t.slider_1_title, subtitle: t.slider_1_subtitle, button: t.slider_1_btn, path: '/secondpage', image: '/img/pagefirst/room.png' },
    { title: t.slider_2_title, subtitle: t.slider_2_subtitle, button: t.slider_2_btn, path: '/equipment', image: '/img/equipment/arduino.png' },
    { title: t.slider_3_title, subtitle: t.slider_3_subtitle, button: t.slider_3_btn, path: '/#packages', image: '/img/pagefirst/plant.png' },
    { title: t.slider_4_title, subtitle: t.slider_4_subtitle, button: t.slider_4_btn, path: '/electro', image: '/img/pagethird/computers/item2.png' },
  ]
  const slide = slides[current]
  const total = slides.length
  useEffect(() => {
    if (paused || interacting || focused) return
    const timer = setInterval(() => setCurrent(value => (value + 1) % total), 5000)
    return () => clearInterval(timer)
  }, [paused, interacting, focused, total])
  const move = (offset) => setCurrent(value => (value + offset + slides.length) % slides.length)

  return (
    <section className="stem-hero" aria-roledescription={copy.carousel} aria-label={copy.heroLabel}
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}>
      <div className={`stem-hero__media${slide.photo ? '' : ' stem-hero__media--product'}`}>
        <div className="stem-hero__camera">
          <div className="stem-hero__scene" key={slide.image}>
            <img src={slide.image} alt={slide.photo ? copy.roomAlt : slide.title} width="1536" height="1024" fetchPriority="high" />
          </div>
        </div>
      </div>
      <div className="stem-hero__inner">
        <div className="stem-hero__copy">
          <p className="stem-eyebrow">{copy.heroEyebrow}</p>
          <div className="stem-hero__slide" aria-live={paused || interacting || focused ? 'polite' : 'off'} aria-atomic="true">
            <h1 className="stem-hero__title">
              <span className="stem-hero__title-content" key={`${current}-${lang}`}>
                {current === 0 ? <><span>STEM</span>{copy.heroTitleAfterStem}<br />{copy.heroTitleSecondLine}</> : slide.title}
              </span>
            </h1>
            <p className="stem-hero__description"><span key={`${current}-${lang}`}>{slide.subtitle}</span></p>
            <Link to={slide.path} className="stem-button">{slide.button}<ArrowRight size={19} aria-hidden="true" /></Link>
          </div>
          <div className="stem-hero__controls">
            <div className="stem-hero__dots" role="group" aria-label={copy.chooseSlide}>
              {slides.map((item, index) => (
                <button key={item.path} type="button" className="stem-hero__dot" aria-label={`${index + 1}. ${item.title}`} aria-pressed={index === current} onClick={() => setCurrent(index)} />
              ))}
            </div>
            <div className="stem-hero__arrows">
              <button type="button" aria-label={paused ? copy.playSlides : copy.pauseSlides} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>
              <button type="button" aria-label={copy.previousSlide} onClick={() => move(-1)}><ChevronLeft size={18} aria-hidden="true" /></button>
              <button type="button" aria-label={copy.nextSlide} onClick={() => move(1)}><ChevronRight size={18} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
