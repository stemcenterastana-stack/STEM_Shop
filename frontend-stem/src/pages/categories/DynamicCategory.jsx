import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import { apiClient } from '../../api/api'


const XEROX_PRODUCTS = [
  {
    id: 'xerox-b225dni',
    staticProduct: true,
    title: 'Xerox B225DNI',
    img: '/img/xerox/xerox-b225dni.png',
    article: 'B225DNI',
    in_stock: true,
    category_slug: 'xerox-printers',
    description_ru:
      'Монохромное многофункциональное устройство Xerox B225DNI формата A4 для печати, копирования и сканирования.',
    description_kz:
      'Xerox B225DNI — A4 форматындағы басып шығару, көшіру және сканерлеуге арналған монохромды көпфункциялы құрылғы.',
    specs: [
      { label: 'Процессор', value: '1 ГГц' },
      { label: 'Оперативная память', value: '512 МБ' },
      { label: 'Скорость печати', value: 'до 34 стр./мин.' },
      { label: 'Максимальная нагрузка', value: 'до 30 000 стр./мес.' },
      { label: 'Рекомендуемая нагрузка', value: 'до 2 500 стр./мес.' },
      { label: 'Автоподатчик', value: 'односторонний, до 50 листов' },
      { label: 'Скорость сканирования', value: 'до 23 изобр./мин.' },
      { label: 'Разрешение сканирования', value: 'до 1200×1200 dpi' },
      { label: 'Интерфейсы', value: 'USB-B, Ethernet, Wi-Fi' },
      { label: 'Панель управления', value: 'ЖК-дисплей' },
    ],
  },

  {
    id: 'xerox-b235dni',
    staticProduct: true,
    title: 'Xerox B235DNI',
    img: '/img/xerox/xerox-b235dni.png',
    article: 'B235DNI',
    in_stock: true,
    category_slug: 'xerox-printers',
    description_ru:
      'Монохромное МФУ Xerox B235DNI формата A4 с сенсорным экраном, Wi-Fi, Ethernet и факсом.',
    description_kz:
      'Xerox B235DNI — сенсорлы экраны, Wi-Fi, Ethernet және факсы бар A4 монохромды МФҚ.',
    specs: [
      { label: 'Процессор', value: '1 ГГц' },
      { label: 'Оперативная память', value: '512 МБ' },
      { label: 'Скорость печати', value: 'до 34 стр./мин.' },
      { label: 'Максимальная нагрузка', value: 'до 30 000 стр./мес.' },
      { label: 'Рекомендуемая нагрузка', value: 'до 2 500 стр./мес.' },
      { label: 'Автоподатчик', value: 'односторонний, до 50 листов' },
      { label: 'Скорость сканирования', value: 'до 23 изобр./мин.' },
      { label: 'Разрешение сканирования', value: 'до 1200×1200 dpi' },
      { label: 'Интерфейсы', value: 'USB-B, USB-A, Ethernet, Wi-Fi, Fax' },
      { label: 'Панель управления', value: 'сенсорный дисплей 2.8"' },
    ],
  },

  {
    id: 'xerox-b305dni',
    staticProduct: true,
    title: 'Xerox B305DNI',
    img: '/img/xerox/xerox-b305dni.png',
    article: 'B305DNI',
    in_stock: true,
    category_slug: 'xerox-printers',
    description_ru:
      'Монохромное МФУ Xerox B305DNI формата A4 с высокой скоростью печати и сенсорным дисплеем.',
    description_kz:
      'Xerox B305DNI — жоғары басып шығару жылдамдығы және сенсорлы экраны бар A4 монохромды МФҚ.',
    specs: [
      { label: 'Процессор', value: '1 ГГц' },
      { label: 'Оперативная память', value: '512 МБ' },
      { label: 'Скорость печати', value: 'до 38 стр./мин.' },
      { label: 'Максимальная нагрузка', value: 'до 80 000 стр./мес.' },
      { label: 'Рекомендуемая нагрузка', value: 'до 6 000 стр./мес.' },
      { label: 'Автоподатчик', value: 'односторонний, до 50 листов' },
      { label: 'Скорость сканирования', value: 'до 46 изобр./мин.' },
      { label: 'Разрешение сканирования', value: 'до 600×600 dpi' },
      { label: 'Интерфейсы', value: 'USB-B, USB-A, Ethernet, Wi-Fi' },
      { label: 'Панель управления', value: 'сенсорный дисплей 2.8"' },
    ],
  },

  {
    id: 'xerox-b315dni',
    staticProduct: true,
    title: 'Xerox B315DNI',
    img: '/img/xerox/xerox-b315dni.png',
    article: 'B315DNI',
    in_stock: true,
    category_slug: 'xerox-printers',
    description_ru:
      'Монохромное МФУ Xerox B315DNI формата A4 с двусторонним автоподатчиком, Wi-Fi, Ethernet и факсом.',
    description_kz:
      'Xerox B315DNI — екіжақты автоподатчигі, Wi-Fi, Ethernet және факсы бар A4 монохромды МФҚ.',
    specs: [
      { label: 'Процессор', value: '1 ГГц' },
      { label: 'Оперативная память', value: '512 МБ' },
      { label: 'Скорость печати', value: 'до 40 стр./мин.' },
      { label: 'Максимальная нагрузка', value: 'до 80 000 стр./мес.' },
      { label: 'Рекомендуемая нагрузка', value: 'до 6 000 стр./мес.' },
      { label: 'Автоподатчик', value: 'двусторонний, до 50 листов' },
      { label: 'Скорость сканирования', value: 'до 92 изобр./мин.' },
      { label: 'Разрешение сканирования', value: 'до 600×600 dpi' },
      { label: 'Интерфейсы', value: 'USB-B, USB-A, Ethernet, Wi-Fi, Fax' },
      { label: 'Панель управления', value: 'сенсорный дисплей 2.8"' },
    ],
  },
]


export default function DynamicCategory() {
  const { slug } = useParams()

  const {
    products: apiProducts,
    loading
  } = useCategoryProducts(slug)

  const [categoryTitle, setCategoryTitle] = useState('')

  const isXerox = slug === 'xerox-printers'

  useEffect(() => {
    if (isXerox) {
      setCategoryTitle('Принтеры и МФУ Xerox')
      return
    }

    const loadCategoryTitle = async () => {
      try {
        const res = await apiClient.get(`/api/categories/${slug}`)

        setCategoryTitle(
          res.data.title_ru ||
          res.data.slug ||
          slug
        )
      } catch {
        setCategoryTitle(slug)
      }
    }

    if (slug) {
      loadCategoryTitle()
    }
  }, [slug, isXerox])

  const products = isXerox
    ? XEROX_PRODUCTS
    : apiProducts

  return (
    <ProductList
      products={products}
      loading={loading}
      title={isXerox ? 'Принтеры и МФУ Xerox' : categoryTitle || slug}
      backPath={isXerox ? '/electro' : '/secondpage'}
      backLabel={isXerox ? 'Электротехника' : 'Мебель'}
    />
  )
}