import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { createApplication } from '../../api/api'
import { ULABS_PRODUCTS } from './ulabsData'
import './ULabsCatalog.css'

const ROOT = '/img/equipment/ulabs'
const addressBook = { astana: { name: 'Астана', pickup: 'г. Астана, ул. Домалак-ана 26' }, almaty: { name: 'Алматы', pickup: '' } }
const subjects = [{ key: 'all', ru: 'Все направления', kz: 'Барлық бағыттар' }, { key: 'biology', ru: 'Биология', kz: 'Биология' }, { key: 'chemistry', ru: 'Химия', kz: 'Химия' }, { key: 'physics', ru: 'Физика', kz: 'Физика' }, { key: 'nano', ru: 'Нанотехнологии', kz: 'Нанотехнология' }]
const groups = [{ key: 'all', ru: 'Все товары', kz: 'Барлық тауарлар' }, { key: 'kit', ru: 'Комплекты', kz: 'Жиынтықтар' }, { key: 'topic', ru: 'Практикумы', kz: 'Практикумдар' }, { key: 'demo', ru: 'Демонстрационные средства', kz: 'Демонстрациялық құралдар' }]
const I18N = {
  ru: { title: 'Лабораторные комплекты ULABS', intro: 'Подбор оборудования для кабинетов биологии, химии, физики и нанотехнологий по двум оригинальным каталогам производителя.', search: 'Поиск по названию, артикулу или характеристике', details: 'Описание и комплектация', add: 'В корзину', favorite: 'Избранное', application: 'Запросить предложение', empty: 'Ничего не найдено. Попробуйте изменить фильтры.', reset: 'Сбросить фильтры', count: 'позиций в каталоге', source: 'Источник', photos: 'Фотографии из каталога', unavailablePhoto: 'Отдельное фото отсутствует в PDF', specifications: 'Характеристики и документация', composition: 'Состав набора по каталогу', topics: 'Темы и практикумы направления', original: 'Исходная страница PDF', page: 'Страница', full: 'Открыть изображение в полном размере', noPrice: 'Цена по запросу', note: 'Цены и остатки в PDF не указаны. Для уточнения комплектации и стоимости отправьте заявку.', close: 'Закрыть', requestTitle: 'Запросить предложение', requestName: 'Ваше имя', requestPhone: 'Номер телефона', qty: 'Количество', city: 'Город', method: 'Способ получения', pickup: 'Самовывоз', delivery: 'Доставка по Казахстану', address: 'Адрес доставки', comment: 'Комментарий', send: 'Отправить заявку', sending: 'Отправляем…', success: 'Заявка сохранена', successDetails: 'Менеджер свяжется с вами. Номер заявки', error: 'Не удалось отправить заявку. Проверьте номер телефона и соединение.', number: 'Код для поиска (не артикул производителя)', article: 'Артикул производителя', pdf: 'Технические сведения и полная таблица на оригинальных страницах PDF', showMore: 'Показать ещё', skip: 'На странице источника перечислено как отдельная позиция; состав и размеры не указаны.', openCart: 'Корзина', verification: 'Сайт подтверждает прием заявки, но создание сделки в Bitrix24 требует проверки в CRM.', catalogPhoto: 'Фото по материалам PDF', sectionPhoto: 'Групповая иллюстрация PDF', pageLink: 'Открыть PDF, стр.', officialLink: 'Каталог производителя', openImage: 'Открыть изображение', docLink: 'Оригинальный PDF', statusNote: 'Фото иллюстрирует раздел, а не отдельный товар. Индивидуальная фотография в PDF не указана.', sourceLinks: 'Документы и ссылки' },
  kz: { title: 'ULABS зертханалық жиынтықтары', intro: 'Өндірушінің екі түпнұсқа каталогы бойынша биология, химия, физика және нанотехнология кабинеттеріне арналған жабдықтар.', search: 'Атауы, артикулы немесе сипаттамасы бойынша іздеу', details: 'Сипаттама және құрамы', add: 'Себетке', favorite: 'Таңдаулы', application: 'Өтінім қалдыру', empty: 'Тауар табылмады. Сүзгілерді өзгертіп көріңіз.', reset: 'Сүзгілерді тазарту', count: 'каталогтағы позиция', source: 'Дереккөз', photos: 'Каталогтағы фотолар', unavailablePhoto: 'PDF-те жеке фотосуреті жоқ', specifications: 'Сипаттамалар мен құжаттар', composition: 'Каталог бойынша жиынтық құрамы', topics: 'Бағыттың тақырыптары мен практикумдары', original: 'PDF-тің бастапқы беті', page: 'Бет', full: 'Суретті толық өлшемде ашу', noPrice: 'Бағасы сұраныс бойынша', note: 'PDF-та баға мен қалдық жоқ. Құрамын және бағасын білу үшін өтінім жіберіңіз.', close: 'Жабу', requestTitle: 'Коммерциялық ұсыныс сұрау', requestName: 'Аты-жөніңіз', requestPhone: 'Телефон нөмірі', qty: 'Саны', city: 'Қала', method: 'Алу тәсілі', pickup: 'Өзі алып кету', delivery: 'Қазақстан бойынша жеткізу', address: 'Жеткізу мекенжайы', comment: 'Түсініктеме', send: 'Өтінімді жіберу', sending: 'Жіберіліп жатыр…', success: 'Өтінім сақталды', successDetails: 'Менеджер хабарласады. Өтінім нөмірі', error: 'Өтінім жіберілмеді. Телефон мен байланысты тексеріңіз.', number: 'Сайт ішіндегі код (өндіруші артикулы емес)', article: 'Өндіруші артикулы', pdf: 'Техникалық мәлімет пен толық кесте түпнұсқа PDF беттерінде', showMore: 'Тағы көрсету', skip: 'Бұл атау каталогта жеке позиция ретінде берілген; құрамы мен өлшемдері көрсетілмеген.', openCart: 'Себет', verification: 'Сайт өтінімді қабылдағанын растайды, ал Bitrix24-та мәміле ашылғанын CRM-нен бөлек тексеру керек.', catalogPhoto: 'PDF материалдарындағы фото', sectionPhoto: 'PDF бөлімінің ортақ суреті', pageLink: 'PDF ашу, бет', officialLink: 'Өндірушінің каталогы', openImage: 'Суретті ашу', docLink: 'Түпнұсқа PDF', statusNote: 'Бұл жеке тауардың фотосы емес, бөлімнің ортақ суреті. PDF-та жеке фотосы жоқ.', sourceLinks: 'Құжаттар мен сілтемелер' }
}

