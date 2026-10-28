import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Settings, Users, ShieldCheck } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { homeContent } from '../i18n/homeContent'
import './HomeEnvironment.css'

const featureIcons = [GraduationCap, Settings, Users, ShieldCheck]

export default function HomeEnvironment() {
  const { lang } = useLang()
  const copy = homeContent[lang]
  return (
    <section className="stem-environment" aria-labelledby="stem-environment-title">
      <div className="stem-environment__visual">
        <div className="stem-environment__reveal">
          <div className="stem-environment__media">
            <div className="stem-environment__viewport">
              <div className="stem-environment__camera">
                <img src="/img/home/stem-classroom.png" alt={copy.roomAlt} width="1536" height="1024" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stem-environment__copy">
        <p className="stem-eyebrow">{copy.environmentEyebrow}</p>
        <h2 id="stem-environment-title" className="stem-environment__title"><span className="stem-environment__title-content">{copy.environmentTitle}<br /><span>STEM</span>{copy.environmentTitleEnd}</span></h2>
        <p className="stem-environment__description"><span>{copy.environmentDescription}</span></p>
        <div className="stem-environment__features">
          {copy.features.map((feature, index) => {
            const FeatureIcon = featureIcons[index]
            return (
              <div className="stem-environment__feature-slot" key={index}>
                <div className="stem-environment__feature">
                  <span className="stem-environment__icon"><FeatureIcon size={25} strokeWidth={1.7} aria-hidden="true" /></span>
                  <div><h3>{feature.title}</h3><p>{feature.description}</p></div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="stem-environment__action"><Link to="/about" className="stem-button">{copy.environmentButton}<ArrowRight size={19} aria-hidden="true" /></Link></div>
      </div>
    </section>
  )
}
