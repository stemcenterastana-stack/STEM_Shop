import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import './CategoryGrid.css'

export default function CategoryGrid() {
  const { t } = useLang()
  const categories = [
    { title: t.nav_design, path: '/#packages', image: '/img/pagefirst/room.png' },
    { title: t.nav_furniture, path: '/secondpage', image: '/img/pagefirst/F5.png' },
    { title: t.nav_electro, path: '/electro', image: '/img/pagethird/comp.png' },
    { title: t.nav_decor, path: '/decor', image: '/img/pagefirst/plant.png' },
    { title: t.nav_equipment, path: '/equipment', image: '/img/equipment/arduino.png' },
    { title: t.nav_digital, path: '/digital', image: '/img/pagefirst/RoqedAITOmainpage.jpeg' },
  ]
  return (
    <section className="stem-catalog" id="catalog" aria-labelledby="stem-catalog-title">
      <h2 id="stem-catalog-title" className="stem-catalog__title">{t.catalog}</h2>
      <div className="stem-catalog__grid">
        {categories.map(category => (
          <div className="stem-catalog__slot" key={category.path}>
            <Link to={category.path} className="stem-catalog__card">
              <div className="stem-catalog__image"><img src={category.image} alt="" width="180" height="140" loading="lazy" /></div>
              <span className="stem-catalog__label">{category.title}<span className="stem-catalog__arrow"><ArrowRight size={16} aria-hidden="true" /></span></span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
