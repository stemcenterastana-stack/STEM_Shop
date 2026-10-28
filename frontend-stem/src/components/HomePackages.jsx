import {
  BadgeCheck, Box, Diamond, DraftingCompass, Grid2X2, Layers3,
  Monitor, Network, PaintRoller, Plug, Settings2, ShieldCheck, Users,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import usePackageMotion from './usePackageMotion'
import './HomePackages.css'

const PACKAGES = [
  {
    key: 's', name: 'Standard', slug: 'standard',
    icons: [DraftingCompass, PaintRoller, Grid2X2, Plug, Settings2, BadgeCheck],
    alt: {
      ru: 'Концепция светлого учебного кабинета с зелёными стульями и деревянными партами',
      kz: 'Жасыл орындықтар мен ағаш парталары бар жарық оқу кабинетінің тұжырымдамасы',
    },
  },
  {
    key: 'm', name: 'Comfort', slug: 'comfort',
    icons: [DraftingCompass, PaintRoller, Layers3, Plug, Settings2, ShieldCheck],
    alt: {
      ru: 'Концепция пространства для групповой работы с круглыми столами и зоной чтения',
      kz: 'Дөңгелек үстелдері мен оқу аймағы бар топтық жұмыс кеңістігінің тұжырымдамасы',
    },
  },
  {
    key: 'l', name: 'Premium', slug: 'premium',
    icons: [Box, Diamond, Network, Monitor, Users, BadgeCheck],
    alt: {
      ru: 'Концепция STEM-лаборатории с рабочими столами, микроскопами и зелёной мебелью',
      kz: 'Жұмыс үстелдері, микроскоптары мен жасыл жиһазы бар STEM-зертхана тұжырымдамасы',
    },
  },
]

export default function HomePackages({ packagesRef }) {
  const { t, lang } = useLang()
  usePackageMotion(packagesRef)
  const [eyebrow, heading] = t.design_breadcrumb.split(' / ')
  const [firstWord, ...otherWords] = heading.toLocaleLowerCase().split(' ')

  return (
    <section className="stem-packages" id="packages" ref={packagesRef} aria-labelledby="stem-packages-title">
      <header className="stem-packages__header">
        <p className="stem-packages__eyebrow">{eyebrow}</p>
        <h2 id="stem-packages-title" className="stem-packages__heading">
          {firstWord.charAt(0).toLocaleUpperCase() + firstWord.slice(1)}{' '}
          <span>{otherWords.join(' ')}</span>
        </h2>
      </header>

      {PACKAGES.map(({ key, name, slug, icons, alt }) => (
        <article className={`stem-package stem-package--${slug}`} key={key} aria-labelledby={`package-${slug}-title`}>
          <div className="stem-package__inner">
            <div className="stem-package__visual">
              <div className="stem-package__reveal">
                <div className="stem-package__media">
                  <div className="stem-package__photo">
                    <div className="stem-package__camera">
                      <img
                        src={`/img/home/packages/${slug}.png`}
                        alt={alt[lang]}
                        width="1254"
                        height="1254"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stem-package__content">
              <h3 id={`package-${slug}-title`} className="stem-package__title"><span>{name}</span></h3>
              <p className="stem-package__description"><span>{t[`pkg_${key}_desc`]}</span></p>
              <ul className="stem-package__features">
                {t[`pkg_${key}_items`].map((item, index) => {
                  const FeatureIcon = icons[index]
                  return (
                    <li className="stem-package__feature-slot" key={index}>
                      <div className="stem-package__feature">
                        <span className="stem-package__icon" aria-hidden="true">
                          <FeatureIcon size={26} strokeWidth={1.7} />
                        </span>
                        <span>{item}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
