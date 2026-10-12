import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { SENSORIUM_PRODUCTS } from './sensoriumData'
import ProductActions from '../../components/ProductActions'
import './Sensorium.css'

const SPEC_KZ = {
  'Диапазон': 'Диапазон',
  'Разрешение': 'Ажыратымдылық',
  'Входной ток': 'Кіріс тогы',
  'Диапазон расстояния': 'Қашықтық диапазоны',
  'Диапазон времени': 'Уақыт диапазоны',
  'Температура': 'Температура',
  'Точность': 'Дәлдік',
  'Уровень звука': 'Дыбыс деңгейі',
  'Форма звуковой волны': 'Дыбыс толқынының пішіні',
  'Каналы': 'Арналар',
  'Длина волны': 'Толқын ұзындығы',
  'Разделение ворот': 'Қақпа арақашықтығы',
  'Диапазоны в каталоге': 'Каталогтағы диапазондар',
  'Скорость регистрации': 'Тіркеу жылдамдығы',
  'Комплектация': 'Жиынтық құрамы',
  'Диапазон pH': 'pH диапазоны',
  'Диапазон мВ': 'мВ диапазоны',
  'Диапазон в каталоге': 'Каталогтағы диапазон',
  'Разрешение в каталоге': 'Каталогтағы ажыратымдылық',
  'Диапазон DO': 'Еріген оттегі диапазоны',
  'Диапазон O₂': 'O₂ диапазоны',
  'Разрешение (12 бит)': 'Ажыратымдылық (12 бит)',
  'Кривая ЭКГ': 'ЭКГ қисығы',
  'Длины волн из каталога': 'Каталогтағы толқын ұзындықтары',
  'Интерфейс': 'Интерфейс',
  'Назначение': 'Мақсаты',
  'Формат': 'Формат',
}
const SPEC_VALUE_KZ = {
  'Переменный или постоянный': 'Айнымалы немесе тұрақты',
  'X, Y, Z': 'X, Y, Z',
  'Силиконовая трубка, коннекторы Люэра': 'Силикон түтікше, Люэр қосқыштары',
  'До 40 000 отсчётов/с': 'Секундына 40 000 өлшемге дейін',
  '0–250 уд/мин; измерения 0–200 уд/мин': '0–250 соққы/мин; өлшеу 0–200 соққы/мин',
  '1 удар/мин': '1 соққы/мин',
  '±5 % после калибровки': 'Калибрлеуден кейін ±5 %',
  'Хранение и транспортировка датчиков': 'Датчиктерді сақтау және тасымалдау',
  'Цифровой курс с элементами ИИ': 'ЖИ элементтері бар цифрлық курс',
}

const TABS = [
  { id: 'all', ru: 'Все товары', kz: 'Барлық тауарлар' },
  { id: 'physics', ru: 'Физика', kz: 'Физика' },
  { id: 'biology', ru: 'Биология', kz: 'Биология' },
  { id: 'chemistry', ru: 'Химия', kz: 'Химия' },
  { id: 'extra', ru: 'Дополнительно', kz: 'Қосымша' },
]

export default function Sensorium() {
  const { t, lang } = useLang()
  const kz = lang === 'kz'
  const [tab, setTab] = useState('all')
  const visible = useMemo(() => SENSORIUM_PRODUCTS.filter((item) => {
    if (tab === 'all') return true
    return item.subjects.includes(tab)
  }), [tab])

  return (
    <div className="sensorium-page">
      <nav className="sensorium-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">{t.home}</Link>
        <span> / </span>
        <Link to="/equipment">{t.equipment}</Link>
        <span> / SENSORIUM</span>
      </nav>

      <header className="sensorium-head">
        <div>
          <p className="sensorium-kicker">STEM ACADEMIA / SENSORIUM</p>
          <h1>SENSORIUM</h1>
          <p className="sensorium-subtitle">
            {kz ? 'Физика, биология және химияға арналған цифрлық зертханалар'
                : 'Цифровые лаборатории по физике, биологии и химии'}
          </p>
        </div>
        <div className="sensorium-head-badge">{kz ? 'Каталог 2025' : 'Каталог 2025'}</div>
      </header>

      <div className="sensorium-tabs" role="tablist" aria-label={kz ? 'Пәндер' : 'Предметы'}>
        {TABS.map(item => (
          <button key={item.id} type="button" role="tab"
            aria-selected={tab === item.id}
            className={'sensorium-tab' + (tab === item.id ? ' sensorium-tab--active' : '')}
            onClick={() => setTab(item.id)}>
            {kz ? item.kz : item.ru}
          </button>
        ))}
      </div>

      <p className="sensorium-count">{kz ? 'Көрсетілген тауарлар:' : 'Найдено товаров:'} {visible.length}</p>

      <main className="sensorium-grid">
        {visible.map((item) => (
          <article className="sensorium-item" key={item.key} id={`sensorium-${item.key}`}>
            <div className="sensorium-item__media">
              <img src={item.img} alt={kz ? item.title_kz : item.title_ru} loading="lazy" />
            </div>
            <div className="sensorium-item__body">
              <div className="sensorium-item__sku">{item.article}</div>
              <h2>{kz ? item.title_kz : item.title_ru}</h2>
              <p className="sensorium-item__description">{kz ? item.description_kz : item.description_ru}</p>
              <details className="sensorium-item__details">
                <summary>{kz ? 'Техникалық сипаттамалары' : 'Характеристики'}</summary>
                <dl>
                  {item.specs.map(([label, value], index) => (
                    <div key={index}>
                      <dt>{kz ? (SPEC_KZ[label] || label) : label}</dt>
                      <dd>{kz ? (SPEC_VALUE_KZ[value] || value) : value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
              <div className="sensorium-item__actions">
                <ProductActions product={{
                  id: `sensorium-${item.key}`,
                  title: kz ? item.title_kz : item.title_ru,
                  article: item.article,
                  img: item.img,
                }} />
              </div>
            </div>
          </article>
        ))}
      </main>

      <div className="sensorium-footer-note">
        {kz
          ? 'Сипаттамалар Sensorium каталогы бойынша берілген. Баға мен қолжетімділікті менеджерден нақтылаңыз.'
          : 'Характеристики по каталогу Sensorium. Цену и наличие уточняйте у менеджера.'}
        {' '}<Link to="/contacts">{kz ? 'Байланысу' : 'Связаться'}</Link>
      </div>
    </div>
  )
}
