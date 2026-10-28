import { Link, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import './FirstPage.css'
import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import HomeEnvironment from '../components/HomeEnvironment'
import HomePackages from '../components/HomePackages'
import useHomeMotion from '../components/useHomeMotion'
import HomePhotoJourney from '../components/HomePhotoJourney'
import '../components/HomeMotion.css'
import { useLang } from '../i18n/LanguageContext'
import Icon from '../components/Icons'

const ADVANTAGES = [
  { icon: 'Factory', key: 'adv_1' },
  { icon: 'CheckCircle', key: 'adv_2' },
  { icon: 'Package', key: 'adv_3' },
  { icon: 'Truck', key: 'adv_4' },
  { icon: 'Shield', key: 'adv_5' },
  { icon: 'Wrench', key: 'adv_6' },
]

const BLOG_POSTS = [
  {
    id: 1,
    date: '12 мая 2025',
    title: 'Как оснастить STEM-лабораторию под ключ',
    excerpt: 'Рассказываем о комплексном подходе к оснащению учебных лабораторий: от дизайн-проекта до выбора оборудования.',
    img: '/img/pagefirst/room.png',
    path: '/blog',
  },
  {
    id: 2,
    date: '3 мая 2025',
    title: 'Интерактивные панели в образовании: обзор 2025',
    excerpt: 'Сравниваем актуальные модели интерактивных панелей для школ и вузов. Что выбрать в 2025 году?',
    img: '/img/pagethird/comp.png',
    path: '/blog',
  },
  {
    id: 3,
    date: '25 апреля 2025',
    title: 'Мебель для учебных классов: тренды и стандарты',
    excerpt: 'Разбираем современные тенденции в дизайне учебного пространства и требования к мебели для образовательных учреждений.',
    img: '/img/pagesecond/bb20aa.png',
    path: '/blog',
  },
]

const INSTRUCTIONS = [
  { icon: 'ClipboardList', title: 'Руководство по выбору мебели', desc: 'Как подобрать мебель под конкретный учебный кабинет', path: '/instructions' },
  { icon: 'Monitor', title: 'Подключение интерактивных панелей', desc: 'Пошаговая инструкция по установке и настройке', path: '/instructions' },
  { icon: 'FlaskConical', title: 'Оснащение лабораторий', desc: 'Комплектация STEM-лабораторий — с чего начать', path: '/instructions' },
]

export default function FirstPage() {
  const { t } = useLang()
  const packagesRef = useRef(null)
  const homeRef = useRef(null)
  useHomeMotion(homeRef)

  const location = useLocation()

  // A plain homepage visit always starts with the opening scene, including reloads
  // and clicking the logo while already here. Explicit section links still work.
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const showOpening = () => {
      if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    showOpening()
    window.addEventListener('pageshow', showOpening)
    return () => {
      window.removeEventListener('pageshow', showOpening)
      window.history.scrollRestoration = previousRestoration
    }
  }, [location])

  // Scroll to anchor if URL has a hash (e.g. /#packages)
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        const timer = setTimeout(() => el.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        }), 100)
        return () => clearTimeout(timer)
      }
    }
  }, [location])

  return (
    <>
      <Helmet>
        <title>STEM Academia - Инновационное Образование и STEM Оборудование в Казахстане</title>
        <meta name="description" content="STEM Academia - лидер в поставке STEM оборудования, интерактивных панелей и мебели для школ в Казахстане. Создаем будущее образования!" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "STEM Academia",
            "image": "https://stem-academia.kz/img/pagefirst/Vector (89).png",
            "telephone": "+7 777 870 32 06",
            "email": "info@stem-academia.kz",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ул. Домалак ана, 26",
              "addressLocality": "Астана",
              "addressCountry": "KZ"
            },
            "url": "https://stem-academia.kz",
            "priceRange": "$$",
            "openingHours": "Mo-Fr 09:00-18:00",
            "sameAs": [
              "https://www.instagram.com/stem_academia",
              "https://www.youtube.com/@stemacademia6974"
            ]
          })}
        </script>
      </Helmet>
      
      <div className="page stem-home">
      {/* Hero и категории */}
      <div className="stem-home-design" ref={homeRef}>
        <svg className="stem-home-shapes" aria-hidden="true" focusable="false" width="0" height="0">
          <defs>
            <clipPath id="stem-hero-clip" clipPathUnits="objectBoundingBox">
              <path d="M .25 0 H 1 V .77 Q 1 .85 .96 .91 L .91 .98 Q .89 1 .84 1 H .28 Q .24 1 .21 .95 L .16 .86 Q .13 .80 .07 .80 Q 0 .80 0 .69 Q 0 .65 .025 .59 Z" />
            </clipPath>
            <clipPath id="stem-environment-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0 0 H .68 Q .76 0 .80 .12 L .97 .48 Q 1 .55 .97 .63 L .84 .90 Q .79 1 .69 1 H .26 Q .19 1 .15 .91 L .015 .56 Q 0 .52 0 .45 Z" />
            </clipPath>
          </defs>
        </svg>
        <HomePhotoJourney />
        <HeroSlider />
        <HomeEnvironment />
        <CategoryGrid />
      </div>

      {/* AI Визуализация — CTA секция */}
      <section className="visualize-cta-section">
        <div className="visualize-cta-container">
          <div className="visualize-cta-text">
            <h2 className="visualize-cta-title">{t.visualize_cta_title || 'Визуализируйте мебель в вашем помещении с AI'}</h2>
            <p className="visualize-cta-desc">{t.visualize_cta_desc || 'Загрузите фото вашего помещения и разместите мебель из нашего каталога с помощью AI'}</p>
          </div>
          <Link to="/visualize" className="visualize-cta-btn">
            {t.visualize_cta_btn || 'Попробовать визуализацию'} →
          </Link>
        </div>
      </section>

      {/* Пакеты дизайна */}
      <HomePackages packagesRef={packagesRef} />

      {/* Приказ №70 */}
      <section className="order70-section">
        <div className="order70-container">
          <div className="order70-badge">Приказ №70 МОН РК</div>
          <h2 className="order70-title">{t.order70_title}</h2>
          <p className="order70-desc">{t.order70_desc}</p>
          <p className="order70-note">{t.order70_note}</p>
          <a href="https://adilet.zan.kz/rus/docs/V1600013272" target="_blank" rel="noopener noreferrer" className="order70-link">
            {t.order70_link_text}
          </a>
        </div>
      </section>

      {/* БЛОК ПРЕИМУЩЕСТВ */}
      <section className="advantages-section">
        <div className="advantages-container">
          <h2 className="advantages-title">{t.advantages_title}</h2>
          <div className="advantages-grid">
            {ADVANTAGES.map(({ icon, key }) => {
              const IconComp = Icon[icon]
              return (
              <div key={key} className="advantage-card">
                <div className="advantage-icon">{IconComp ? <IconComp width="24" height="24" /> : ''}</div>
                <h3 className="advantage-card__title">{t[`${key}_title`]}</h3>
                <p className="advantage-card__desc">{t[`${key}_desc`]}</p>
              </div>
            )
            })}
          </div>
        </div>
      </section>

      {/* ПРЕВЬЮ ИНСТРУКЦИЙ */}
      <section className="instructions-preview-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.instructions_section_title}</h2>
            <Link to="/instructions" className="section-link">{t.instructions_all} →</Link>
          </div>
          <div className="instr-preview-grid">
            {INSTRUCTIONS.map((item, i) => {
              const IconComp = Icon[item.icon]
              return (
              <Link key={i} to={item.path} className="instr-preview-card">
                <span className="instr-preview-icon">{IconComp ? <IconComp width="24" height="24" /> : ''}</span>
                <div>
                  <h3 className="instr-preview-title">{item.title}</h3>
                  <p className="instr-preview-desc">{item.desc}</p>
                </div>
              </Link>
            )
            })}
          </div>
        </div>
      </section>

      {/* ПРЕВЬЮ БЛОГА */}
      <section className="blog-preview-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.blog_section_title}</h2>
            <Link to="/blog" className="section-link">{t.blog_read_all} →</Link>
          </div>
          <div className="blog-preview-grid">
            {BLOG_POSTS.map(post => (
              <Link key={post.id} to={post.path} className="blog-preview-card">
                <div className="blog-preview-img">
                  <img src={post.img} alt={post.title} />
                </div>
                <div className="blog-preview-body">
                  <span className="blog-preview-date">{post.date}</span>
                  <h3 className="blog-preview-title">{post.title}</h3>
                  <p className="blog-preview-excerpt">{post.excerpt}</p>
                  <span className="blog-preview-link">{t.blog_read_more} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


    </div>
    </>
  )
}