const documentImage = (p, page) => `${ROOT}/pages/${p.kind === 'bio' ? 'bio' : 'standard'}-${String(page).padStart(2,'0')}.jpg`
function SourcePhoto({ product, className = '' }) {
  // Every item has an authentic source-backed visual. For demo lists, source is a clearly-labeled *section* illustration.
  return <img className={className} src={product.img || product.catalogPreviewURL}
    alt={product.photoStatus === 'section-illustration' ? `${product.title}: иллюстрация раздела из PDF, не фото конкретной позиции` : product.title}
    loading="lazy" onError={e=>{if(e.currentTarget.src !== new URL(product.catalogPreviewURL, window.location.origin).href){e.currentTarget.src=product.catalogPreviewURL}}} />
}
function SourceLinks({ product, t, compact = false }) {
  return <div className={'ulabs-document-links '+(compact?'ulabs-document-links--compact':'')}>
    <a href={product.catalogPageURL} target="_blank" rel="noopener noreferrer">↗ {t.pageLink} {product.pages[0]}</a>
    <a href={product.img || product.catalogPreviewURL} target="_blank" rel="noopener noreferrer">↗ {t.openImage}</a>
    {!compact && <a href={product.publisherSite} target="_blank" rel="noopener noreferrer">↗ {t.officialLink}</a>}
  </div>
}
function RequestModal({ item, onClose, language, user }) {
  const t = I18N[language]
  const defaultCity = (() => {try { return localStorage.getItem('stem_city') || 'astana' } catch { return 'astana' }})()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [count, setCount] = useState(1)
  const [cityChoice, setCityChoice] = useState(defaultCity === 'almaty' ? 'almaty' : 'astana')
  const [extraCity, setExtraCity] = useState('')
  const [method, setMethod] = useState(defaultCity === 'astana' ? 'pickup' : 'delivery')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const onEsc = ev => { if (ev.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])
  const location = cityChoice === 'other' ? extraCity.trim() : addressBook[cityChoice].name
  const destination = method === 'pickup' ? addressBook[cityChoice]?.pickup : address.trim()
  const submit = async event => {
    event.preventDefault()
    if (loading || !location || !destination || !name.trim() || phone.replace(/\D/g,'').length < 10) {
      setError(t.error);return
    }
    setError(''); setLoading(true)
    try {
      const response = await createApplication({
        name: name.trim(), phone: phone.trim(), location_city: location, location_address: destination,
        product_name: item.title, article: item.article || null,
        product_url: `${window.location.origin}/equipment/ulabs-catalog?product=${encodeURIComponent(item.id)}`,
        comment: [`ULABS · ${method === 'delivery' ? t.delivery : t.pickup}`, `Источник: ${item.catalogFile}, стр. ${item.pages.join(', ')}`, `Код в каталоге сайта: ${item.catalog_id}`,comment.trim()].filter(Boolean).join('\n'),
        products: [{ name: item.title, article: item.article || null, quantity: count,
          url: `${window.location.origin}/equipment/ulabs-catalog?product=${encodeURIComponent(item.id)}` }]
      })
      setResult(response?.id || '—')
    } catch (err) { setError(err?.message || t.error) }
    finally { setLoading(false) }
  }
  return <div className="ulabs-shade" role="presentation" onMouseDown={e => {if(e.currentTarget===e.target) onClose()}}><section className="ulabs-request" role="dialog" aria-modal="true" aria-labelledby="ulabs-request-h">
    <button className="ulabs-cross" type="button" onClick={onClose} aria-label={t.close}>×</button>
    {result ? <div className="ulabs-success"><span>✓</span><h2>{t.success}</h2><p>{t.successDetails}: <strong>{result}</strong></p><p className="ulabs-hint">{t.verification}</p><button type="button" className="ulabs-primary" onClick={onClose}>{t.close}</button></div> : <>
      <span className="ulabs-overline">ULABS · STEM ACADEMIA</span><h2 id="ulabs-request-h">{t.requestTitle}</h2>
      <p className="ulabs-request__product">{item.title}</p>
      <form className="ulabs-form" onSubmit={submit}>
        <div className="ulabs-form__two"><label>{t.requestName} *<input autoFocus value={name} maxLength={50} required minLength={2} onChange={e=>setName(e.target.value)} placeholder="Иван Иванов" /></label><label>{t.requestPhone} *<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+7 777 123 45 67" type="tel" required minLength={10} /></label></div>
        <div className="ulabs-form__two"><label>{t.qty}<input type="number" min="1" max="500" value={count} onChange={e=>setCount(Math.min(500,Math.max(1,Number(e.target.value)||1)))} required /></label><label>{t.city} *<select value={cityChoice} onChange={e=>{setCityChoice(e.target.value);if(e.target.value!=='astana')setMethod('delivery')}}><option value="astana">Астана</option><option value="almaty">Алматы</option><option value="other">Другой город / Басқа қала</option></select></label></div>
        {cityChoice === 'other' && <label>{t.city} *<input required value={extraCity} onChange={e=>setExtraCity(e.target.value)} placeholder="Название города" /></label>}
        <label>{t.method}<select value={method} onChange={e=>setMethod(e.target.value)}>{cityChoice === 'astana' && <option value="pickup">{t.pickup}</option>}<option value="delivery">{t.delivery}</option></select></label>
        {method === 'delivery' ? <label>{t.address} *<input required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Улица, дом, офис / Мекенжай" /></label> : <div className="ulabs-pickup">{cityChoice==='other' ? t.delivery + ' — '+ t.method : addressBook[cityChoice].pickup}</div>}
        {cityChoice === 'other' && method === 'pickup' && <p className="ulabs-hint">{t.pickup}: Астана / Алматы. {t.delivery} — другой город.</p>}
        <label>{t.comment}<textarea rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Дополнительные пожелания" /></label>
        {error && <p role="alert" className="ulabs-form-error">{error}</p>}
        <button disabled={loading} type="submit" className="ulabs-primary ulabs-primary--wide">{loading?t.sending:t.send} →</button>
        <p className="ulabs-hint">{t.verification}</p>
      </form>
    </>}
  </section></div>
}
function Actions({ p, onRequest, language }) {
  const t = I18N[language]
  const { addToCart, setIsOpen } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [added, setAdded] = useState(false)
  return <div className="ulabs-actions">
    <button className={'ulabs-btn ulabs-btn--cart '+(added?'is-added':'')} type="button" onClick={()=>{addToCart({id:p.id,title:p.title,name:p.title,article:p.article||undefined,img:p.img||documentImage(p,p.pages[0]),url:`${window.location.origin}/equipment/ulabs-catalog?product=${encodeURIComponent(p.id)}`});setAdded(true)}}>{added?'✓ '+t.add:'＋ '+t.add}</button>
    <button className={'ulabs-btn ulabs-btn--heart '+(isFavorite(p.id)?'is-on':'')} type="button" onClick={()=>toggleFavorite({id:p.id,title:p.title,article:p.article||undefined,img:p.img||documentImage(p,p.pages[0])})} aria-label={t.favorite}>{isFavorite(p.id)?'♥':'♡'}</button>
    <button className="ulabs-btn ulabs-btn--request" type="button" onClick={()=>onRequest(p)}>{t.application} ↗</button>
    {added && <button type="button" className="ulabs-mini-cart" onClick={()=>setIsOpen(true)}>{t.openCart} →</button>}
  </div>
}
export default function ULabsCatalog() {
  const { lang } = useLang();const language = lang === 'kz' ? 'kz' : 'ru';const t = I18N[language]
  const {user} = useAuth()
  const [query,setQuery]=useState('');const [subject,setSubject]=useState('all');const [group,setGroup]=useState('all');const [source,setSource]=useState('all');const [limit,setLimit]=useState(18)
  const [details,setDetails]=useState(null);const [request,setRequest]=useState(null);const [photoPage,setPhotoPage]=useState(null)
  const filtered=useMemo(()=>ULABS_PRODUCTS.filter(p => {
    const q=query.toLocaleLowerCase().trim()
    return (subject==='all'||p.subject===subject)&&(group==='all'||p.group===group)&&(source==='all'||p.kind===source)&&(!q||`${p.title} ${p.description} ${p.article} ${p.catalog_id} ${p.composition?.join(' ')||''}`.toLocaleLowerCase().includes(q))
  }),[query,subject,group,source])
  const items=filtered.slice(0,limit)
  const reset=()=>{setQuery('');setSubject('all');setGroup('all');setSource('all');setLimit(18)}
  const change=(fn,val)=>{fn(val);setLimit(18)}
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    const id=params.get('product'); if (id) setDetails(ULABS_PRODUCTS.find(x=>x.id===id)||null)
  },[])
  useEffect(()=>{
    if(!details && !request && !photoPage) return
    const old=document.body.style.overflow;document.body.style.overflow='hidden'
    const onEsc=e=>{if(e.key==='Escape'){setPhotoPage(null);setDetails(null);setRequest(null)}}
    document.addEventListener('keydown',onEsc)
    return ()=>{document.body.style.overflow=old;document.removeEventListener('keydown',onEsc)}
  },[details,request,photoPage])
  const childTopics=details&&details.kind==='bio'&&details.group==='kit' ? ULABS_PRODUCTS.filter(p=>p.kind==='bio'&&p.group==='topic'&&details.pages.includes(p.pages[0])):[]
  return <div className="ulabs-page">
    <div className="ulabs-container">
      <nav className="ulabs-breadcrumb" aria-label="Breadcrumb"><Link to="/">{language==='kz'?'Басты бет':'Главная'}</Link><span>›</span><Link to="/equipment">{language==='kz'?'Жабдықтар':'Оборудование'}</Link><span>›</span><strong>ULABS</strong></nav>
      <header className="ulabs-banner"><div><span className="ulabs-overline">STEM ACADEMIA · UNOWA</span><h1>{t.title}</h1><p>{t.intro}</p><div className="ulabs-banner__tags"><span>ULABS BIO NANO</span><span>ULABS 2024</span><span>{ULABS_PRODUCTS.length} {t.count}</span></div>
        <div className="ulabs-banner__downloads"><a href="/catalogs/ulabs-bio-nano.pdf" target="_blank" rel="noopener noreferrer">↗ Bio Nano PDF (48 стр.)</a><a href="/catalogs/ulabs-2024.pdf" target="_blank" rel="noopener noreferrer">↗ ULABS 2024 PDF (18 стр.)</a></div></div><div className="ulabs-banner__image" aria-hidden="true"><img src={`${ROOT}/products/kit-2024-03.webp`} alt="" /></div></header>
      <div className="ulabs-toolbar"><div className="ulabs-toolbar__line"><label className="ulabs-search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={e=>change(setQuery,e.target.value)} placeholder={t.search} aria-label={t.search} /></label><select className="ulabs-source" value={source} onChange={e=>change(setSource,e.target.value)} aria-label={t.source}><option value="all">ULABS · {language==='kz'?'Екі каталог':'Оба каталога'}</option><option value="bio">ULABS Bio Nano</option><option value="standard">ULABS 2024</option></select></div>
        <div className="ulabs-filter-row" aria-label="Subject filters">{subjects.map(x=><button type="button" key={x.key} className={subject===x.key?'active':''} onClick={()=>change(setSubject,x.key)} aria-pressed={subject===x.key}>{x[language]}</button>)}</div>
        <div className="ulabs-filter-row ulabs-filter-row--secondary">{groups.map(x=><button type="button" key={x.key} className={group===x.key?'active':''} onClick={()=>change(setGroup,x.key)} aria-pressed={group===x.key}>{x[language]}</button>)}</div>
      </div>
      <div className="ulabs-results"><span><strong>{filtered.length}</strong> {t.count}</span><button type="button" onClick={reset}>{t.reset} ↺</button></div>
      {items.length ? <div className="ulabs-grid">{items.map(p=><article className="ulabs-tile" key={p.id}>
        <div className="ulabs-tile__media"><span className="ulabs-tile__type">{p.kind==='bio'?'BIO NANO':'ULABS 2024'}</span>{p.photoStatus === 'section-illustration' && <span className="ulabs-tile__source-badge" title={t.statusNote}>{t.sectionPhoto}</span>}<button type="button" onClick={()=>setDetails(p)} aria-label={t.details+' '+p.title}><SourcePhoto product={p} className="ulabs-tile__image" /></button></div>
        <div className="ulabs-tile__body"><span className="ulabs-tile__sku">{p.article ? t.article : t.number}: {p.article||p.catalog_id}</span><h2>{p.title}</h2><p className="ulabs-tile__desc">{p.description}</p><div className="ulabs-tile__meta"><span>{p.group==='kit'?(language==='kz'?'Жиынтық':'Комплект'):p.group==='topic'?(language==='kz'?'Практикум':'Практикум'):(language==='kz'?'Демонстрация':'Демонстрация')}</span><span>{t.page}: {p.pages.join(', ')}</span></div><button type="button" className="ulabs-detail-link" onClick={()=>setDetails(p)}>{t.details}<span>↗</span></button><SourceLinks product={p} t={t} compact />
        <div className="ulabs-tile__bottom"><strong>{t.noPrice}</strong><Actions p={p} onRequest={setRequest} language={language}/></div></div>
      </article>)}</div>:<div className="ulabs-no-results"><h2>{t.empty}</h2><button onClick={reset} type="button">{t.reset}</button></div>}
      {filtered.length>limit && <div className="ulabs-pagination"><button onClick={()=>setLimit(n=>n+18)} type="button">{t.showMore} ({filtered.length-limit}) ↓</button></div>}
      <p className="ulabs-footer-note">{t.note}</p>
    </div>
    {details && <div className="ulabs-shade" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setDetails(null)}}><section className="ulabs-details" role="dialog" aria-modal="true" aria-labelledby="ulabs-detail-heading">
      <button type="button" className="ulabs-cross" aria-label={t.close} onClick={()=>setDetails(null)}>×</button>
      <div className="ulabs-detail-top"><div className="ulabs-detail-image"><SourcePhoto product={details}/></div><div className="ulabs-detail-info"><span className="ulabs-overline">{details.kind==='bio'?'ULABS BIO NANO':'ULABS 2024'} · {details.article||details.catalog_id}</span><h2 id="ulabs-detail-heading">{details.title}</h2><p>{details.description}</p>{details.photoStatus === 'section-illustration' && <p className="ulabs-photo-disclaimer">{t.statusNote}</p>}<SourceLinks product={details} t={t}/><div className="ulabs-detail-cta"><strong>{t.noPrice}</strong><Actions p={details} onRequest={setRequest} language={language}/></div></div></div>
      <section className="ulabs-detail-section"><h3>{t.specifications}</h3><dl>{details.specs.map(([key,value],index)=><div key={index}><dt>{key}</dt><dd>{value}</dd></div>)}<div><dt>{details.article?t.article:t.number}</dt><dd>{details.article||details.catalog_id}</dd></div></dl></section>
      {details.composition?.length>0&&<section className="ulabs-detail-section"><h3>{t.composition} <span>({details.composition.length})</span></h3><ol className="ulabs-composition">{details.composition.map((s,i)=><li key={i}>{s}</li>)}</ol></section>}
      {childTopics.length>0&&<section className="ulabs-detail-section"><h3>{t.topics} ({childTopics.length})</h3><ol className="ulabs-composition">{childTopics.map(p=><li key={p.id}>{p.title}</li>)}</ol></section>}
      <section className="ulabs-detail-section"><h3>{t.original} ({details.pages.length})</h3><a className="ulabs-original-pdf-link" href={details.catalogPageURL} rel="noopener noreferrer" target="_blank">↗ {t.docLink} · {t.page} {details.pages[0]}</a><p className="ulabs-detail-note">{t.pdf}</p><div className="ulabs-source-pages">{details.pages.map(page=><button type="button" key={page} onClick={()=>setPhotoPage(documentImage(details,page))}><img loading="lazy" src={documentImage(details,page)} alt={`${t.page} ${page}`} /><span>{t.page} {page} ↗</span></button>)}</div></section>
      {details.sourceExtract&&<details className="ulabs-source-text"><summary>{t.source} · PDF текст</summary><pre>{details.sourceExtract}</pre></details>}
      <div className="ulabs-detail-note">{details.group==='demo'?t.skip:t.pdf}</div>
    </section></div>}
    {request && <RequestModal item={request} language={language} user={user} onClose={()=>setRequest(null)}/>}
    {photoPage && <div className="ulabs-image-viewer" onMouseDown={e=>{if(e.target===e.currentTarget)setPhotoPage(null)}}><button type="button" onClick={()=>setPhotoPage(null)} aria-label={t.close}>×</button><img src={photoPage} alt={t.original}/><a href={photoPage} rel="noopener noreferrer" target="_blank">{t.full} ↗</a></div>}
  </div>
}
