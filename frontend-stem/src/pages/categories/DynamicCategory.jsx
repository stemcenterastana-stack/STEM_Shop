import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '../../components/ProductList'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import { apiClient } from '../../api/api'

export default function DynamicCategory() {
  const { slug } = useParams()

  const { products, loading } = useCategoryProducts(slug)

  const [categoryTitle, setCategoryTitle] = useState('')

  useEffect(() => {
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
  }, [slug])

  const isXerox = slug === 'xerox-printers'

  return (
    <ProductList
      products={products}
      loading={loading}
      title={categoryTitle || slug}
      backPath={isXerox ? '/electro' : '/secondpage'}
      backLabel={isXerox ? 'Электротехника' : 'Мебель'}
    />
  )
}