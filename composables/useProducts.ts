import type { ProductDetail, ProductInfo } from '~/types'

let allProducts = [] as ProductInfo[]

export function useProducts() {
  const route = useRoute()
  const router = useRouter()

  const products = useState<ProductInfo[]>('products')

  function getCategoryQuery(): string {
    return route.query.category as string
  }

  function setCategoryQuery(value: string): void {
    router.push({ query: { ...route.query, category: value || undefined } })
  }

  function setProducts(newProducts: ProductInfo[]): void {
    if (!Array.isArray(newProducts))
      throw new Error('Products must be an array.')
    products.value = newProducts ?? []
    allProducts = JSON.parse(JSON.stringify(newProducts))
  }

  const updateProductList = async (): Promise<void> => {
    const { scrollToTop } = useHelpers()
    const { isSearchActive, searchProducts } = useSearching()

    // scroll to top of page
    scrollToTop()

    // return all products if no filters are active
    if (!isSearchActive.value) {
      products.value = allProducts
      return
    }

    // otherwise, apply filter, search and sorting in that order
    try {
      let newProducts = [...allProducts]
      if (isSearchActive.value) newProducts = searchProducts(newProducts)
      console.log('newProducts', newProducts)

      products.value = newProducts
    } catch (error) {
      console.error(error)
    }
  }

  function getProduct(name: string) {
    return products.value.find((product) => product.name === name) || null
  }

  async function fetchProducts() {
    const { data, error } = await useFetch<ProductInfo[]>('/api/products')
    if (data.value) setProducts(data.value)
    if (error.value) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch product list',
      })
    }
    return products.value
  }

  async function fetchProductDetail(key: string) {
    // 站不使用 server/api 動態取得 public json
    // const { data: productDetail, error } = await useFetch<Partial<ProductDetail>>(`/api/products/${key}`)
    const { data: productDetail, error } = await useFetch<
      Partial<ProductDetail>
    >(`/json/productDetails/${key}.json`)

    if (error.value) {
      throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    }
    return productDetail.value
  }

  return {
    products,
    allProducts,
    getCategoryQuery,
    setCategoryQuery,
    setProducts,
    updateProductList,
    getProduct,
    fetchProducts,
    fetchProductDetail,
  }
}
