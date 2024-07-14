let allProducts = [] as Product[]

export function useProducts() {
  const route = useRoute()
  const router = useRouter()

  const products = useState<Product[]>('products')

  function getCategoryQuery(): string {
    return route.query.category as string
  }

  function setCategoryQuery(value: string): void {
    router.push({ query: { ...route.query, category: value || undefined } })
  }

  function setProducts(newProducts: Product[]): void {
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

  return {
    products,
    allProducts,
    getCategoryQuery,
    setCategoryQuery,
    setProducts,
    updateProductList,
  }
}