import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createApplication } from '../api/api'
import Icon from './Icons'
import './CartDrawer.css'

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart
  } = useCart()
  const { user, isAuthenticated } = useAuth()

  const [showModal, setShowModal] = useState(false)
  // ULABS_DELIVERY_EXTENSION_V2: address captured explicitly for cart orders.
  const [ulabsDelivery, setUlabsDelivery] = useState(() => ({
    method: 'pickup', city: (() => {try {return localStorage.getItem('stem_city') === 'almaty' ? 'almaty' : 'astana'} catch {return 'astana'}})(), otherCity: '', address: ''
  }))

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleClose = () => setIsOpen(false)

  if (!isOpen) return null

  const handleOpenModal = () => {
    setShowModal(true)
    setSubmitSuccess(false)
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      comment: ''
    })
  }

  const handleCloseModal = () => setShowModal(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const products = cartItems.map((item) => ({
        name: item.name || item.title || 'Товар',
        article: item.article || null,
        quantity: item.quantity || 1,
        url: item.url || window.location.href,
        color: item.color || null
      }))

      const applicationData = {
        location_city: ulabsDelivery.city === 'other' ? ulabsDelivery.otherCity.trim() : ulabsDelivery.city === 'almaty' ? 'Алматы' : 'Астана',
        location_address: ulabsDelivery.method === 'delivery' ? ulabsDelivery.address.trim() : (ulabsDelivery.city === 'almaty' ? 'г. Алматы, пр. Аль-Фараби 77/2' : 'г. Астана, ул. Домалак-ана 26'),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        comment: formData.comment.trim(),
        product_name: cartItems
          .map((i) => i.name || i.title)
          .filter(Boolean)
          .join(', '),
        article: cartItems
          .map((i) => i.article)
          .filter(Boolean)
          .join(', '),
        product_url: window.location.href,
        products
      }

      await createApplication(applicationData)

      setSubmitSuccess(true)

      setTimeout(() => {
        setShowModal(false)
        clearCart()
        handleClose()
      }, 2000)
    } catch (err) {
      console.error('Ошибка отправки заявки:', err)
      alert('Ошибка при отправке. Попробуйте снова.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="cart-overlay" onClick={handleClose} />

      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2>Корзина</h2>
          <button
            className="cart-drawer__close"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            type="button"
            aria-label="Закрыть корзину"
          >
            <Icon.X width="16" height="16" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-drawer__empty">
            <span><Icon.ShoppingCart width="48" height="48" /></span>
            <p>Ваша корзина пуста</p>
            <button
              className="cart-drawer__checkout"
              onClick={handleClose}
              type="button"
            >
              Продолжить покупки
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {cartItems.map((item) => {
                const itemQty = item.quantity || 1
                const cartKey = item._cartKey || `${item.id}__${item.color || ''}`

                return (
                  <div key={cartKey} className="cart-item">
                    <img
                      className="cart-item__img"
                      src={item.img}
                      alt={item.name || 'Товар'}
                    />

                    <div className="cart-item__info">
                      <p className="cart-item__name">{item.name || item.title || 'Товар'}</p>
                      {item.color && (
                        <p className="cart-item__color">
                          Цвет: <strong>{item.color}</strong>
                        </p>
                      )}
                      <p className="cart-item__article">
                        Арт: {item.article || '—'}
                      </p>

                      <div className="cart-item__qty">
                        <button onClick={() => decreaseQty(cartKey)} type="button">
                          −
                        </button>
                        <span>{itemQty}</span>
                        <button onClick={() => increaseQty(cartKey)} type="button">
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(cartKey)}
                      type="button"
                    >
                      <Icon.X width="14" height="14" />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="cart-drawer__footer">
              <button
                className="cart-drawer__checkout"
                onClick={handleOpenModal}
                type="button"
              >
                Оформить заявку
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={handleCloseModal}
              type="button"
            >
              <Icon.X width="16" height="16" />
            </button>

            <h2>Оформить заявку</h2>

            <div className="modal-product-info">
              <p>
                Товары:{' '}
                <strong>
                  {cartItems
                    .map((i) => i.name || i.title)
                    .filter(Boolean)
                    .join(', ')}
                </strong>
              </p>
              <p>
                Количество: <strong>{cartItems.length}</strong>
              </p>
            </div>

            {submitSuccess ? (
              <div className="modal-success">
                <span><Icon.CheckCircle width="48" height="48" /></span>
                <h3>Заявка отправлена!</h3>
                <p>Наш менеджер свяжется с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="cart-name">Ваше имя *</label>
                  <input
                    type="text"
                    id="cart-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cart-phone">Телефон *</label>
                  <input
                    type="tel"
                    id="cart-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cart-comment">Комментарий</label>
                  <textarea
                    id="cart-comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Дополнительная информация (необязательно)"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cart-delivery-city">Город *</label>
                  <select id="cart-delivery-city" value={ulabsDelivery.city} onChange={e=>setUlabsDelivery(prev=>({...prev,city:e.target.value,method:e.target.value==='other'?'delivery':prev.method}))}>
                    <option value="astana">Астана</option><option value="almaty">Алматы</option><option value="other">Другой город</option>
                  </select>
                </div>
                {ulabsDelivery.city === 'other' && <div className="form-group"><label htmlFor="cart-other-city">Название города *</label><input id="cart-other-city" required value={ulabsDelivery.otherCity} onChange={e=>setUlabsDelivery(prev=>({...prev,otherCity:e.target.value}))}/></div>}
                <div className="form-group"><label htmlFor="cart-delivery-method">Получение *</label><select id="cart-delivery-method" value={ulabsDelivery.method} onChange={e=>setUlabsDelivery(prev=>({...prev,method:e.target.value}))}>
                  {ulabsDelivery.city !== 'other' && <option value="pickup">Самовывоз</option>}
                  <option value="delivery">Доставка по Казахстану</option>
                </select></div>
                {ulabsDelivery.method === 'delivery' && <div className="form-group"><label htmlFor="cart-delivery-address">Адрес доставки *</label><input id="cart-delivery-address" required value={ulabsDelivery.address} onChange={e=>setUlabsDelivery(prev=>({...prev,address:e.target.value}))} placeholder="Улица, дом, офис" /></div>}
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Отправка...' : 'Отправить заявку'}
                </button>

                <p className="form-note">Ваши данные защищены.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}